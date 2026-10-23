const WebSocket=require('ws');
const jwt=require('jsonwebtoken');
const db=require('./db')
const pool =require('./db')
const bcrypt=require('bcryptjs')
function setupWebSocket(server){
    const wss=new WebSocket.Server({noServer: true});

    const rooms= new Map();
    server.on('upgrade',async(request, socket,head)=>{
        const reject=(code,msg)=>{
            socket.write(`HTTP/1.1 ${code} ${msg}\r\n\r\n`)
            socket.destroy();
        }
        console.log("attempting connection")
        const url=new URL(request.url,`http://${request.headers.host}`);
        const roomId=url.searchParams.get('roomId')
        const viewToken=url.searchParams.get('view')
        if(viewToken && roomId){
            try{
                const v=await db.query('select 1 from rooms where room_id=$1 and read_link=$2',
                    [roomId, viewToken]
                )
                if(!v.rows.length)
                    return reject(403, 'Forbidden')
            }
            catch(err){
                console.log(err)
                return reject(500,'server')
            }
            return wss.handleUpgrade(request, socket, head, (ws)=>{
                ws.user={username:'viewer'}
                ws.roomId=roomId
                ws.viewOnly=true
                wss.emit('connection', ws,request)
            })
        }
        const token=request.headers.cookie?.match(/token=([^;]+)/)?.[1];

        if (!roomId || !token){
            return reject (401,'Unauthorised');
        } 
        let decode= {username:"Tester"}
        try{
            decode=jwt.verify(token, process.env.JWT_SECRET)
        }
        catch(err){
            console.log(err)
            return reject (401,'Unauthorised');
        }
        try{
            const m=await db.query(
                `select 1 from workspace where username=$1 and room_id=$2;`
                ,[decode.username,roomId]
            )
            if(!m.rows.length)
                return reject (403, 'NO workspaces')
        }

        catch(err)
        {
            console.log(err)
            return reject (500,'Server');
        }
         wss.handleUpgrade(request, socket, head, (ws)=>{
                console.log("handshake")
                ws.user=decode;
                ws.roomId=roomId;
                wss.emit('connection',ws,request);
            });
    });
    wss.on('connection', (ws)=>{
        console.log("joined the room", ws.roomId);
        const {roomId,user, viewOnly}=ws;
        if(!rooms.has(roomId))
            rooms.set(roomId, new Set());
        rooms.get(roomId).add(ws);

        ws.on('message',async(rawMsg)=>{
            if(viewOnly) return
           try{
            const roomc=rooms.get(roomId);
            const data=JSON.parse(rawMsg.toString());
            if(!roomc) return;
            
            if(data.type === 'save' && data.payload){
                const element=data.payload;
                
                for (let e of element){
                    const query=`insert into canvas(element_id, element_type, properties, room_id, created_by, modified_by)
                    values ($1,$2,$3,$4,$5,$6)
                    on conflict (element_id)
                    do update set properties=excluded.properties, modified_by=excluded.modified_by;`;
                    const values=[e.id, e.type,JSON.stringify(e), roomId, user.username, user.username];
                    await db.query(query,values).catch(err=>{console.log("DB error",err)});
                }
                return;
            }

            switch(data.type)
            {
                case 'cursor':
                    toRoom(ws,roomc,{...data, user: user.username})
                    break;
                case 'element':
                    toRoom(ws,roomc,data)
                    break;
                case 'elementLock':
                    toRoom(ws,roomc,data)
                    break;
                case 'save':
                    const client=await db.pool.connect();
                    try{
                        await client.query('BEGIN');
                        for(const e of data.payload){
                            await client.query(
                                `insert into canvas (room_id, element_id properties,modified_by)
                                values($1, $2, $3, $4)
                                on conflict(element_id)
                                do update set properties=excluded.properties, modified_by=excluded.modified_by
                                where canvas.room_id = excluded.room_id;`,
                                [roomId,e.id,JSON.stringify(e), user,username]
                            );
                        }
                        await client.query('COMMIT');
                    }
                    catch(err){
                        await client.query("ROLLBACK");
                        console.error('save error', err);
                    }
                    finally{
                        client.release();
                    }
                    break;
                default:
                    console.warn(`wrong type ${data.type}`)
            }
        }
        catch(err){
            console.error("Invalid",err.message)
        }
        });

        function toRoom(senderWs,roomc,payload){
            roomc.forEach(client => {
                if(client!==senderWs && client.readyState===1){
                    client.send(JSON.stringify(payload));
                }
            });
        }

        ws.on('close',()=>{
            const roomc = rooms.get(roomId);
            if(roomc){
                roomc.delete(ws);
                if(!viewOnly) toRoom(ws,roomc,{type:'leave',user:user.username})
                toRoom(ws,roomc,{type:'leave', user:user.username});
                if(roomc.size===0)
                    rooms.delete(roomId);
            }
        });
    });
    function closeRoom(roomId){
        const roomc=rooms.get(roomId)
        if(!roomc) return
        rooms.delete(roomId)
        roomc.forEach(c=>{
            if(c.readyState===1){
            c.send(JSON.stringify({type:'room_deleted'}))
            c.close(4000, 'room deleted')
            }
        })
    }
    return {closeRoom}
};

module.exports=setupWebSocket;
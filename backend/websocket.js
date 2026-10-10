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
            socket.write(`${code}   |   ${msg}`)
            socket.destroy();
        }
        console.log("attempting connection")
        const url=new URL(request.url,`http://${request.headers.host}`);
        const roomId=url.searchParams.get('roomId')
        const token=request.headers.cookies?.match(/token=([^;]+)/)?.[1];
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
                ,[user.username,roomId]
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
        const {roomId,user}=ws;
        if(!rooms.has(roomId))
            rooms.set(roomId, new Set());
        rooms.get(roomId).add(ws);

        ws.on('message',async(rawMsg)=>{
           try{
            const roomc=rooms.get(roomId);
            const data=JSON.parse(rawMsg.toString());
            if(!roomc) return;
            if(data.type === 'join_room'){
                const rpasscheck=await db.query(`select room_password from rooms where room_id=$1;`,[roomId]);
                if(rpasscheck.length>0){
                    const passhash=rpasscheck.rows[0].room_password;
                    if(passhash){
                        const isvalid=await bcrypt.compare(data.rpasscheck, passhash)
                        if(!isvalid){
                            ws.send(JSON.stringify({type: 'error', message:'Incorrect password'}))
                            return;
                        }
                    }
                }
                ws.send(JSON.stringify({
                    type:'joined', message:'successfully joined the room'
                }))
            }
            if(data.type === 'save' && data.payload){
                const element=data.payload;
                
                    await pool.query(
                        `insert into rooms (room_id) values($1) on conflict(room_id) do nothing;`,[ws.roomId]
                    );
                    await pool.query(
                        `insert into canvas (room_id,elements) values($1,$2) on conflict(room_id) do nothing;`,[ws.roomId, JSON.stringify(data.payload)]
                    )
                    console.log(`Success saved${data.payload.length} elements in room ${roomId}`)
                
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
                    toRoom(ws,roomc,data)
                    break;
                case 'element':
                    toRoom(ws,roomc,data)
                    break;
                case 'elementLock':
                    toRoom(ws,roomc,data)
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
                if(roomc.size===0)
                    rooms.delete(roomId)
            }
        });
    });
};

module.exports=setupWebSocket;
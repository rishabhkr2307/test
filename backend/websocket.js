const WebSocket=require('ws');
const jwt=require('jsonwebtoken');
const db=require('./db')

function setupWebSocket(server){
    const wss=new WebSocket.Server({noServer: true});

    const rooms= new Map();
    server.on('upgrade',(request, socket,head)=>{
        console.log("attempting connection")
        const cookieH=request.headers.cookie || '';
        const match = cookieH.match(/token=([^;]+)/)
        const token=match? match[1] : null;
        const burl=`http://${request.headers.host}`
        const purl=new URL(request.url, burl);
        console.log(request.url)
        const roomid=purl.searchParams.get('roomId')
        if(!token || !roomid){
            console.log("rejected")
            socket.write('Unauthorized')
            socket.destroy();
            return;
        }

        try{
            const decode=jwt.verify(token, process.env.JWT_SECRET);
            console.log(`jwt verified user:${decode.username} | room:${roomid}`)
            wss.handleUpgrade(request, socket, head, (ws)=>{
                console.log("handshake")
                ws.user=decode;
                ws.roomId=roomid;
                wss.emit('connection',ws,request);
            });
        }
        catch(err){
            console.log("Rejected")
            console.log("hello",err.message)
            socket.write('Unauthorized');
            socket.destroy();
        }
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

            if(data.type === 'save' && data.payload){
                const element=data.payload;

                for (e of element){
                    const query=`insert into canvas(element_id, element_type, properties, room_id, created_by, modified_by)
                    values ($1,$2,$3,$4,$5,$6)
                    on conflict (element_id)
                    do update set properties=excluded.properties, last modified=excluded.modified_by;`;
                    const values=[e.id, e.type,JSON.stringify(e), roomId, user.username, user.username];
                    await db.query(query,values).catch(err=>{console.log("error",err)});
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
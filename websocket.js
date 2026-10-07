const WebSocket=require('ws');
const jwt=require('jsonwebtoken');

function setupWebSocket(server){
    const wss=new WebSocket.Server({noServer: true});

    const rooms= new Map();
    server.on('upgrade',(request, socket,head)=>{
        console.log("attempting connection")
        console.log(`raw url= ${request.url}`)
        const url= new URL(request.url, `http://${request.headers.host}`);
        const token=url.searchParams.get('token')
        const roomid=url.searchParams.get('roomid') || url.searchParams.get('roomId')
        console.log(roomid)
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
                ws.user=decode;
                ws.roomId=roomid;
                wss.emit('connection',ws,request);
            });
        }
        catch(err){
            console.log("hello",err.message)
            console.log("Rejected")
            socket.write('Unauthorized');
            socket.destroy();
        }
    });
    wss.on('connection', (ws)=>{
        console.log(`User ${ws.user.username} fully connected to room ${ws.roomId}!`);
        
        const {roomId, user} = ws;
        if(!rooms.has(roomId))
            rooms.set(roomId, new Set());
        rooms.get(roomId).add(ws);

        ws.on('message', (rawMsg) => {
            console.log(`eceived from ${ws.user.username}:`, rawMsg.toString());
           try{
            const roomc=rooms.get(roomId);
            console.log(`recieved from ${ws.user.username}`, rawMsg.toString())
            const data=JSON.parse(rawMsg.toString());
            if(!roomc) return;
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

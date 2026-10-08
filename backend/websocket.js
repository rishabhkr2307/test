const WebSocket=require('ws');
const jwt=require('jsonwebtoken');
const url=require('url')

function setupWebSocket(server){
    const wss=new WebSocket.Server({noServer: true});

    const rooms= new Map();
    server.on('upgrade',(request, socket,head)=>{
        console.log("attempting connection")
        const purl=url.parse(request.url, true)
        console.log(request.ur)
        const token=purl.query.token;
        const roomid=purl.query.roomId;
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
                ws.emit('Connect',ws,request);
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
        const {roomId,user}=ws;
        if(!rooms.has(roomId))
            rooms.set(roomId, new Set());
        rooms.get(roomId).add(ws);

        ws.on('message',(rawMsg)=>{
           try{
            const roomc=rooms.get(roomId);
            const data=JSON.parse(rawMsg.toString());
            if(!roomc) return;
            switch(data.type)
            {
                case 'cursor':
                    toRoom(ws,roomc,data)
                    break;
                case 'element':
                    toRoom(ws.roomc,data)
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
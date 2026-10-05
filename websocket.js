const WebSocket=require('ws');
const jwt=require('jsonwebtoken');

function setupwebsocket(server){
    const wss=new WebSocket.Server({noServer: true});

    const rooms= new Map();
    server.on('upgrade',(request, socket,head)=>{
        const url= new URL(request.url, `http://${request.headers.host}`);
        const token=url.searchParams.get('token')
        const roomid=url.searchParams.get('roomid)')
        if(!token || !roomid){
            socket.write('Unauthorized')
            socket.destroy();
            return;
        }

        try{
            const decode=jwt.verify(token, process.env.JWT_SECRET);

            wss.handleupgrade(request, socket, head, (ws)=>{
                ws.user=decode;
                ws.roomId=roomid;
                ws.emit('Connect',ws,request);
            });
        }
        catch(err){
            socket.write('Unauthorized');
            socket.destroy();
        }
    });
    wss.on('connection', (ws)=>{
        const {roomId,user}=ws;
        if(!rooms.has(roomId))
            rooms.set(roomId, new set());
        rooms.get(roomId).add(ws);

        ws.on('message',(data)=>{
            const roomc=roomId.get(roomId);
            if(!roomc) return;

            roomc.array.forEach(client => {
                if(client!==ws && client.readyStare===1){
                    client.send(data);
                }
            });
        });
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

module.export=setupwebsocket;

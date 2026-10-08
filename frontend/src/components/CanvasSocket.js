import { useEffect, useRef } from "react";

export function CanvasSocket(roomId, token, onMessage){
    const ws=useRef(null);
    
    useEffect(()=>{
        if(!roomId || !token){
            console.log("missing");
            return;
        }
        console.log("connecting")
        const socketUrl=`ws://localhost:8080?roomId=${roomId}&token=${token}`;
        ws.current= new WebSocket(socketUrl);

        ws.current.onopen=()=> console.log(`room: ${roomId}`)
        ws.current.onerror=(error)=>console.log('Error',error);
        ws.current.onclose=()=>console.log('Closed')

        ws.current.onmessage= (e)=>{
            console.log("REcieved", e.data);
            try{
            const data=JSON.parse(e.data);
            if(onMessage) {
                onMessage(data)
               }
        }
            catch(err){
                console.log("Failed parsing", err);
            }
        };

        return()=>{
            if(ws.current) ws.current.close();
        };
    },[roomId, token])

    const sendMsg=(p)=>{
        if(ws.current && ws.current.readyState ===WebSocket.OPEN){
            ws.current.send(JSON.stringify(p));
        }
    };
    return {sendMsg};
}
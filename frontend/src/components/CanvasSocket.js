import { useEffect, useRef } from "react";

export function CanvasSocket(roomId, token){
    const ws=useRef(null);

    useEffect(()=>{
        
        const socketUrl=`ws://localhost:8080?roomId=${roomId}&token=${token}`;
        ws.current= new WebSocket(socketUrl);

        ws.current.onopen=()=> console.log(`room: ${roomId}`)
        ws.current.onerror=()=>console.log('Error',error);
        ws.current.onclose=()=>console.log('Closed')

        ws.current.onmessage= (e)=>{
            const data=JSON.parse(e.data);
            console.log("REcieved");
        };

        return()=>{
            if(ws.current) ws.current.close();
        };
    })

    const sendMsg=(p)=>{
        if(ws.current && ws.current.ready ===WebSocket.OPEN){
            ws.current.send(JSON.stringify(p));
        }
    };
    return {sendMsg};
}
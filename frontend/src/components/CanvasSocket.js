import { useEffect, useRef } from "react";

export function CanvasSocket(roomId, token){
    const ws=useRef(null);

    useEffect(()=>{
        
        const socketUrl=`ws://localhost:8080?roomId=${roomId}&token=${token}`;
        ws.current= new WebSocket(socketUrl);

        ws.current.onopen=()=> console.log(`room: ${roomId}`)
        ws.current.onerror=()=>console.log('Error',error);
        ws,current.onclose=()=>console.log('Closed')
    })
}
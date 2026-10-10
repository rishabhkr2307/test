import React, { useRef, useEffect, useState } from 'react';
import { CanvasSocket } from './CanvasSocket';
import {Excalidraw} from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css';

export default function Canvas({roomId}) {
    const [exdrApi, setExdrApi]=useState(null)
    const timer=useRef(null)
    const lastpointerup=useRef(0)
    const handle=(data)=>{
        if(!exdrApi) return;
        console.log("recieved: ",data)
    }

    const {sendMsg}=CanvasSocket(roomId, handle);
    const handlech=(elements, appState)=>{
        if(sendMsg){
            if(timer.current){
                clearTimeout(timer.current)
            }
            timer.current=setTimeout(()=>{
                sendMsg({type: 'element', payload: elements})
                sendMsg({type: 'save', payload: elements})
            },500)
        }
    };

    const handlepu=(payload)=>{
        const now=Date.now();
        if(sendMsg){
            if(now-lastpointerup.current>50)
                sendMsg({
            type: 'cursor',
            pointer:{x:payload.pointer.x, y:payload.pointer.y}
        });
        lastpointerup.current=now;
    }
    };

    return (
        <div style={{ width:'100%', height:'100%', position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:10}}>
           <Excalidraw
           excalidrawAPI={(api)=>setExdrApi(api)}
           onChange={handlech}
           onPointerUpdate={handlepu}
           theme='dark'
           />
        </div>
    );
}
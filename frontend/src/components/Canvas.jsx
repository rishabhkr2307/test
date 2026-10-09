import React, { useRef, useEffect, useState } from 'react';
import { CanvasSocket } from './CanvasSocket';
import {Excalidraw} from '@excalidraw/excalidraw'

export default function Canvas({roomId}) {
    const {exdrApi, setExdrApi}=useState(null)
    const handle=(data)=>{
        if(!exdrApi) return;
        console.log("recieved: ",data)
    }

    const {sendMsg}=CanvasSocket(roomId, handle);
    const handlech=(elements, appState)=>{
        if(sendMsg){
            sendMsg({
                type: 'element',
                payload: elements
            })
        }
    };

    const handlepu=(payload)=>{
        if(sendMsg){
            sendMsg({
                type: 'cursor',
                pointer:{x:payload.pointer.x, y:payload.pointer.y}
            })
        }
    };

    return (
        <div style={{ backgroundColor: '#1e1e1e', width: '100vw', height: '100vh', overflow: 'hidden' }}>
           <Excalidraw
           exdrApi={(api)=>setExdrApi(api)}
           onChange={handlech}
           onPointerUpdate={handlepu}
           theme='dark'
           />
        </div>
    );
}
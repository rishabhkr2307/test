import React, { useRef, useEffect, useState } from 'react';
import { CanvasSocket } from './CanvasSocket';
import {Excalidraw} from '@excalidraw/excalidraw'

export default function Canvas({roomId}) {
    const [exdrApi, setExdrApi]=useState(null)
    const timer=useRef(null)
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
            timer.current=setTimeout(()=>{
                sendMsg({
                    type: 'save', payload: elements
                })
            },1000)
        
            if (timer.current){
                clearTimeout(timer.current)
            }
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
        <div style={{ width:'100%', height:'100%', position:'fixed', top:0, left:0, right:0, bottom:0, zindex:10, display:'flex', flexDirection:'row'}}>
           <Excalidraw
           exdrApi={(api)=>setExdrApi(api)}
           onChange={handlech}
           onPointerUpdate={handlepu}
           theme='dark'
           />
        </div>
    );
}
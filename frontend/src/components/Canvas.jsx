import React, { useRef, useEffect, useState } from 'react';
import { CanvasSocket } from './CanvasSocket';
import {Excalidraw, reconcileElements, restoreElements} from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css';

export default function Canvas({roomId}) {   
    const [exdrApi, setExdrApi]=useState(null)
    const timer=useRef(null)
    const [initial, setInitial]=useState(null)
    const lastpointerup=useRef(0)
    const knownversions=useRef({})
    const collaborators=useRef(new Map());
    const pending=useRef(new Map())
    
    useEffect(()=>{
        fetch(`/api/room-elements/${roomId}`, {credentials:'include'})
        .then(r=>r.json())
        .then(d=>{
            const els=d.elements || [];
        els.forEach(e=>{knownversions.current[e.id]=e.version})
        setInitial(els)})
        .catch(()=> setInitial([]))
    },[roomId])

    const handle=(data)=>{
        if(!exdrApi) return;
        if(data.type ==='element' && data.payload){
            data.payload.forEach(e=>{
                knownversions.current[e.id]=e.version})
                const remote = restoreElements(data.payload, null)
                const merged=reconcileElements(
                    exdrApi.getSceneElementsIncludingDeleted(),
                    remote, exdrApi.getAppState()
                )
            exdrApi.updateScene({elements:merged});
        }

        if(data.type ==='cursor' && data.pointer){
            collaborators.current.set(data.user,{
                pointer:{x: data.pointer.x, y: data.pointer.y,tool:'pointer'},
                button:"up",
                selectedElementsIds:{},
                username:data.user
            });
            exdrApi.updateScene({collaborators: new Map(collaborators.current)})
        }
        
        if(data.type ==='leave'){
            collaborators.current.delete(data.user);
            exdrApi.updateScene({ collaborators: new Map(collaborators.current)});
        }
    };

    const {sendMsg}=CanvasSocket(roomId, handle);
    const handlech=(elements, appState)=>{
        if(sendMsg){
            const changedEle=elements.filter(e=>{
                const isnew=knownversions.current[e.id] !==e.version;
                if(isnew) knownversions.current[e.id]=e.version;
                return isnew;
            })
            changedEle.forEach(e=>pending.current.set(e.id, e))
            if(pending.current.size===0) return
            clearTimeout(timer.current)
            timer.current=setTimeout(()=>{
                const batch=[...pending.current.values()]
                pending.current.clear()
                sendMsg({type:'element', payload:batch})
                sendMsg({type:'save', payload:batch})
            },500)
        }
    };

    const handlepu=(payload)=>{
        const now=Date.now();
        if(sendMsg && now-lastpointerup.current>50){
                sendMsg({
            type: 'cursor',
            pointer:{x:payload.pointer.x,
                y:payload.pointer.y}
        });
        lastpointerup.current=now;
      }
    };

    if (initial === null) 
        return (
        <div style={{color:'white', backgroundColor: 'grey', width:'100vw', height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            <h2>Loading canvas Data</h2>
            <p>IF stuck supabase is disconnect</p>
        </div>)
    return (
        <div style={{ width:'100vw', height:'100vh', position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:10}}>
           <Excalidraw
           excalidrawAPI={(api)=>setExdrApi(api)}
           initialData={{elements:initial}}
           onChange={handlech}
           onPointerUpdate={handlepu}
           theme='dark'
           />
           
        </div>
    );
}  
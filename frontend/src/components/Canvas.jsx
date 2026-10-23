import React, { useRef, useEffect, useState } from 'react';
import { CanvasSocket } from './CanvasSocket';
import {Excalidraw, reconcileElements,MainMenu, restoreElements} from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css';
import {useNavigate} from 'react-router-dom'
import {useTheme} from '../pages/ThemeContext'

export default function Canvas({roomId, viewToken}) {   
    const [exdrApi, setExdrApi]=useState(null)
    const viewOnly=Boolean(viewToken)
    const {theme}=useTheme()
    const brodcastTimer=useRef(null)
    const saveTimer=useRef(null)
    const [loadErr, setloadErr]=useState('')
    const [initial, setInitial]=useState(null)
    const lastpointerup=useRef(0)
    const knownversions=useRef({})
    const collaborators=useRef(new Map());
    const pendingBrodcast=useRef(new Map())
    const pendingSave=useRef(new Map())
    const nav=useNavigate()

    
    useEffect(()=>{
        const url=viewToken? `/api/public/room/${roomId}?view=${encodeURIComponent(viewToken)}`:
        `/api/room-elements/${roomId}`
        fetch(url, {credentials:'include'})
        .then(r=>{
            if(!r.ok) throw new Error(r.status===403?'Link is invalid':'could not load the canvas')
                return r.json()
        })
        .then(d=>{
            const els=d.elements || [];
        els.forEach(e=>{knownversions.current[e.id]=e.version})
        setInitial(els)})
        .catch((e)=> setloadErr(e.message))
    },[roomId, viewToken])

    const handle=(data)=>{
        if(data.type==='room_deleted'){
            alert('this room is deleted by the owner')
            nav('/dashboard', {replace:true})
            return;
        }
        if(!exdrApi) return;
       if (data.type === 'element' && data.payload) {
            data.payload.forEach(e => {
                knownversions.current[e.id] = e.version;
            });
            const remote = restoreElements(data.payload, null);
            const currentElements = exdrApi.getSceneElementsIncludingDeleted();
            const merged = reconcileElements(currentElements, remote, exdrApi.getAppState());
            exdrApi.updateScene({ elements: merged });
        }
        if(data.type ==='cursor' && data.pointer){
            collaborators.current.set(data.user,{
                pointer:{x: data.pointer.x, y: data.pointer.y,tool:'pointer'},
                button:"up",
                selectedElementIds:{},
                username:data.user
            });
            exdrApi.updateScene({collaborators: new Map(collaborators.current)})
        }
        
        if(data.type ==='leave'){
            collaborators.current.delete(data.user);
            exdrApi.updateScene({ collaborators: new Map(collaborators.current)});
        }
    };

    const {sendMsg}=CanvasSocket(roomId, handle, viewToken);
    const handlech=(elements)=>{
        if(viewOnly)
            return
            elements.forEach((e)=>{
                if(knownversions.current[e.id]!=e.version){
                    knownversions.current[e.id]=e.version
                    pendingBrodcast.current.set(e.id, e);
                pendingSave.current.set(e.id,e)}
        })
        if(pendingBrodcast.current.size===0) return
        clearTimeout(brodcastTimer.current)
        brodcastTimer.current=setTimeout(()=>{
            if(pendingBrodcast.current.size>0){
            const batch=[...pendingBrodcast.current.values()]
            pendingBrodcast.current.clear()
            sendMsg({type:'element', payload:batch})
            }
        },50)
        
        clearTimeout(saveTimer.current);
        saveTimer.current=setTimeout(()=>{
            if(pendingSave.current.size>0){
            const batch=[...pendingSave.current.values()]
            pendingSave.current.clear();
            sendMsg({type:'save', payload:batch})
            }
        },800)
    };
    const handlepu=(payload)=>{
        if(viewOnly) return
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
        if(loadErr){
            return(
                <div className='canvas-state'>
                    <h2>Can't open this canvas</h2>
                    <p className='muted'>{loadErr}</p>
                </div>
            )
        }

    if (initial === null) 
        return (
        <div >
            <h2>Loading canvas Data</h2>
            <p>IF stuck supabase is disconnect</p>
        </div>)


        
    return (
        <div className='canvas-wrap'>
            <div className='canvas-inner'>
            <Excalidraw excalidrawAPI={setExdrApi}
            initialData={{elements:restoreElements(initial,null), scrollToContent:true,
                appState:{currentItemFontFamily:2}
            }
        }
            viewModeEnabled={viewOnly}
            theme={theme}
            name={`Room ${roomId}`}
            onChange={handlech}
            onPointerUpdate={handlepu}
            UIOptions={{canvasActions:{
                loadScene:false,
                saveToActiveFile:false,
                export:false,
                toggleTheme:false
            }, tools:{image:true,
                embeddable:false,
                hand:false,
                laserPointer:false,
                text:false,
            }}
        }>
            <MainMenu>
                        <MainMenu.DefaultItems.SaveAsImage />
                        {!viewOnly && <MainMenu.DefaultItems.ChangeCanvasBackground />}
                        {!viewOnly && <MainMenu.DefaultItems.ClearCanvas />}
                        <MainMenu.DefaultItems.Help />
                    </MainMenu>
            </Excalidraw>
        </div>
        </div>
    );
}  
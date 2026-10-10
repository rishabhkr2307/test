import {useParams} from 'react-router-dom'
import Canvas from './Canvas'
import { useEffect, useState } from 'react';

export default function Workspace(){
    const [status, setstatus]=useState('checking')
    const [pw,setpw]=useState('')
    const [err,seterr]=useState('')
    const {roomId}=useParams();

    useEffect(()=>{
        fetch(`/api/room-access/${roomId}`, {credntials: 'include'})
        .then((r)=>setstatus(r.ok? 'allowed':'denied'))
        .catch(()=>setstatus('denied'))
    },[roomId])

    const join=()=>{
        const r=fetch('/api/join-room',{
            method:'POST',
            credentials:'include',
            headers:{'type': 'app/json'},
            body: JSON.stringify({roomId, roomPass:pw})
        })
        if(r.ok) setstatus('allowed')
        else seterr((r.json().error || 'failed to join'));
    };

        if(status ==='checking'){
            return <p>checking</p>
        }
        else{
            return (
                <div>
                    <h3>Join room {roomId}</h3>
                    <input type="password" value={pw} onChange={(e)=>setpw(e.target.value)} />
                    <button onClick={join}>Join</button>
                    {err && <p style={{color:'red'}}>err</p>}
                </div>
            );
        }
    return(
        <>
        <h3 style ={{position: 'absolute', 
            top:'10px', 
            left:'10px', 
            color:'green',
            margin:0,
            pointerEvents:'none'}}>
                Room: {roomId || 'Local Test'}</h3>
        <Canvas roomId={roomId}/>
        </>
    );
}
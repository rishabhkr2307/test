import {useParams} from 'react-router-dom'
import Canvas from './Canvas'
import { useEffect, useState } from 'react';

export default function Workspace(){
    const [status, setstatus]=useState('checking');
    const [pw,setpw]=useState('');
    const [err,setErr]=useState('');
    const {roomId}=useParams();
    const searchparams=new URLSearchParams(window.location.search);
    const iToken=searchparams.get('invite');
    const [sLink, setSLink]= useState(null);

    useEffect(()=>{
        fetch(`/api/room-access/${roomId}`, {credentials: 'include'})
        .then(async (r)=>{
        if(r.ok){
            const data=await r.json();
            setstatus('allowed')

            if(data.role==='owner'){
                fetch(`/api/room-links/${roomId}`, {credentials: 'include'})
                .then(res=>res.json())
                .then(links=> setSLink(links))
            }
        }
        else if(iToken){
            fetch('/api/join-room',{
                method:'POST',
                credentials:'include',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({roomId, invite: iToken})
            })
            .then(joinRes=>{
                if(joinRes.ok) setstatus('allowed');
                else setstatus('denied')
            })
        }
        else setstatus('denied');
        })
        .catch(()=> setstatus('denied'));
    },[roomId, iToken])
const join=()=>{
    fetch('/api/join-room',{
        method:'POST',
        credentials: 'include',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({roomId, roomPass:pw})
    })
    .then(async (res)=>{
        if(res.ok){
            setstatus('allowed');
        }
        else{
            const data=await res.json();
            setErr(data.error || 'Failed to join');
        }
    });
}

        if(status ==='checking'){
            return <p>checking</p>

        }
        if(status==='denied'){
            return (
                <div>
                    <h3>Join room {roomId}</h3>
                    <input type="password" value={pw} onChange={(e)=>setpw(e.target.value)} />
                    <button onClick={join}>Join</button>
                    {err && <p style={{color:'red'}}> {err}</p>}
                </div>
            );
        }
    return(
        <>
        <div style={{position:'absolute', top:'10px', left:'10px', color:'white',
            backgroundColor:'black', padding:'10px', borderRadius:'10%', zIndex:100,
            display:'flex', gap:'15px', alignItems:'center'
        }}>
            <strong>ROOM: {roomId}</strong>
            {sLink &&(
                <button onClick={()=>{
                    const url=`${window.location.origin}/workspace/${roomId}?{sLink.invite_link}`
                    navigator.clipboard.writeText(url);
                    alert("Invire link copied to clipboard");
                }} style={{padding:'4px 10px', cursor:'pointer',
                    backgroundColor:'gray', color:'white', border:'none', borderRadius:'4px'
                }}>
                    Copy Invite Link
                </button>
            )}
        </div>
        <Canvas roomId={roomId}/>
            </>
    );
}
             
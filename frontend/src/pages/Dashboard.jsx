import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import{api} from './api'
import { useAuth } from './authcontext'

export default function Dashboard(){
    const {user,logout}=useAuth()
    const [rooms, setrooms]=useState(null)
    const [createErr, setCreateErr]=useState('')
    const [busy, setBusy]=useState(false)
    const [newpw, setnewpw]=useState('')
    const [joinpw, setjoinpw]=useState('')
    const [joinerr, setjoinerr]=useState('')
    const [code, setcode]=useState('')
    const nav=useNavigate()
    useEffect(()=>{
        api('/api/my-rooms').then((a)=>setrooms(a.rooms))
        .catch(()=> setrooms([]))
    })
    const create=async()=>{
        setCreateErr('')
        setBusy(true)
        try{
            const d=await api('/api/create-room', {method: 'POST', body:{roomPassword:newpw || undefined}})
            nav(`/workspace/${d.roomid}`)
        }
        catch(err){
            setCreateErr(err.message)
            setBusy(false)

        }
    }

    const join= async(e)=>{
        e.preventDefault()
        setjoinerr('')
        setBusy(true)
        const roomId=code.trim().toUpperCase();
        try{
            await api('/api/join-room'), {method:'POST', body:{roomId, roomPass:joinpw}}
            nav(`/worksapce/${roomId}`)
        }
        catch(e){
            setCreateErr(e.message)
            setBusy(false)
        }
    }
    return(
        <>
            <header>
                <span>THinking Canvas</span>
                <div>
                    <span>{user}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            </header>
            <main>
                <div>
                    <section>
                        <h2>New room</h2>
                        <p>Optional password for people who join by code</p>
                        <label htmlFor="np">Room Password</label>
                        <input type="passowrd" id='np' value={newpw} onChange={(e)=>setnewpw(e.target.value)}/>
                        {createErr && <p>{createErr}</p>}
                        <button onClick={create} disabled={busy}>Create room</button>
                    </section>
                    <form onSubmit={join}>
                        <h2>Join a room</h2>
                        <p>Enter a 6 digit code</p>
                        <label htmlFor="rc">Room Code</label>
                        <input id="rc" value={code} onChange={(e)=> setcod(e.target.value)}maxength={6} required/>
                        <label for="jp">Password if any</label>
                        <input id="jp" type="password" value={joinpw} onChange={(e)=> setjoinpw(e.target.value)}/>
                        {joinerr && <p>{joinerr}</p>}
                        <button>Join</button>
                    </form>
                </div>
                <h2>Your rooms</h2>
                {rooms===null && <p>loading....</p>}
                (rooms?.length===0 && 
                <p>You arent in any room yet. create or join with code</p>)
                <div>
      {         rooms?.map((r) => (
                    <div key={r.room_id}>
                    <code>{r.room_id}</code>
                    <span>{r.is_owner ? 'Owner' : 'Member'}</span>
                    <Link to={`/workspace/${r.room_id}`}>Open</Link>
                </div>
              ))}
                </div>
            </main>
        </>
    )
}
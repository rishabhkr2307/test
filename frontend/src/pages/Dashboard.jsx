import {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import{api} from './api'
import { useAuth } from './authcontext'

export default function Dashboard(){
    const [rooms, setrooms]=useState(null)
    const [createErr, setCreateErr]=useState('')
    const [busy, setBusy]=useState(false)
    const [newpw, setnewpw]=useState('')
    const [joinpw, setjoinpw]=useState('')
    const [joinerr, setjoinerr]=useState('')
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
                    <span>USername</span>
                    <button>Logout</button>
                </div>
            </header>
            <main>
                <div>
                    <section>
                        <h2>New room</h2>
                        <p>Optional password for people who join by code</p>
                        <label for="np">Room Password</label>
                        <input type="passowrd" id='np'/>
                        <button>Create room</button>
                    </section>
                    <form>
                        <h2>Join a room</h2>
                        <p>Enter a 6 digit code</p>
                        <label for="rc">Room Code</label>
                        <input id="rc" maxength="6" required/>
                        <label for="jp">Password if any</label>
                        <input id="jp" type="password"/>
                        <button>Join</button>
                    </form>
                </div>
                <h2>Your rooms</h2>
                <p>You arent in any room yet. create or join with code</p>
                <div>
                    <code>ROOM CODE</code>
                    <span>Owner</span>
                    <a href="/workshop/ROOM_CODE">OPEN</a>
                </div>
            </main>
        </>
    )
}
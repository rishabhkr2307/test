import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from './api'
import { useAuth } from './authcontext'

export default function Dashboard() {
    const { user, logout } = useAuth()
    const nav = useNavigate()
    const [rooms, setRooms] = useState(null)
    const [newPw, setNewPw] = useState('')
    const [code, setCode] = useState('')
    const [joinPw, setJoinPw] = useState('')
    const [createErr, setCreateErr] = useState('')
    const [joinErr, setJoinErr] = useState('')
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        api('/api/my-rooms').then((d) => setRooms(d.rooms)).catch(() => setRooms([]))
    }, [])        

    const create = async () => {
        setCreateErr('')
        setBusy(true)
        try {
            const d = await api('/api/create-room', { method: 'POST', body: { roomPassword: newPw || undefined } })
            nav(`/workspace/${d.roomid}`)
        } catch (e) {
            setCreateErr(e.message)
            setBusy(false)
        }
    }

    const join = async (e) => {
        e.preventDefault()
        setJoinErr('')
        setBusy(true)
        const roomId = code.trim().toUpperCase()
        try {
            
            await api('/api/join-room', { method: 'POST', body: { roomId, roomPass: joinPw } })
            nav(`/workspace/${roomId}`)                    
        } catch (e2) {
            setJoinErr(e2.message)                         
            setBusy(false)
        }
    }

    return (
        <>
            <header className="topbar">
                <span className="brand">Thinking Canvas</span>
                <div className="right">
                    <span className="muted">{user}</span>
                    <button className="btn ghost" onClick={logout}>Log out</button>
                </div>
            </header>

            <main className="dash">
                <div className="grid2">
                    <section className="card">
                        <h2>New room</h2>
                        <p className="muted">Optional password for people who join by code.</p>
                        <label htmlFor="np">Room password</label>
                        <input id="np" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Leave empty for none" />   
                        {createErr && <p className="error">{createErr}</p>}
                        <button className="btn" onClick={create} disabled={busy}>Create room</button>
                    </section>

                    <form className="card" onSubmit={join}>
                        <h2>Join a room</h2>
                        <p className="muted">Enter the 6-character code you were given.</p>
                        <label htmlFor="rc">Room code</label>
                        <input id="rc" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} required />   
                        <label htmlFor="jp">Password (if any)</label>
                        <input id="jp" type="password" value={joinPw} onChange={(e) => setJoinPw(e.target.value)} />
                        {joinErr && <p className="error">{joinErr}</p>}
                        <button className="btn" disabled={busy}>Join</button>
                    </form>
                </div>

                <h2 style={{ marginTop: 36 }}>Your rooms</h2>
                {rooms === null && <p className="muted">Loading...</p>}
                {rooms?.length === 0 && <p className="muted">You aren't in any rooms yet. Create one or join with a code.</p>}  
                <div className="room-list">
                    {rooms?.map((r) => (
                        <div className="room-item" key={r.room_id}>
                            <code>{r.room_id}</code>
                            <span className={`badge ${r.is_owner ? 'owner' : ''}`}>{r.is_owner ? 'Owner' : 'Member'}</span>
                            <Link className="btn ghost" style={{ textAlign: 'center' }} to={`/workspace/${r.room_id}`}>Open</Link>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
}
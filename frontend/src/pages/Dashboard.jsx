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
    <div style={{ minHeight: '100vh', background: '#191919', color: '#e3e3e3', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header className="topbar" style={{ background: '#222222', borderBottom: '1px solid #333333', padding: '15px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="brand" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f5' }}>Thinking Canvas</span>
            <div className="right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="muted" style={{ color: '#888888', fontSize: '0.9rem' }}>{user}</span>
                <button className="btn ghost" onClick={logout} style={{ background: 'transparent', color: '#e3e3e3', border: '1px solid #444444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Log out</button>
            </div>
        </header>

        <main className="dash" style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto' }}>
            <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <section className="card" style={{ background: '#222222', border: '1px solid #333333', padding: '24px', borderRadius: '8px' }}>
                    <h2 style={{ color: '#f5f5f5', fontSize: '1.1rem', fontWeight: 600, marginTop: 0, marginBottom: '8px' }}>New room</h2>
                    <p className="muted" style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '16px' }}>Optional password for people who join by code.</p>
                    <label htmlFor="np" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cccccc' }}>Room password</label>
                    <input id="np" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Leave empty for none" style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '4px', border: '1px solid #444444', background: '#191919', color: '#e3e3e3', fontSize: '0.9rem', outline: 'none' }} />   
                    {createErr && <p className="error" style={{ color: '#e06c75', fontSize: '0.85rem', marginTop: '8px' }}>{createErr}</p>}
                    <button className="btn" onClick={create} disabled={busy} style={{ background: '#d97706', color: '#ffffff', border: 'none', padding: '10px', width: '100%', borderRadius: '4px', marginTop: '20px', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem' }}>Create room</button>
                </section>

                <form className="card" onSubmit={join} style={{ background: '#222222', border: '1px solid #333333', padding: '24px', borderRadius: '8px' }}>
                    <h2 style={{ color: '#f5f5f5', fontSize: '1.1rem', fontWeight: 600, marginTop: 0, marginBottom: '8px' }}>Join a room</h2>
                    <p className="muted" style={{ color: '#888888', fontSize: '0.85rem', marginBottom: '16px' }}>Enter the 6-character code you were given.</p>
                    <label htmlFor="rc" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cccccc' }}>Room code</label>
                    <input id="rc" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} required style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '4px', border: '1px solid #444444', background: '#191919', color: '#e3e3e3', fontSize: '0.9rem', outline: 'none', marginBottom: '12px' }} />   
                    <label htmlFor="jp" style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#cccccc' }}>Password (if any)</label>
                    <input id="jp" type="password" value={joinPw} onChange={(e) => setJoinPw(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '4px', border: '1px solid #444444', background: '#191919', color: '#e3e3e3', fontSize: '0.9rem', outline: 'none' }} />
                    {joinErr && <p className="error" style={{ color: '#e06c75', fontSize: '0.85rem', marginTop: '8px' }}>{joinErr}</p>}
                    <button className="btn" disabled={busy} style={{ background: '#d97706', color: '#ffffff', border: 'none', padding: '10px', width: '100%', borderRadius: '4px', marginTop: '20px', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem' }}>Join</button>
                </form>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', marginBottom: '16px' }}>
                <h2 style={{ color: '#f5f5f5', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Your rooms</h2>
                <span style={{ background: '#2a2a2a', border: '1px solid #333333', color: '#cccccc', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>
                    Created by you: <strong>{createdCount}</strong>
                </span>
            </div>

            {rooms === null && <p className="muted" style={{ color: '#888888', fontSize: '0.9rem' }}>Loading...</p>}
            {rooms?.length === 0 && <p className="muted" style={{ color: '#888888', fontSize: '0.9rem' }}>You aren't in any rooms yet. Create one or join with a code.</p>}  
            
            <div className="room-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                {rooms?.map((r) => (
                    <div className="room-item" key={r.room_id} style={{ background: '#222222', border: '1px solid #333333', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <code style={{ fontSize: '1.1rem', color: '#d97706', fontWeight: 600, fontFamily: 'monospace' }}>{r.room_id}</code>
                            <span className={`badge`} style={{ background: r.is_owner ? '#2d3748' : '#2b3137', color: r.is_owner ? '#68d391' : '#63b3ed', border: '1px solid #444444', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 500 }}>{r.is_owner ? 'Owner' : 'Member'}</span>
                        </div>
                        <Link className="btn ghost" style={{ textAlign: 'center', background: 'transparent', color: '#e3e3e3', border: '1px solid #444444', padding: '8px', borderRadius: '4px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }} to={`/workspace/${r.room_id}`}>Open</Link>
                    </div>
                ))}
            </div>
        </main>
    </div>
);
}
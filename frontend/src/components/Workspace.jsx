import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Canvas from './Canvas'
import { api } from '../pages/api'

export default function Workspace() {
    const { roomId } = useParams()
    const [params] = useSearchParams()
    const inviteToken = params.get('invite')
    const navigate = useNavigate()

    const [status, setStatus] = useState('checking')
    const [links, setLinks] = useState(null)
    const [pw, setPw] = useState('')
    const [err, setErr] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        let cancelled = false;                             
        (async () => {
            try {
                let access
                try {
                    access = await api(`/api/room-access/${roomId}`)
                } catch (e) {
                    if (e.status !== 403 || !inviteToken) throw e
                    await api('/api/join-room', { method: 'POST', body: { roomId, invite: inviteToken } })  
                    access = await api(`/api/room-access/${roomId}`)
                    navigate(`/workspace/${roomId}`, { replace: true })  
                }
                if (cancelled) return
                setStatus('allowed')
                if (access.role === 'owner') setLinks(await api(`/api/room-links/${roomId}`))
            } catch {
                if (!cancelled) setStatus('denied')
            }
        })()                                               
        return () => { cancelled = true }
    }, [roomId, inviteToken])

    const join = async (e) => {
        e.preventDefault()
        setErr('')                                          
        try {
            await api('/api/join-room', { method: 'POST', body: { roomId, roomPass: pw } })
            setStatus('allowed')
        } catch (e2) {
            setErr(e2.message)
        }
    }

    const copyInvite = async () => {
        await navigator.clipboard.writeText(`${window.location.origin}/workspace/${roomId}?invite=${links.invite_link}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    if (status === 'checking') return <div className="center muted">Checking access...</div>

    if (status === 'denied') {
        return (
            <div className="center">
                <form className="card auth-card" onSubmit={join}>   
                    <h1>Join room {roomId}</h1>
                    <p className="muted">This room needs a password, or you don't have access.</p>
                    <label htmlFor="rp">Room password</label>
                    <input id="rp" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
                    {err && <p className="error">{err}</p>}
                    <button className="btn">Join</button>
                    <p style={{ textAlign: 'center', marginTop: 18 }}><Link to="/dashboard">Back to dashboard</Link></p>
                </form>
            </div>
        )
    }

    return (
        <>
            <div className="room-bar">
                <Link to="/dashboard">&larr; Dashboard</Link>
                <strong>Room {roomId}</strong>
                {links && <button className="btn ghost" onClick={copyInvite}>{copied ? 'Copied!' : 'Copy invite link'}</button>}   
            </div>
            <Canvas roomId={roomId} />
        </>
    )
}
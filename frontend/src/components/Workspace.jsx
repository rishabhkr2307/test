import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Canvas from './Canvas'
import Toggle from '../pages/ThemeToggle'
import { api } from '../pages/api'

export default function Workspace() {
    const { roomId } = useParams()
    const [params] = useSearchParams()
    const inviteToken = params.get('invite')
    const navigate = useNavigate()

    const [status, setStatus] = useState('checking') // checking | allowed | denied
    const [links, setLinks] = useState(null)
    const [pw, setPw] = useState('')
    const [err, setErr] = useState('')
    const [copied, setCopied] = useState('')

    useEffect(() => {
        let cancelled = false; // keep this semicolon, the next line starts with (
        (async () => {
            try {
                let access
                try {
                    access = await api(`/api/room-access/${roomId}`)
                } catch (e) {
                    if (e.status !== 403 || !inviteToken) throw e
                    await api('/api/join-room', { method: 'POST', body: { roomId, invite: inviteToken } })
                    access = await api(`/api/room-access/${roomId}`)
                    navigate(`/workspace/${roomId}`, { replace: true }) // strip the token from the address bar
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

    const copy = async (text, which) => {
        await navigator.clipboard.writeText(text)
        setCopied(which)
        setTimeout(() => setCopied(''), 1500)
    }

    if (status === 'checking') return <div className="center muted">Checking access...</div>

    if (status === 'denied') {
        return (
            <div className="center">
                <div className="theme-corner"><Toggle /></div>
                <form className="card auth-card" onSubmit={join}>
                    <h1>Join room {roomId}</h1>
                    <p className="muted">This room needs a password, or you don't have access.</p>
                    <label htmlFor="rp">Room password</label>
                    <input id="rp" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
                    {err && <p className="error">{err}</p>}
                    <button className="btn">Join</button>
                    <p className="center-text"><Link to="/dashboard">Back to dashboard</Link></p>
                </form>
            </div>
        )
    }

    return (
        <div className="room-layout">
            <div className="room-bar">
                <Link to="/dashboard">&larr; Dashboard</Link>
                <strong>Room {roomId}</strong>
                <div className="room-bar-actions">
                    {links && (
                        <>
                            <button
                                className="btn ghost" id='invite-link'
                                onClick={() => copy(`${window.location.origin}/workspace/${roomId}?invite=${links.invite_link}`, 'invite')}
                            >
                                {copied === 'invite' ? 'Copied!' : 'Copy invite link'}
                            </button>
                            <button
                                className="btn ghost" id='read-only'
                                onClick={() => copy(`${window.location.origin}/view/${roomId}?t=${links.read_link}`, 'view')}
                            >
                                {copied === 'view' ? 'Copied!' : 'Copy view-only link'}
                            </button>
                        </>
                    )}
                    <Toggle />
                </div>
            </div>
            <Canvas roomId={roomId} />
        </div>
    )
}
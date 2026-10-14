import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'   // Navigate was missing
import { useAuth } from './authcontext'

export default function AuthPage({ mode }) {
    const isLogin = mode === 'login'
    const { user, login, register } = useAuth()
    const nav = useNavigate()
    const [params] = useSearchParams()
    const [username, setUsername] = useState('')          // was [username,, setUsername]
    const [passwd, setPasswd] = useState('')
    const [err, setErr] = useState('')
    const [busy, setBusy] = useState(false)

    const next = params.get('next')
    const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'

    if (user) return <Navigate to={dest} replace />

    const submit = async (e) => {
        e.preventDefault()
        setErr('')
        setBusy(true)
        try {
            await (isLogin ? login : register)(username.trim(), passwd)
            nav(dest, { replace: true })
        } catch (e2) {
            setErr(e2.message)
        } finally {
            setBusy(false)
        }
    }

    const other = `${isLogin ? '/register' : '/login'}${next ? `?next=${encodeURIComponent(next)}` : ''}`

    return (
        <div className="center">
            <form className="card auth-card" onSubmit={submit}>          {/* class is auth-card, not authCard */}
                <h1>{isLogin ? 'Welcome back' : 'Create account'}</h1>
                <p className="muted">{isLogin ? 'Log in to your canvases.' : 'Start drawing together.'}</p>

                <label htmlFor="u">Username</label>
                <input id="u" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />

                <label htmlFor="p">Password</label>
                <input id="p" type="password" value={passwd} onChange={(e) => setPasswd(e.target.value)} required />   {/* type was missing */}

                {err && <p className="error">{err}</p>}
                <button className="btn" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Log in' : 'Sign up'}</button>

                <p className="muted" style={{ textAlign: 'center', marginTop: 18 }}>
                    {isLogin ? 'No account? ' : 'Already registered? '}
                    <Link to={other}>{isLogin ? 'Sign up' : 'Log in'}</Link>
                </p>
            </form>
        </div>
    )
}
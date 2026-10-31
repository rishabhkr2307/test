import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from './authcontext'
import Toggle from './ThemeToggle'

export default function AuthPage({ mode }) {
    const isLogin = mode === 'login'
    const { user, login, register } = useAuth()
    const nav = useNavigate()
    const [params] = useSearchParams()
    const [username, setUsername] = useState('')
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
            <div className="theme-corner anim-top speed-fast"><Toggle/></div>
            <form className="card auth-card anim-scale speed-normal delay-1 " onSubmit={submit}>
                <h1>{isLogin ? 'Welcome back' : 'Create account'}</h1>
                <p className="muted">{isLogin ? 'Log in to your canvases.' : 'Start drawing together.'}</p>
                <div className='anim-left speed-slow delay-1'>
                <label htmlFor="u">Username</label>
                <input id="u" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required />
                </div>
                <div className='anim-left speed-slow delay-2'>
                <label htmlFor="p">Password</label>
                <input id="p" type="password" value={passwd} onChange={(e) => setPasswd(e.target.value)} required />
                </div>
                {err && <p className="error anim-scale speed-slow">{err}</p>}
                <button className="btn anim-scale speed-normal delay-3" disabled={busy}>{busy ? 'Please wait...' : isLogin ? 'Log in' : 'Sign up'}</button>

                <p className="muted center-text">
                    {isLogin ? 'No account? ' : 'Already registered? '}
                    <Link to={other}>{isLogin ? 'Sign up' : 'Log in'}</Link>
                </p>
            </form>
        </div>
    )
}
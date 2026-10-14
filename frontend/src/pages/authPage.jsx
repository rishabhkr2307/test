import {useEffect, useState} from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import {api} from './api'
import {useAuth} from './authcontext'


export default function AuthPage({mode}){
    const isLogin= mode==='login'
    const {user, login, register}=useAuth()
    const nav = useNavigate()
    const [params]=useSearchParams()
    const [username,, setUsername]=useState('')
    const[busy, setBusy]= useState(false)
    const [passwd, setpasswd]=useState('')
    const [err, setErr]=useState('')

    const next = params.get('next')
    const dest=next && next.startsWith('/') && !next.startsWith('//')?next:'/dashboard'

    if(user) return <Navigate to={dest} replace/>

    const submit = async(e)=>{
        e.preventDefault()
        setErr('')
        setBusy(true)
        try{
            await(isLogin?login: register)(username.trim(), passwd)
            nav(dest,{replace:true})
        }
        catch(e2){
            setErr(e2.message)
        }
        finally{
            setBusy(false)
        }
    }

    return(
        <div className='center'>
            <form className='card authCard' onSubmit={submit}>
                <h1>{isLogin ? 'Welcome Back':'Create Account'}</h1>
                <p className='muted'>{isLogin?"Log in to your canvas":"Start Working Together"}</p>
                <label htmlFor="u">USername</label>
                <input id='u' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <label htmlFor="p">Password</label>
                <input id='p' value={passwd} onChange={(e)=>setpasswd(e.target.value)}/>
                {err && <p className='error'>{err}</p>}
                <button className='btn' disabled={busy}>{busy?'please wait':isLogin?'Login':'SignUp'}</button>

                <p className='muted' style={{textAlign:'center', marginTop:15}}>
                    {isLogin?"no account?":"Already REgistered?"}
                    <Link to={isLogin ? `/register${next ? `?next=${encodeURIComponent(next)}` : ''}` : `/login${next ? `?next=${encodeURIComponent(next)}` : ''}`}>
                        {isLogin? 'sign up': 'Login'}
                    </Link>
                </p>
            </form>
        </div>
    )
}
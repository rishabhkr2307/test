import {Navigate, useLocation} from 'react-router-dom'
import { useAuth } from './authcontext'

export default function protectedRoute({children}){
    const {user, loading}=useAuth()
    const loc = useLocation()
    if(loading)  return <div className='center muted'>Loading</div>
    if(!user) return <Navigate to={`/login?next=${encodedURIComponent(loc.pathname+loc.search)}`} replace/>
        return children
}
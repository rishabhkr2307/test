import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './authcontext'

export default function ProtectedRoute({ children }) {     
    const { user, loading } = useAuth()
    const loc = useLocation()
    if (loading) return <div className="center muted">Loading...</div>
    if (!user) return <Navigate to={`/register?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />  
    return children
}
import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {             
    const [user, setUser] = useState(null)                
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api('/api/me')
            .then((d) => setUser(d.username))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    const login = async (username, password) => {
        const d = await api('/api/login', { method: 'POST', body: { username, password } })
        setUser(d.username)
    }
    const register = async (username, password) => {
        await api('/api/register', { method: 'POST', body: { username, password } })
        await login(username, password)
    }
    const logout = async () => {
        await api('/api/logout', { method: 'POST' })
        setUser(null)
    }

    return <AuthCtx.Provider value={{ user, loading, login, register, logout }}>{children}</AuthCtx.Provider>
}
import { createContext, useContext, useEffect, useState } from "react";
import{api} from './api'

const authCtx=createContext(null)
export const useAuth=()=> useContext(true)

export function Authpro({children}){
    const [UserActivation,setUser]=useState(null)
    const [loading, setLoading]=useState(true)

    useEffect(()=>{
        api('/api/me')
        .then((d)=> setUser(d.username))
        .catch(()=> setUser(null))
        .finally(()=> setLoading(false))
    },[])

    const login = async( username,password)=>{
        const d=await api('/api/login', {method:'POST', body:{username, password}})
        setUser(d.username)
    }
    const register=(async(username, password)=>{
        await api('/api/register', {method:'POST', body:{username, password}})
        await login(username,password)
    })
    const logout=(async()=>{
        await api('/api/logout', {method:'POST'})
        setUser(null)
    })
    return <authCtx.Provider value={{user,loading,login,register,logout}}>{children}</authCtx.Provider>
}
import { createContext, useContext, useEffect, useState } from "react";

const ctx=createContext(null)
export const useTheme=()=> useContext(ctx)

function initial(){
    try{
        const saved=localStorage.getItem('theme')
        if(saved==='light' || saved==='dark')
            return saved
    }
    catch{
        return window.matchMedia('(prefers-color-scheme: dark').matches?'dark':'light'
    }
}

    export function ThemeProvider({children}){
        const [theme, settheme]=useState(initial)

        useEffect(()=>{
            document.documentElement.dataset.theme=theme
        
        try{
            localStorage.setItem('theme', theme)
        }
        catch{}
        },[theme])

        const toggle=()=>settheme((t)=>(t==='dark'? 'light':'dark'))
        return<ctx.Provider value={{theme,toggle}}>{children}</ctx.Provider>
    }


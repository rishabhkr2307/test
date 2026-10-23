import { useTheme } from "./ThemeContext";

export default function Toggle(){
    const {theme, toggle}=useTheme()
    return(
        <button className="btn ghost" onClick={toggle}>
            {theme==='dark'?'light mode':'dark mode'}
        </button>
    )
}
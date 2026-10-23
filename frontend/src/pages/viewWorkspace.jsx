import { Link, useParams, useSearchParams } from "react-router-dom";
import Canvas from "../components/Canvas";
import { useAuth } from "./authcontext";
import Toggle from './ThemeToggle'

export default function ViewWorkspace(){
    const {roomId}=useParams()
    const [params]=useSearchParams()
    const token=params.get('t')
    const {user}=useAuth()

    if(!token){
        return(
            <div className="center">
                <div className="theme-corner"><Toggle/></div>
                <div className="card auth-card">
                    <h1>Link is Incomplete</h1>
                    <p className="muted">Ask owner to send it again. Read Only is missing</p>
                </div>
            </div>
        )
    }
    return(
        <div className="room-layout">
            <div className="room-bar">
                <Link to={user? "/dashboard":"/login"}>&larr;{user?"Dashboard":"Login"}</Link>
                <strong>Room {roomId}</strong>
                <span className="badge member">View Only</span>
                <div className="room-bar-actions">
                    <Toggle/>
                </div>
            </div>
            <Canvas roomId={roomId} viewToken={token}/>
        </div>
    )
}
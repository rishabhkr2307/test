import {useParams} from 'react-router-dom'
import Canvas from './Canvas'

export default function Workspace(){
    const {roomId}=useParams();
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYyIsImlhdCI6MTc5MTQ5NDkwMCwiZXhwIjoxNzkxNTgxMzAwfQ.0N0b08Shvk9zHNaeSS3xNO32mNkfehaI6I64tObXR_Y";

    return(
        <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', top: 10, left:10, color:'black'}}></div>
        <h3>Room: {roomId} || 'Local Test'</h3>
        <Canvas roomId={roomId} token={token}/>
        </div>

    )
}
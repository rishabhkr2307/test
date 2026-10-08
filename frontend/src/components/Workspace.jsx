import {useParams} from 'react-router-dom'
import Canvas from './Canvas'
import { CanvasSocket} from './CanvasSocket';

export default function Workspace(){
    const {roomId}=useParams();
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYyIsImlhdCI6MTc5MTQ4NjU5OCwiZXhwIjoxNzkxNTcyOTk4fQ.1ieru-37vZPNCgIOt0Q6n8bKwi-XZMLUvJwr3_sRdKg";
    console.log("token: ",token)
    console.log('roomId: ',roomId)

    const {sendMsg}=CanvasSocket(roomId,token)
    return(
        <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', top: 10, left:10, color:'black'}}></div>
        <h3>Room: {roomId} || 'Local Test'</h3>
        <Canvas/>
        </div>

    )
}
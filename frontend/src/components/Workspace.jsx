import {useParams} from 'react-router-dom'
import Canvas from './Canvas'
import { CanvasSocket} from './CanvasSocket';

export default function Workspace(){
    const {roomId}=useParams();
    const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYyIsImlhdCI6MTc5MTQ4MzQ0NiwiZXhwIjoxNzkxNTY5ODQ2fQ.a1i0egoEXwNf_4tRXv2rlj0vQbDEX-UsIKnsI913ipg";
    return(
        <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', top: 10, left:10, color:'black'}}></div>
        <h3>Room: {roomId} || 'Local Test'</h3>

        <Canvas/>
        </div>

    )
}
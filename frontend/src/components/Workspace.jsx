import {useParams} from 'react-router-dom'
import Canvas from './Canvas'

export default function Workspace(){
    const {roomId}=useParams();
    return(
        <>
        <h3 style ={{position: 'absolute', 
            top:'10px', 
            left:'10px', 
            color:'green',
            margin:0,
            pointerEvents:'none'}}>
                Room: {roomId || 'Local Test'}</h3>
        <Canvas roomId={roomId}/>
        </>
    )
}
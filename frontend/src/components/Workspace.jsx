import React from 'react'
import {useParams} from 'react-router-dom'
import Canvas from './Canvas'

export default function Workspace(){
    const {roomId}=useParams();
    return(
        <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', top: 10, left:10, color:'black'}}></div>
        <h3>Room: {roomId} || 'Local Test'</h3>

        <canvas/>
        </div>

    )
}
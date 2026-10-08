import React, { useRef, useEffect } from 'react';
import { CanvasSocket } from './CanvasSocket';

export default function Canvas({roomId, token}) {
    const cref = useRef(null);
    const isdraw = useRef(false);

    const handle=(data)=>{
        if(data.type !=='element') return;

        const ctx=cref.current.getContext('2d');
        if(data.action ==='start'){
            ctx.beginPath();
            ctx.moveTo(data.x, data.y)
        }
        else if(data.action === 'draw'){
            ctx.lineTo(data.x, data.y);
            ctx.stroke();
        }
    }
    const {sendMsg} = CanvasSocket(roomId, token, handle)
    useEffect(() => {
        const canvas = cref.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.lineCap = 'round';
    }, []);

    const startDraw = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = cref.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        isdraw.current = true;

        if(sendMsg){
            sendMsg({type: 'element', acion: 'start', x:offsetX, y:offsetY})
        }
    };

    const draw = (e) => {
        if (!isdraw.current) return;
        const { offsetX, offsetY } = e.nativeEvent;
        const ctx = cref.current.getContext('2d'); 

        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();

        if(sendMsg){
            sendMsg({type: 'element', acion: 'start', x:offsetX, y:offsetY})
        }
    };

    const stopDraw = () => {
        if (!isdraw.current) return;
        const ctx = cref.current.getContext('2d');
        ctx.closePath();
        isdraw.current = false;
    };

    return (
        <div style={{ backgroundColor: '#1e1e1e', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <canvas
                ref={cref}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseOut={stopDraw}
                style={{ cursor: 'crosshair' }}
            />
        </div>
    );
}
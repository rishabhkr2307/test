import React, {useRef, useEffect} from 'react'

export default function Canvas(){
    const cref= useRef(null)
    const isdraw=useRef(false)

    useEffect(()=>{
        const canvas=cref.current;
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        const ctx=canvas.getContext('2d');
        ctx.lineWidth=3;
        ctx.strokeStyle='#ffffff'
    }, []);

    const startDraw=(e)=>{
        const {offsetX,offsetY}=e.nativeEvent;
        const ctx=cref.current.getContext('2d')
        ctx.beginPath();
        ctx.moveTo(offsetX,offsetY);
        isdraw.current=true;
    }

    const draw=(e)=>{
        if(!isdraw.current) return;
        const {offsetX,offsetY}=e.nativeEvent;
        const ctx=cref.current.getContext('2d') 

        ctx.lineTo(offsetX,offsetY)
        ctx.stroke();
    };
    const stopDraw=(e)=>{
        if(!isdraw.current) return ;
        const ctx=cref.current.getContext('2d')
        ctx.closePath();
        isdraw.current=false;
    };

    return(
        <div style={{backgroundColor: '#111111', width: '100vw', height: '100vw'}}>
        <canvas
        ref={cref}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseOut={stopDraw}
        style={{cursor: 'crosshair'}}
        />
        </div>
    );
}
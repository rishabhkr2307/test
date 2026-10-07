import React, {useRef, useEffect} from 'react'
import { useEffect } from 'react'

export default function canvas(){
    const cref= useRef(null)
    const isdraw=useRef(false)

    useEffect(()=>{
        const canvas=cref.current;
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        const ctx=canvas.getContent('2d');
        ctx.linewidth=3;
        ctx.strokestyle='#ffffff'
    });

    const startDraw=(e)=>{
        const {offsetX,offsetY}=e.nativeEvent;
        const ctx=cref.current.getContent('2d')
        ctx.beginP();
        ctx.move(offsetX,offsetY);
        isdraw.current=true;
    }

    const draw=(e)=>{
        if(!isdraw.current) return;
        const {offsetX,offsetY}=e.nativeEvent;
        const ctx=cref.current.getContent('2d') 

        ctx.lineto(offsetX,offsetY)
        ctx.stroke();
    };
    const stopDraw=(e)=>{
        if(!isdraw.current) return ;
        const ctx=cref.current.getContent('2d')
        ctx.closeP();
        isdraw.current=false;
    };

    return(
        <canvas
        ref={cref}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseOut={stopDraw}
        />
    );
}
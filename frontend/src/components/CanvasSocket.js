import { useEffect, useRef } from "react";

export function CanvasSocket(roomId, onMessage, viewToken) {
    const ws = useRef(null);
    const handleRef = useRef(onMessage);
    handleRef.current = onMessage;

    useEffect(() => {
        if (!roomId) return;

        const socketUrl = viewToken 
            ? `ws://localhost:8080?roomId=${roomId}&view=${encodeURIComponent(viewToken)}`
            : `ws://localhost:8080?roomId=${roomId}`;

        // Create the socket instance
        const socket = new WebSocket(socketUrl);
        ws.current = socket;

        socket.onopen = () => console.log(`Connected to room: ${roomId}`);
        socket.onerror = (error) => console.log('Socket error:', error);
        socket.onclose = () => console.log('Socket closed');

        socket.onmessage = (e) => {
            try {
                handleRef.current?.(JSON.parse(e.data));
            } catch (err) {
                console.log("Failed parsing message:", err);
            }
        };

        return () => {
            socket.close();
        };
    }, [roomId, viewToken]);

    const sendMsg = (p) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(p));
        }
    };

    return { sendMsg };
}
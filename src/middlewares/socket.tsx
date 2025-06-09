'use client'
import {useEffect, useState, ReactNode} from 'react';
import {io} from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
    reconnectionDelayMax: 10000,
    auth: {
        token: process.env.NEXT_PUBLIC_TOKEN
    },
});


export default function Socket({children}: { children: ReactNode }) {

    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    useEffect(() => {
        function handleConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);
            console.log("Connected:", socket.id);

            // Join the room
            socket.emit("join-room", "room1");
        }

        function handleDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
            console.log("Disconnected from socket");
        }

        function handleRoomMessage(data: unknown) {
            console.log("Received message from room:", data);
        }

        function handleTransportUpgrade(transport: { name: string }) {
            setTransport(transport.name);
        }

        // Register events
        socket.on("connect", handleConnect);
        socket.on("room-message", handleRoomMessage);
        socket.on("disconnect", handleDisconnect);
        socket.io.engine.on("upgrade", handleTransportUpgrade);

        // Cleanup
        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("room-message", handleRoomMessage);
            socket.io.engine.off("upgrade", handleTransportUpgrade);
        };
    });


    return {children}
}
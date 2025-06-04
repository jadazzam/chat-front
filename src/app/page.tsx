"use client"
import dotenv from 'dotenv';
dotenv.config();
import React, {useEffect, useState} from 'react';
import { socket } from "./socket";
import Chat from './chat'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function Home() {

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

        function handleRoomMessage(data) {
            console.log("Received message from room:", data);
        }

        function handleTransportUpgrade(transport) {
            setTransport(transport.name);
        }

        // Register events
        socket.on("connect", handleConnect);
        socket.on("room-message", handleRoomMessage);
        socket.on("disconnect", handleDisconnect);
        socket.io.engine.on("upgrade", handleTransportUpgrade);

        // Cleanup
        return () => {
            // socket.off("connect", handleConnect);
            // socket.off("disconnect", handleDisconnect);
            // socket.off("room-message", handleRoomMessage);
            // socket.io.engine.off("upgrade", handleTransportUpgrade);
        };
    });



    return (
      <div>
          <div>
              <p>Status: { isConnected ? "connected" : "disconnected" }</p>
              <p>Transport: { transport }</p>
          </div>
        <Chat/>
      </div>
  );
}
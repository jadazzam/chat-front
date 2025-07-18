'use client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { createSocket } from '@/middlewares/socket';
import { Socket } from 'socket.io-client';
import { useAuth } from '@/providers/auth';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  transport: string;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  transport: 'N/A',
});

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState('N/A');
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = useAuth()?.token;

  useEffect(() => {
    if (!token) {
      console.log('Socket token required');
      return;
    }
    const socket = createSocket(token);
    if (!socket.connected) {
      socket.connect();
    }
    setSocket(socket);

    function handleConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      console.log('Connected to socket id:', socket.id);
    }

    function handleDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
      console.log('Disconnected from socket');
    }

    function handleTransportUpgrade(transport: { name: string }) {
      setTransport(transport.name);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.io.engine.on('upgrade', handleTransportUpgrade);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.io.engine.off('upgrade', handleTransportUpgrade);

      if (socket.connected) {
        socket.disconnect();
        console.log('Socket disconnected manually');
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, transport }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
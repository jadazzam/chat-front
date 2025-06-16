'use client';
import { io, Socket } from 'socket.io-client';

export function createSocket(token: string): Socket {
  return io(process.env.NEXT_PUBLIC_API_URL, {
    reconnectionDelayMax: 10000,
    auth: {
      token: token,
    },
  });
}
'use client';
import React, { FormEvent, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import { useSocket } from '@/providers/socket';
import { Button, TextField } from '@mui/material';
import { createHeaders } from '@/services/headers';
import { AuthContextType } from '@/types/auth';

const Room = () => {
  const auth: AuthContextType | null = useAuth();
  const socket = useSocket().socket;
  const searchParams = useParams<{ id: string }>();
  const roomId = searchParams.id;
  const userId = auth?.user?.id;

  useEffect(() => {
    if (socket && roomId) {
      // socket.on('connection', socket => {
      socket.emit('join room', roomId);
      // });
      socket.on('joined room', joinedRoomId => {
        console.log(`✅ Successfully joined room ${joinedRoomId}`);
      });
    }
    const handleBeforeUnload = () => {
      // Notify server that user is leaving
      // debugger;
      // navigator.sendBeacon('/api/leave-room', JSON.stringify({ roomId, userId }));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // navigator.sendBeacon('/api/leave-room', JSON.stringify({ roomId, userId }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [roomId, userId, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: { content: string; senderId?: string }) => {
      console.log('📩 Received a message in room:', data.content);
    };

    socket.on('receive message', handleMessage);

    return () => {
      socket.off('receive message', handleMessage);
    };
  }, [socket]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content');
    const token = auth?.token ?? '';
    const message = await fetch(process.env.NEXT_PUBLIC_API_URL + '/messages/', {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify({ content, room_id: roomId }),
    });
    if (message.ok && socket?.connected) {
      socket.emit('send message', { roomId, content });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <TextField name="content" id="content" label="Type your message" variant="standard" />
      <Button type="submit">Submit here</Button>
    </form>
  );
};

export default Room;
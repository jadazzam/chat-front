'use client';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import { useSocket } from '@/providers/socket';
import { AuthContextType } from '@/types/auth';
import { SocketResponseProps } from '@/types/socket';
import { MessageType } from '@/types/messages';
import { getRoom } from '@/services/rooms';
import { postRoomMember } from '@/services/roomsMembers';
import { postMessage } from '@/services/messages';
import { CircularProgress } from '@mui/material';
import { RoomLayout } from '@/components/layouts/rooms/id';

const Room = () => {
  const auth: AuthContextType | null = useAuth();
  const socket = useSocket().socket;
  const searchParams = useParams<{ id: string }>();
  const roomId = searchParams.id;
  const userId = auth?.user?.id;
  const hasEnteredRef = useRef(false);
  const [roomName, setRoomName] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  async function enterRoom({ roomId, userId }: { roomId: string; userId: string }) {
    try {
      return await postRoomMember({ roomId, userId });
    } catch (e) {
      console.error('Error entering room POST', e);
      throw e;
    }
  }

  useEffect(() => {
    const navEntry = window.performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    const isFirstEntry = navEntry.type === 'navigate' && !hasEnteredRef.current && userId && roomId;

    if (isFirstEntry) {
      hasEnteredRef.current = true;
      enterRoom({ roomId, userId });
    } else {
      console.log(
        "User landed via 'back_forward' | 'prerender' | 'reload' — no need to enter room"
      );
    }
  }, [userId, roomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getRoom({ roomId, complete: true });
        if (res?.data[0]?.name) {
          setRoomName(res.data[0].name);
        }
        if (res?.messages?.length) {
          const messages = res.messages.map(msg => ({
            key: `${msg.content}-${Math.random()}`,
            content: msg.content,
            userId: msg.user_id,
            user: msg.user,
          }));
          setMessages(prev => [...prev, ...messages]);
        }
      } catch (e) {
        console.error('❌ Failed to fetch messages:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId, userId]);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('join room', roomId);

    const handleJoined = (joinedRoomId: string) => {
      console.log(`✅ Successfully joined room ${joinedRoomId}`);
    };

    const handleMessage = (data: { content: string; userId: string }) => {
      console.log('📩 Received message:', data.content, 'from:', data);
      if (data.userId !== userId) {
        setMessages(prev => [
          ...prev,
          {
            key: `${data.content}-${Math.random()}`,
            content: data.content,
            userId: data.userId,
          },
        ]);
      }
    };

    socket.on('joined room', handleJoined);
    socket.on('receive message', handleMessage);

    return () => {
      socket.off('joined room', handleJoined);
      socket.off('receive message', handleMessage);
    };
  }, [socket, roomId, userId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const content = inputRef.current?.value.trim();
      if (!content) return;
      const message = await postMessage({ roomId, content });
      if (message?.id && socket?.connected) {
        socket.emit('send message', { roomId, content }, (response: SocketResponseProps) => {
          console.log('socket emit message response', response);
        });
        const key = `${content}-${Math.random()}`;
        setMessages(prevState => [
          ...prevState,
          { key, content, userId, user: auth?.user ?? undefined },
        ]);
        if (inputRef.current) inputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error handleSubmit room send message', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress size="3rem" />;
      </div>
    );
  }

  return (
    <RoomLayout
      title={roomName}
      messages={messages}
      userId={userId}
      handleSubmit={handleSubmit}
      inputRef={inputRef}
    />
  );
};

export default Room;

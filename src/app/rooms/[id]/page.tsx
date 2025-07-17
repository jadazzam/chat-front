'use client';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import { useSocket } from '@/providers/socket';
import { Button, TextField, Typography } from '@mui/material';
import { createHeaders } from '@/services/headers';
import { AuthContextType } from '@/types/auth';
import { SocketResponseProps } from '@/types/socket';
import { MessageApiType, MessageType } from '@/types/messages';
import { getRoom } from '@/services/rooms';
import { RoomsType } from '@/types/rooms';
import { postRoomMember } from '@/services/roomsMembers';

const Room = () => {
  const auth: AuthContextType | null = useAuth();
  const token = auth?.token;
  const socket = useSocket().socket;
  const searchParams = useParams<{ id: string }>();
  const roomId = searchParams.id;
  const userId = auth?.user?.id;
  const hasEnteredRef = useRef(false);
  const [messages, setMessages] = useState<MessageType[]>([]);

  async function enterRoom({ roomId, userId }: { roomId: string; userId: string }) {
    debugger;
    try {
      return await postRoomMember({ roomId, userId, token: token || '' });
    } catch (e) {
      console.error('Error entering room POST', e);
      throw e;
    }
  }

  useEffect(() => {
    const navType = window.performance.getEntriesByType('navigation')[0];
    const shouldEnter =
      (navType as PerformanceNavigationTiming).type === 'navigate' &&
      !hasEnteredRef.current &&
      userId &&
      roomId;
    if (shouldEnter) {
      hasEnteredRef.current = true;
      enterRoom({ roomId, userId });
    } else {
      console.log("User landed by back_forward' | 'prerender' | 'reload, no need to enter room");
    }
  }, [userId, roomId, token]);

  useEffect(() => {
    if (token) {
      const fetchMessages = async () => {
        const res: { data: RoomsType[]; messages: MessageApiType[] } = await getRoom({
          token,
          roomId,
          complete: true,
        });
        if (res) {
          const messages = res.messages.map((_res: MessageApiType) => {
            return {
              key: `${_res.content}-${Math.random()}`,
              content: _res.content,
              userId: _res.user_id,
            };
          });
          setMessages(prevState => [...prevState, ...messages]);
        }
      };
      fetchMessages();
    }
  }, [roomId, userId, token]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('join room', roomId);
      socket.on('joined room', joinedRoomId => {
        console.log(`✅ Successfully joined room ${joinedRoomId}`);
      });
    }
    // debugger;
    // const handleBeforeUnload = async () => {
    //   hasEnteredRef.current = false;
    //   const data = JSON.stringify({ roomId, userId, active: false, token });
    //   const blob = new Blob([data], { type: 'application/json' });
    //   navigator.sendBeacon('/api/rooms-members', blob);
    // };
    // window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [roomId, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: { content: string; userId: string }) => {
      console.log('📩 Received a message in room:', data.content, 'from :', data);
      if (data.userId !== userId) {
        const content = data.content;
        const key = `${content}-${Math.random()}`;
        setMessages(prevState => [...prevState, { key, content, userId: data.userId }]);
      }
    };

    socket.on('receive message', handleMessage);

    return () => {
      socket.off('receive message', handleMessage);
    };
  }, [socket, userId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const content = formData.get('content') as string;
      const message = await fetch(process.env.NEXT_PUBLIC_API_URL + '/messages/', {
        method: 'POST',
        headers: createHeaders(token || ''),
        body: JSON.stringify({ content, room_id: roomId }),
      });
      if (message.ok && socket?.connected) {
        socket.emit('send message', { roomId, content }, (response: SocketResponseProps) => {
          console.log('socket emit message response', response);
        });
        const key = `${content}-${Math.random()}`;
        setMessages(prevState => [...prevState, { key, content, userId }]);
      }
    } catch (error) {
      console.error('Error handleSubmit room send message', error);
      throw error;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        {messages.map((message: MessageType) => {
          const userIsSender = message.userId === userId;
          return (
            <div className="mx-auto w-1/2" key={message.key}>
              <span className={`${userIsSender ? 'float-right' : 'float-left'} `}>
                <Typography variant="body2" gutterBottom>
                  {message.content}
                </Typography>
              </span>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <TextField
          name="content"
          id="content"
          label="Type your message"
          variant="standard"
          required
        />
        <Button type="submit">Submit here</Button>
      </form>
    </>
  );
};

export default Room;
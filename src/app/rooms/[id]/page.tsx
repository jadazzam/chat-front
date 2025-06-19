'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import { useSocket } from '@/providers/socket';
import { Button, TextField, Typography } from '@mui/material';
import { createHeaders } from '@/services/headers';
import { AuthContextType } from '@/types/auth';
import { SocketResponseProps } from '@/types/socket';
import { MessageApiType, MessageType } from '@/types/messages';
import { RoomsType } from '@/types/rooms';

const Room = () => {
  const auth: AuthContextType | null = useAuth();
  const socket = useSocket().socket;
  const searchParams = useParams<{ id: string }>();
  const roomId = searchParams.id;
  const userId = auth?.user?.id;
  const [messages, setMessages] = useState<MessageType[]>([]);

  const getRoomMessages = async ({
    token,
    roomId,
  }: {
    token: string;
    roomId: string;
  }): Promise<MessageApiType[]> => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/rooms/${roomId}?complete=true`, {
        method: 'GET',
        headers: createHeaders(token),
      });
      if (!res.ok) {
        new Error(`Error getRoomMessages status: ${res.status}`);
      }
      const response: { data: RoomsType[]; messages: MessageApiType[] } = await res.json();
      return response.messages;
    } catch (e) {
      console.error('Error GET room messages by roomId', e);
      throw e;
    }
  };

  useEffect(() => {
    const token = auth?.token;
    if (token) {
      const fetchMessages = async () => {
        const res: MessageApiType[] = await getRoomMessages({ token, roomId });
        if (res && res.length) {
          const messages = res.map((_res: MessageApiType) => {
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
  }, [roomId, userId, auth]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('join room', roomId);
      socket.on('joined room', joinedRoomId => {
        console.log(`✅ Successfully joined room ${joinedRoomId}`);
      });
    }
    // const handleBeforeUnload = () => {
    //   // Notify server that user is leaving
    //   // debugger;
    //   // navigator.sendBeacon('/api/leave-room', JSON.stringify({ roomId, userId }));
    // };

    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === 'hidden') {
    //     // navigator.sendBeacon('/api/leave-room', JSON.stringify({ roomId, userId }));
    //   }
    // };

    // window.addEventListener('beforeunload', handleBeforeUnload);
    // document.addEventListener('visibilitychange', handleVisibilityChange);
    //
    // return () => {
    //   window.removeEventListener('beforeunload', handleBeforeUnload);
    //   document.removeEventListener('visibilitychange', handleVisibilityChange);
    // };
  }, [roomId, userId, socket]);

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
      const token = auth?.token ?? '';
      const message = await fetch(process.env.NEXT_PUBLIC_API_URL + '/messages/', {
        method: 'POST',
        headers: createHeaders(token),
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
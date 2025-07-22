'use client';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import { useSocket } from '@/providers/socket';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import { createHeaders } from '@/services/headers';
import { AuthContextType } from '@/types/auth';
import { SocketResponseProps } from '@/types/socket';
import { MessageApiType, MessageType } from '@/types/messages';
import { getRoom } from '@/services/rooms';
import { RoomsType } from '@/types/rooms';
import { postRoomMember } from '@/services/roomsMembers';
import { Box } from '@mui/system';
import { getInitiales, stringAvatar } from '@/middlewares/helpers';

const Room = () => {
  const auth: AuthContextType | null = useAuth();
  const socket = useSocket().socket;
  const searchParams = useParams<{ id: string }>();
  const roomId = searchParams.id;
  const userId = auth?.user?.id;
  const hasEnteredRef = useRef(false);
  const [messages, setMessages] = useState<MessageType[]>([]);

  async function enterRoom({ roomId, userId }: { roomId: string; userId: string }) {
    try {
      return await postRoomMember({ roomId, userId });
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
  }, [userId, roomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res: { data: RoomsType[]; messages: MessageApiType[] } = await getRoom({
        roomId,
        complete: true,
      });
      if (res) {
        const messages = res.messages.map((_res: MessageApiType) => {
          return {
            key: `${_res.content}-${Math.random()}`,
            content: _res.content,
            userId: _res.user_id,
            user: _res.user,
          };
        });
        setMessages(prevState => [...prevState, ...messages]);
      }
    };
    fetchMessages();
  }, [roomId, userId]);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('join room', roomId);
      socket.on('joined room', joinedRoomId => {
        console.log(`✅ Successfully joined room ${joinedRoomId}`);
      });
    }
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
        headers: createHeaders(),
        body: JSON.stringify({ content, room_id: roomId }),
        credentials: 'include',
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
      <Box
        component="section"
        sx={{
          p: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {messages.map((message: MessageType) => {
          const userIsSender = message.userId === userId;
          return (
            <Box
              sx={{
                boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                display: 'flex',
                marginX: 'auto',
                marginY: 1,
                width: '50%',
                padding: 2,
              }}
              key={message.key}
            >
              <Box sx={{ marginLeft: `${userIsSender ? 'auto' : 'left'}`, display: 'flex' }}>
                {!userIsSender && (
                  <Avatar {...stringAvatar(getInitiales(message?.user?.name ?? 'N A'))} />
                )}
                <Box sx={{ marginLeft: 1, display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Typography variant="body2" gutterBottom></Typography>
                  <Typography variant="body2" gutterBottom>
                    {message.content}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
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

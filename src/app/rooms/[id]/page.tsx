'use client';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/providers/auth';
import { useSocket } from '@/providers/socket';
import { Avatar, Button, TextField, Typography } from '@mui/material';
import { AuthContextType } from '@/types/auth';
import { SocketResponseProps } from '@/types/socket';
import { MessageType } from '@/types/messages';
import { getRoom } from '@/services/rooms';
import { postRoomMember } from '@/services/roomsMembers';
import { postMessage } from '@/services/messages';
import { Box } from '@mui/system';
import { getInitiales, stringAvatar } from '@/middlewares/helpers';
import SendIcon from '@mui/icons-material/Send';

const Room = () => {
  const auth: AuthContextType | null = useAuth();
  const socket = useSocket().socket;
  const searchParams = useParams<{ id: string }>();
  const roomId = searchParams.id;
  const userId = auth?.user?.id;
  const hasEnteredRef = useRef(false);
  const [roomName, setRoomName] = useState<string>('');
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
      const formData = new FormData(e.currentTarget);
      const content = formData.get('content') as string;
      const message = await postMessage({ roomId, content });
      if (message?.id && socket?.connected) {
        socket.emit('send message', { roomId, content }, (response: SocketResponseProps) => {
          console.log('socket emit message response', response);
        });
        const key = `${content}-${Math.random()}`;
        setMessages(prevState => [...prevState, { key, content, userId, user: auth?.user }]);
      }
    } catch (error) {
      console.error('Error handleSubmit room send message', error);
      throw error;
    }
  };

  return (
    <>
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Welcome to {roomName}</h2>
      <Box
        component="section"
        sx={{
          p: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginX: '20%',
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
                marginY: 1,
                padding: 2,
                width: '100%',
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            width: '100%',
            marginTop: 5,
            alignItems: 'center',
          }}
        >
          <form
            style={{
              display: 'flex',
              alignItems: 'center', // Vertically center
              gap: '8px', // Optional spacing between elements
            }}
            onSubmit={handleSubmit}
          >
            <TextField
              sx={{ padding: '8px 0', width: '25rem' }}
              name="content"
              id="content"
              label="Type your message here ..."
              variant="standard"
              required
            />
            <Button type="submit" endIcon={<SendIcon />}></Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Room;

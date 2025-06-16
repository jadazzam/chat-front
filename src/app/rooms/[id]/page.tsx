'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/providers/auth';

const Room = () => {
  const auth = useAuth();
  const searchParams = useParams<{ id: string }>();
  const roomId = searchParams.id;
  const userId = auth?.user?.id;
  console.log('searchParams', searchParams);

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Notify server that user is leaving
      debugger;
      navigator.sendBeacon('/api/leave-room', JSON.stringify({ roomId, userId }));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        navigator.sendBeacon('/api/leave-room', JSON.stringify({ roomId, userId }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [roomId, userId]);

  return <h1>hello world</h1>;
};

export default Room;
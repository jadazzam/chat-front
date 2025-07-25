'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth';
import { RoomsType } from '@/types/rooms';
import { getRooms } from '@/services/rooms';
import { AuthContextType } from '@/types/auth';
import { RoomCardTemplate } from '@/components/ui/rooms/Card';
import { RoomsTitle } from '@/components/ui/rooms/Title';
import { INVALID_TOKEN } from '@/middlewares/errors';
import { redirect } from 'next/navigation';
import { Typography } from '@mui/material';

export default function RoomsList() {
  const [rooms, setRooms] = useState<RoomsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const auth: AuthContextType | null = useAuth();

  useEffect(() => {
    function fetchRooms() {
      if (auth?.user) {
        getRooms()
          .then((res: RoomsType[]) => {
            if (res) setRooms(res);
          })
          .catch(e => {
            if (e.message === INVALID_TOKEN) {
              auth?.unSetAuth();
              redirect('/ ');
            }
            console.error('Error /rooms getRooms', e);
          })
          .finally(() => setLoading(false));
      } else setLoading(false);
    }

    fetchRooms();
  }, [auth]);

  if (loading) {
    return (
      <Typography variant="h3" component="h3" sx={{ textAlign: 'center', mt: 4 }}>
        Loading rooms ...
      </Typography>
    );
  }

  if (!auth || !auth?.user) {
    return (
      <Typography variant="h3" component="h3" sx={{ textAlign: 'center', mt: 4 }}>
        Please login to access rooms ...
      </Typography>
    );
  }

  return (
    <>
      <RoomsTitle title={rooms?.length ? 'Rooms you can join' : 'No available rooms ...'} />
      {rooms.map((room: RoomsType) => {
        return (
          <RoomCardTemplate
            key={room.id}
            room={room}
            user={auth.user}
            description={
              <>
                {'Feel free to join chat &'}
                <br />
                {'start sending messages to other members'}
              </>
            }
            buttonText="Enter room"
          />
        );
      })}
    </>
  );
}
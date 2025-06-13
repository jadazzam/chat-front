'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth';
import { RoomsType } from '@/types/rooms';
import { getRooms } from '@/services/rooms';
import { AuthContextType } from '@/types/auth';
import { RoomCardTemplate } from '@/components/ui/rooms/Card';
import { RoomsTitle } from '@/components/ui/rooms/Title';
import Typography from '@mui/material/Typography';

export default function RoomsList() {
  const [rooms, setRooms] = useState<RoomsType[]>([]);
  const auth: AuthContextType | null = useAuth();

  useEffect(() => {
    if (auth?.token) {
      getRooms(auth?.token)
        .then((res: RoomsType[]) => {
          if (res) setRooms(res);
        })
        .catch(e => console.error('Error /rooms getRooms', e));
    }
  }, [auth?.token]);

  if (!auth || !auth.user || (auth?.token && rooms.length === 0)) {
    return (
      <Typography variant="h3" component="h3" sx={{ textAlign: 'center', mt: 4 }}>
        Loading rooms ...
      </Typography>
    );
  }
  const authUser = auth.user;
  return (
    <>
      <RoomsTitle title={rooms?.length ? 'Rooms you can join' : 'Loading rooms ....'} />
      {rooms.map((room: RoomsType) => {
        return (
          <RoomCardTemplate
            key={room.id}
            room={room}
            user={authUser}
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
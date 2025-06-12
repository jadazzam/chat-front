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

  if (!auth?.token || !rooms) {
    return (
      <Typography variant="h3" component="h3" sx={{ textAlign: 'center', mt: 4 }}>
        Loading...
      </Typography>
    );
  }
  return (
    <>
      <RoomsTitle title={rooms?.length ? 'Rooms you can join' : 'Loading rooms ....'} />
      {rooms.map((_room: RoomsType, i: number) => {
        return (
          <RoomCardTemplate
            key={i.toString()}
            room={_room}
            user={auth?.user || null}
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
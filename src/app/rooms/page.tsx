'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth';
import { RoomsType } from '@/types/rooms';
import { getRooms } from '@/services/rooms';
import { AuthContextType } from '@/types/auth';
import { RoomCardTemplate } from '@/components/ui/rooms/Card';
import { RoomsTitle } from '@/components/ui/rooms/Title';

export default function Page() {
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

  return (
    <>
      <RoomsTitle title={'Rooms you can join'} />
      {rooms.map((_room: RoomsType) => {
        return (
          <RoomCardTemplate
            key={_room.id}
            room={_room}
            user={auth?.user || null}
            description={
              <>
                {' '}
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
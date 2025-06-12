import { RoomsType } from '@/types/rooms';

export const getRooms = async (token: string): Promise<RoomsType[]> => {
  try {
    const response = await fetch('http://localhost:8080/rooms', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error getRooms', error);
    return [];
  }
};
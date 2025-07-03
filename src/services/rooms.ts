import { RoomsType } from '@/types/rooms';
import { MessageApiType } from '@/types/messages';
import { createHeaders } from '@/services/headers';

export const getRooms = async (token: string): Promise<RoomsType[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
      method: 'GET',
      headers: createHeaders(token),
    });
    const res = await response.json();
    if (!response.ok) throw new Error(res.message || 'Failed to GET rooms');
    return res;
  } catch (e) {
    console.error('Error GET getRooms', e);
    throw e;
  }
};

export const getRoom = async ({
  token,
  roomId,
  complete = false,
}: {
  token: string | null;
  roomId: string;
  complete: boolean;
}): Promise<{ data: RoomsType[]; messages: MessageApiType[] }> => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/rooms/${roomId}?complete=${complete}`,
      {
        method: 'GET',
        headers: createHeaders(token || undefined),
      }
    );
    if (!res.ok) {
      new Error(`Error getRoomMessages status: ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    console.error('Error GET getRoomMessages by roomId', e);
    throw e;
  }
};
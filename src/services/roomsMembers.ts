import { postRoomsMembersType } from '@/types/roomsMembers';
import { createHeaders } from '@/services/headers';

export const postRoomMember = async ({ roomId, userId, token }: postRoomsMembersType) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/rooms-members', {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify({ roomId, userId }),
    });
    if (!response.ok) {
      new Error(response.statusText);
    }
    return response.json();
  } catch (e) {
    console.log('Error POST ', e);
    throw e;
  }
};

export const putRoomMember = async ({ roomId, userId, token }: postRoomsMembersType) => {
  try {
    const url = '/rooms-members/:roomId/:userId';
    if (!roomId || !userId) new Error('roomId & userId must be provided');
    if (roomId) url.replace(':roomId', roomId);
    if (userId) url.replace(':userId', userId);
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify({ active: false }),
    });
    console.log('RESPONSE PUT =>', response);
    if (!response.ok) {
      new Error(response.statusText);
    }
    return response.json();
  } catch (e) {
    console.log('Error POST ', e);
    throw e;
  }
};
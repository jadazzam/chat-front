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
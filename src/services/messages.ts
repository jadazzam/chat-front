import { MessageApiType } from '@/types/messages';
import { createHeaders } from './headers';

export const postMessage = async ({
  roomId,
  content,
}: {
  roomId: string;
  content: string;
}): Promise<MessageApiType> => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/messages/', {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ content, room_id: roomId }),
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`Error postMessage status: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('Error postMessage', e);
    throw e;
  }
};

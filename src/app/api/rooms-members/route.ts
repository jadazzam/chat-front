import type { NextRequest } from 'next/server';
import { createHeaders } from '@/services/headers';

export const dynamic = 'force-static';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roomId, userId, active, token } = body;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/rooms-members/${roomId}/${userId}`,
      {
        method: 'PUT',
        headers: createHeaders(token ?? ''),
        body: JSON.stringify({ roomId, userId, active }),
      }
    );
    const data = await res.json();
    return Response.json({ data }, { status: 200, statusText: 'OK' });
  } catch (e) {
    console.error('Error POST rooms members by roomId & userId', e);
    return Response.json({ error: e }, { status: 400, statusText: 'Bad request' });
  }
}
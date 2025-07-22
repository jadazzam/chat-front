import { UsersType } from '@/types/users';

export type MessageType = {
  key: string;
  content: string;
  userId: string | undefined;
  user?: UsersType;
};

export type MessageApiType = {
  id: string;
  content: string;
  created_at: Date;
  user_id: string;
  room_id: string;
  user?: UsersType;
};

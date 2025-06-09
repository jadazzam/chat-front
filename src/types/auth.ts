import { UsersType } from '@/types/users';

export interface AuthType {
  user: UsersType | null;
  token: string | null;
}
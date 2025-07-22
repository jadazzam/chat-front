import { UsersType } from '@/types/users';

export interface AuthType {
  user: UsersType | null;
}

export interface AuthContextType extends AuthType {
  setAuth: (credentials: AuthType) => void;
  unSetAuth: () => void;
}
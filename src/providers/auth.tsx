'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { UsersType } from '@/types/users';
import { AuthContextType, AuthType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UsersType | null>(null);

  // Load from localStorage on first render
  useEffect(() => {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        setUser(JSON.parse(user));
      }
    } catch (e) {
      throw e;
    }
  }, []);

  const setAuth = (credentials: AuthType): void => {
    const { user } = credentials;
    if (user) {
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const unSetAuth = (): void => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, unSetAuth }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
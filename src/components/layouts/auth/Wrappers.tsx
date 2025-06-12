'use client';
import { AuthForm } from '@/components/ui/auth/Forms';
import { signIn, signUp } from '@/services/auth';
import React, { useState } from 'react';
import { Alert } from '@mui/material';

export const SignInFormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<boolean>(false);
  return (
    <>
      {error && <Alert severity="error">Error signing in ... please try again.</Alert>}
      <AuthForm.Wrapper setError={() => setError(prevState => !prevState)} authHandler={signIn}>
        {children}
      </AuthForm.Wrapper>
    </>
  );
};

export const SignUpFormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<boolean>(false);
  return (
    <>
      {error && <Alert severity="error">Error signing up ... please try again.</Alert>}
      <AuthForm.Wrapper setError={() => setError(prevState => !prevState)} authHandler={signUp}>
        {children}
      </AuthForm.Wrapper>
    </>
  );
};
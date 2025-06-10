'use client';
import { AuthForm } from '@/components/ui/auth/Forms';
import { signIn, signUp } from '@/app/actions/auth';
import React from 'react';

export const SignInFormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthForm.Wrapper authHandler={signIn}>{children}</AuthForm.Wrapper>;
};

export const SignUpFormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthForm.Wrapper authHandler={signUp}>{children}</AuthForm.Wrapper>;
};
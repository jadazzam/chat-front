'use client';
import { AuthForm } from '@/components/ui/auth/Form';
import { signIn, signUp } from '@/app/actions/auth';

export const SignInFormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthForm.Wrapper authHandler={signIn}>{children}</AuthForm.Wrapper>;
};

export const SignUpFormWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthForm.Wrapper authHandler={signUp}>{children}</AuthForm.Wrapper>;
};
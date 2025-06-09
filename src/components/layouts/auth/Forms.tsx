import React from 'react';
import { SignInFormWrapper, SignUpFormWrapper } from '@/components/layouts/auth/Wrappers';
import { AuthForm } from '@/components/ui/auth/Form';

export const SignInForm = () => {
  return (
    <SignInFormWrapper>
      <AuthForm.TextField id="email" label="Email" name="email" placeholder="john@example.com" />
      <AuthForm.TextField id="password" label="Password" name="password" placeholder="password" />
      <AuthForm.Button text={'Sign in'} />
    </SignInFormWrapper>
  );
};

export const SignUpForm = () => {
  return (
    <SignUpFormWrapper>
      <AuthForm.TextField id="name" label="Name" name="name" placeholder="John" />
      <AuthForm.TextField id="email" label="Email" name="email" placeholder="john@example.com" />
      <AuthForm.TextField id="password" label="Password" name="password" placeholder="password" />
      <AuthForm.Button text={'Sign up'} />
    </SignUpFormWrapper>
  );
};
'use client';
import React, { useEffect } from 'react';
import { AuthForm } from '@/components/ui/auth/Forms';
import { SignInForm, SignUpForm } from '@/components/layouts/auth/Forms';
import { useAuth } from '@/providers/auth';
import { redirect } from 'next/navigation';

export const AuthModule = () => {
  const [isNew, setIsNew] = React.useState(false);
  const auth = useAuth();

  useEffect(() => {
    if (auth?.user) redirect('/rooms');
  }, [auth?.user]);

  return (
    <div className="lg:w:2/5 mx-auto w-full md:w-3/5 xl:w-2/5 2xl:w-1/5">
      <AuthForm.Switch checked={isNew} setChecked={() => setIsNew(!isNew)} />
      <div>{isNew ? <SignUpForm /> : <SignInForm />}</div>
    </div>
  );
};
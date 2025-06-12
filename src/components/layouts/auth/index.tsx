import React from 'react';
import { AuthForm } from '@/components/ui/auth/Forms';
import { SignInForm, SignUpForm } from '@/components/layouts/auth/Forms';

export const AuthModule = () => {
  const [isNew, setIsNew] = React.useState(false);
  return (
    <div className="lg:w:2/5 mx-auto w-full md:w-3/5 xl:w-2/5 2xl:w-1/5">
      <AuthForm.Switch checked={isNew} setChecked={() => setIsNew(!isNew)} />
      <div>{isNew ? <SignUpForm /> : <SignInForm />}</div>
    </div>
  );
};
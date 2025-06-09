import React, { ReactNode } from 'react';
import { Button, TextField } from '@mui/material';
import Form from 'next/form';
import { useAuth } from '@/providers/auth';
import { redirect } from 'next/navigation';
import { AuthType } from '@/types/auth';

export const AuthForm = () => {
  return <></>;
};

AuthForm.Button = function AuthFormButton({ text }: { text: string }) {
  return (
    <Button type="submit" variant="contained">
      {text}
    </Button>
  );
};

AuthForm.TextField = function AuthTextField({
  id,
  label,
  name,
  placeholder,
}: {
  id: string;
  label: string;
  name: string;
  placeholder: string;
}) {
  return <TextField required id={id} label={label} name={name} placeholder={placeholder} />;
};

AuthForm.Wrapper = function LoginFormWrapper({
  children,
  authHandler,
}: {
  children: ReactNode;
  authHandler: (formData: FormData) => Promise<AuthType>;
}) {
  const setAuth = useAuth()?.setAuth;
  return (
    <div className="w-full">
      <Form
        className="mx-auto flex w-1/5 flex-col"
        action={async formData => {
          const auth = await authHandler(formData);
          if (setAuth && auth) {
            setAuth(auth);
            redirect('/rooms');
          }
        }}
      >
        {children}
      </Form>
    </div>
  );
};
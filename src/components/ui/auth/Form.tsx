import React, { ReactNode } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import Form from 'next/form';
import { useAuth } from '@/providers/auth';
import { redirect } from 'next/navigation';
import { AuthType } from '@/types/auth';
import { Box } from '@mui/system';

export const AuthForm = () => {
  return <></>;
};

AuthForm.Button = function AuthFormButton({ text }: { text: string }) {
  return (
    <Button
      sx={{
        marginY: '10px',
      }}
      type="submit"
      variant="contained"
    >
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
  return (
    <Box className="mb-5" display="flex" alignItems="center" gap={2}>
      <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', width: '40%' }}>
        {label} *
      </Typography>
      <TextField required id={id} name={name} placeholder={placeholder} fullWidth />
    </Box>
  );
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
        className="mx-auto flex flex-col justify-center md:w-4/5"
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
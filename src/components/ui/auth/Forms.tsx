import React, { ReactNode } from 'react';
import { Button, Switch, TextField, Typography } from '@mui/material';
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
      <Typography sx={{ fontWeight: '500', minWidth: '90px' }}>{label} *</Typography>
      <TextField required id={id} name={name} placeholder={placeholder} fullWidth />
    </Box>
  );
};

AuthForm.Wrapper = function LoginFormWrapper({
  children,
  authHandler,
  setError,
}: {
  children: ReactNode;
  authHandler: (formData: FormData) => Promise<AuthType>;
  setError: (bool: boolean) => void;
}) {
  const setAuth = useAuth()?.setAuth;
  return (
    <Form
      action={async formData => {
        const auth: AuthType = await authHandler(formData);
        if (setAuth && auth.user) {
          setAuth(auth);
          redirect('/rooms');
        } else setError(true);
      }}
    >
      {children}
    </Form>
  );
};

AuthForm.Switch = function AuthFormSwitch({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: () => void;
}) {
  return (
    <div className="w-full">
      <Box className="mb-5 w-full" display="flex" alignItems="center" gap={2}>
        <Typography sx={{ fontWeight: '500' }}>New user ? *</Typography>
        <Box display="flex" alignItems="center">
          <Switch checked={checked} onChange={setChecked} />
        </Box>
      </Box>
    </div>
  );
};
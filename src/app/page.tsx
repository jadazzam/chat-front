'use client';
import dotenv from 'dotenv';
import React, { useState } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { SignInForm, SignUpForm } from '@/components/layouts/auth/Forms';
import { FormControlLabel, Switch } from '@mui/material';

dotenv.config();

export default function Home() {
  const [isNew, setIsNew] = useState<boolean>(false);

  return (
    <div className="mx-auto w-9/10">
      <FormControlLabel
        required
        control={<Switch onChange={() => setIsNew(prevState => !prevState)} />}
        label="New user ?"
        labelPlacement="start"
      />

      {isNew ? <SignUpForm /> : <SignInForm />}
    </div>
  );
}
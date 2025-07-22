import dotenv from 'dotenv';
import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AuthModule } from '@/components/layouts/auth';

dotenv.config();

export default function Home() {
  return (
    <div className="mx-auto w-9/10">
      <AuthModule />
    </div>
  );
}
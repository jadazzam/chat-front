import Typography from '@mui/material/Typography';
import React from 'react';

export function RoomsTitle({ title }: { title: string }): React.ReactNode {
  return (
    <Typography sx={{ textAlign: 'center', mt: 4, fontWeight: 'semibold', fontSize: '3.75rem' }}>
      {title}
    </Typography>
  );
}
import Typography from '@mui/material/Typography';
import React from 'react';

export function RoomsTitle({ title }: { title: string }): React.ReactNode {
  return (
    <Typography variant="h3" component="h3" sx={{ textAlign: 'center', mt: 4 }}>
      {title}
    </Typography>
  );
}
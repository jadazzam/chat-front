import Typography from '@mui/material/Typography';
import React from 'react';

export function RoomsTitle({ title }: { title: string }): React.ReactNode {
  return (
    <Typography
      variant="h3"
      component="h3"
      sx={{
        textAlign: 'center',
        mt: 4,
        fontWeight: 600,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        color: '#222222', // soft black color
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      }}
    >
      {title}
    </Typography>
  );
}

import React from 'react';
import { Box, BoxProps } from '@mui/material';

export const PageContainer: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box
      sx={{
        p: 3,
        bgcolor: '#121212',
        minHeight: '100vh',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

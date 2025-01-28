import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: fullScreen ? '100vh' : '100%',
        width: '100%',
        bgcolor: fullScreen ? '#121212' : 'transparent'
      }}
    >
      <CircularProgress sx={{ color: '#1DB954' }} />
    </Box>
  );
};

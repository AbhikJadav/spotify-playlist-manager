import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  severity,
  onClose
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          bgcolor: severity === 'success' ? '#1DB954' : undefined,
          color: 'white'
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

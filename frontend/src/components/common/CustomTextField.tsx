import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

export const CustomTextField: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField
      {...props}
      sx={{
        '& .MuiInputLabel-root': { color: '#b3b3b3' },
        '& .MuiInputBase-input': { color: 'white' },
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#b3b3b3' },
          '&:hover fieldset': { borderColor: '#1DB954' },
          '&.Mui-focused fieldset': { borderColor: '#1DB954' }
        },
        ...props.sx
      }}
    />
  );
};

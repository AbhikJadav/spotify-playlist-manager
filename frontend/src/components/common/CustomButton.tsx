import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  ...props
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bgcolor: '#1DB954',
          color: 'white',
          '&:hover': {
            bgcolor: '#1ed760'
          }
        };
      case 'secondary':
        return {
          bgcolor: 'transparent',
          color: '#b3b3b3',
          border: '1px solid #b3b3b3',
          '&:hover': {
            border: '1px solid #1DB954',
            color: '#1DB954'
          }
        };
      case 'text':
        return {
          color: '#b3b3b3',
          '&:hover': {
            color: '#1DB954'
          }
        };
      default:
        return {};
    }
  };

  return (
    <Button
      {...props}
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        px: 3,
        py: 1,
        ...getStyles(),
        ...props.sx
      }}
    />
  );
};

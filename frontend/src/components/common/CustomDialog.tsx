import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogProps
} from '@mui/material';
import { CustomButton } from './CustomButton';

interface CustomDialogProps extends DialogProps {
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showActions?: boolean;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Save',
  cancelText = 'Cancel',
  showActions = true,
  ...props
}) => {
  return (
    <Dialog
      {...props}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: '#282828',
          color: 'white',
          minWidth: '300px'
        }
      }}
    >
      <DialogTitle sx={{ color: '#1DB954' }}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {showActions && (
        <DialogActions sx={{ p: 2 }}>
          <CustomButton variant="text" onClick={onClose}>
            {cancelText}
          </CustomButton>
          {onConfirm && (
            <CustomButton variant="primary" onClick={onConfirm}>
              {confirmText}
            </CustomButton>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

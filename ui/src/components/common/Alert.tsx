import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps } from '@mui/material';

interface AlertProps extends Omit<MuiAlertProps, 'severity'> {
  type?: 'info' | 'warning' | 'error' | 'success';
}

const Alert: React.FC<AlertProps> = ({ type = 'info', ...props }) => {
  const getSeverity = () => {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <MuiAlert
      severity={getSeverity()}
      {...props}
    />
  );
};

export default Alert; 
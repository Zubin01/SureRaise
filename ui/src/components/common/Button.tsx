import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text' | 'success' | 'warning' | 'danger';
  startIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  startIcon,
  ...props 
}) => {
  const getMuiVariant = (): 'contained' | 'outlined' | 'text' => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'contained';
      case 'outlined':
        return 'outlined';
      case 'text':
        return 'text';
      case 'success':
        return 'contained';
      case 'warning':
        return 'contained';
      case 'danger':
        return 'contained';
      default:
        return 'contained';
    }
  };

  const getColor = (): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <MuiButton
      variant={getMuiVariant()}
      color={getColor()}
      startIcon={startIcon}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 
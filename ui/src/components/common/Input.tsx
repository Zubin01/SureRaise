import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  helperText?: string;
  error?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  required,
  ...props
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      margin="normal"
      required={required}
      error={error}
      helperText={helperText}
      {...props}
    />
  );
};

export default Input; 
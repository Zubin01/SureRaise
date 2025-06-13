import React from 'react';
import { FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  className
}) => {
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          checked={checked}
          onChange={onChange}
          color="primary"
        />
      }
      label={label}
      className={className}
    />
  );
};

export default Checkbox; 
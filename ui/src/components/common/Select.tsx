import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText, SelectChangeEvent } from '@mui/material';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: Option[];
  required?: boolean;
  helperText?: string;
  error?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  required,
  helperText,
  error
}) => {
  return (
    <FormControl fullWidth margin="normal" error={error}>
      <InputLabel required={required}>{label}</InputLabel>
      <MuiSelect
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Select; 
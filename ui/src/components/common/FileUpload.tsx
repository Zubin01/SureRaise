import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadProps {
  label: string;
  value: File | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  value,
  onChange,
  accept,
  required
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </Typography>
      <Box
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
      >
        <input
          type="file"
          accept={accept}
          onChange={onChange}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button
            component="span"
            startIcon={<CloudUploadIcon />}
            variant="outlined"
          >
            Choose File
          </Button>
        </label>
        {value && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected file: {value.name}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FileUpload; 
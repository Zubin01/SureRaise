import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CardContent } from '@mui/material';
import { Button, Card, Input, Checkbox, Alert } from '../../components/common';
import { AdminIconComponent } from '../../components/icons/Icons';
import { validateEmail, validatePassword, validateConfirmPassword, validateAccessCode } from '../../utils/validation';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  accessCode?: string;
}

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    enable2FA: false,
    accessCode: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((fieldName: string, value: string) => {
    let validation: { isValid: boolean; message: string };
    switch (fieldName) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(formData.password, value);
        break;
      case 'accessCode':
        validation = validateAccessCode(value);
        break;
      default:
        validation = { isValid: true, message: '' };
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: validation.isValid ? undefined : validation.message
    }));

    return validation.isValid;
  }, [formData.password]);

  const handleChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData] as string);
  }, [formData, validateField]);

  // Compute form validity without calling validation functions that update state
  const isFormValid = useMemo(() => {
    const requiredFields = ['email', 'password', 'confirmPassword', 'accessCode'];
    return requiredFields.every(field => {
      const value = formData[field as keyof typeof formData] as string;
      return value.trim() !== '' && !errors[field as keyof FormErrors];
    });
  }, [formData, errors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ['email', 'password', 'confirmPassword', 'accessCode'];
    const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(newTouched);

    // Validate all fields
    const validations = allFields.map(field => 
      validateField(field, formData[field as keyof typeof formData] as string)
    );

    if (validations.every(v => v)) {
      console.log('Admin signup:', formData);
      // Handle successful submission here
    }
  }, [formData, validateField]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <AdminIconComponent />
            <Typography variant="h4" component="h2" mt={1} gutterBottom>
              Admin Access
            </Typography>
            <Typography color="text.secondary">
              High-security access for website management
            </Typography>
          </Box>

          <Alert type="warning" sx={{ mb: 3 }}>
            Admin accounts require special authorization. Contact system administrator for access code.
          </Alert>

          <Box component="form" onSubmit={handleSubmit}>
            <Input
              label="Access Code"
              value={formData.accessCode}
              onChange={handleChange('accessCode')}
              onBlur={handleBlur('accessCode')}
              error={!!errors.accessCode}
              helperText={errors.accessCode || "Special code required for admin registration"}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              error={!!errors.password}
              helperText={errors.password || "Use a strong password with at least 12 characters"}
              required
            />
            
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
            />

            <Box mt={2} mb={3}>
              <Checkbox
                label="Enable Two-Factor Authentication (Recommended)"
                checked={formData.enable2FA}
                onChange={(e) => setFormData(prev => ({ ...prev, enable2FA: e.target.checked }))}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="danger"
              disabled={!isFormValid}
              sx={{ mb: 3 }}
            >
              Create Admin Account
            </Button>

            <Box textAlign="center">
              <Button variant="text" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminSignup; 
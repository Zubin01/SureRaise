import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CardContent, Divider, ButtonGroup, SelectChangeEvent } from '@mui/material';
import { Button, Card, Input, Select } from '../components/common';
import { GoogleIconComponent, FacebookIconComponent, EmailIconComponent, PhoneIconComponent } from '../components/icons/Icons';
import { validateEmail, validatePassword, validateRequiredPhone } from '../utils/validation';

interface FormErrors {
  email?: string;
  phone?: string;
  password?: string;
}

const SignInPage = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    userType: 'donor'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((fieldName: string, value: string) => {
    let validation: { isValid: boolean; message: string };
    switch (fieldName) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'phone':
        validation = validateRequiredPhone(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      default:
        validation = { isValid: true, message: '' };
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: validation.isValid ? undefined : validation.message
    }));

    return validation.isValid;
  }, []);

  const handleChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched, validateField]);

  const handleSelectChange = useCallback((field: string) => (e: SelectChangeEvent<string>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleBlur = useCallback((field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData] as string);
  }, [formData, validateField]);

  // Compute form validity without calling validation functions that update state
  const isFormValid = useMemo(() => {
    if (loginMethod === 'email') {
      return formData.email.trim() !== '' && 
             formData.password.trim() !== '' && 
             !errors.email && 
             !errors.password;
    } else {
      return formData.phone.trim() !== '' && !errors.phone;
    }
  }, [loginMethod, formData, errors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark relevant fields as touched
    const fieldsToValidate = loginMethod === 'email' ? ['email', 'password'] : ['phone'];
    const newTouched = fieldsToValidate.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(prev => ({ ...prev, ...newTouched }));

    // Validate relevant fields
    const validations = fieldsToValidate.map(field => 
      validateField(field, formData[field as keyof typeof formData] as string)
    );

    if (validations.every(v => v)) {
      console.log('Sign in:', formData);
      // Handle successful submission here
    }
  }, [loginMethod, formData, validateField]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Sign In
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Welcome back! Please sign in to your account
          </Typography>

          <Select
            label="Account Type"
            value={formData.userType}
            onChange={handleSelectChange('userType')}
            options={[
              { value: 'donor', label: 'Individual Supporter' },
              { value: 'ngo', label: 'NGO Organization' },
              { value: 'campaigner', label: 'Individual Fundraiser' },
              { value: 'admin', label: 'Admin' }
            ]}
          />

          <Box sx={{ mb: 3 }}>
            <ButtonGroup fullWidth variant="outlined">
              <Button
                variant={loginMethod === 'email' ? 'primary' : 'outlined'}
                startIcon={<EmailIconComponent />}
                onClick={() => setLoginMethod('email')}
              >
                Email
              </Button>
              <Button
                variant={loginMethod === 'otp' ? 'primary' : 'outlined'}
                startIcon={<PhoneIconComponent />}
                onClick={() => setLoginMethod('otp')}
              >
                OTP
              </Button>
            </ButtonGroup>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {loginMethod === 'email' ? (
              <Box>
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
                  helperText={errors.password}
                  required
                />
              </Box>
            ) : (
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange('phone')}
                onBlur={handleBlur('phone')}
                error={!!errors.phone}
                helperText={errors.phone || "We'll send you an OTP to verify"}
                required
              />
            )}

            <Button
              type="submit"
              fullWidth
              disabled={!isFormValid}
              sx={{ mb: 3 }}
            >
              {loginMethod === 'email' ? 'Sign In' : 'Send OTP'}
            </Button>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">OR</Typography>
            </Divider>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIconComponent />}
              sx={{ mb: 2 }}
            >
              Continue with Google
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<FacebookIconComponent />}
              sx={{ mb: 3 }}
            >
              Continue with Facebook
            </Button>

            <Box textAlign="center">
              <Typography color="text.secondary" component="span">
                Don't have an account?{' '}
              </Typography>
              <Button variant="text" onClick={() => navigate('/')}>
                Sign Up
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SignInPage; 
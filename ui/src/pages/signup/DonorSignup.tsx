import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CardContent, Divider } from '@mui/material';
import { Button, Card, Input, Checkbox } from '../../components/common';
import { PersonIconComponent, GoogleIconComponent, FacebookIconComponent } from '../../components/icons/Icons';
import { validateEmail, validatePassword, validateConfirmPassword, validatePhone, validatePAN, validateName } from '../../utils/validation';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  panCard?: string;
}

const DonorSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    panCard: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((fieldName: string, value: string) => {
    let validation: { isValid: boolean; message: string };
    switch (fieldName) {
      case 'fullName':
        validation = validateName(value);
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'phone':
        validation = validatePhone(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(formData.password, value);
        break;
      case 'panCard':
        validation = validatePAN(value);
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
    const requiredFields = ['fullName', 'email', 'password', 'confirmPassword'];
    
    // Check if required fields have values and no errors
    const requiredFieldsValid = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData] as string;
      return value.trim() !== '' && !errors[field as keyof FormErrors];
    });
    
    // Check if optional fields (if filled) have no errors
    const optionalFieldsValid = (!formData.phone || !errors.phone) && 
                                (!formData.panCard || !errors.panCard);
    
    return requiredFieldsValid && optionalFieldsValid && formData.agreeTerms;
  }, [formData, errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ['fullName', 'email', 'phone', 'password', 'confirmPassword', 'panCard'];
    const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(newTouched);

    // Validate all fields
    const validations = allFields.map(field => 
      validateField(field, formData[field as keyof typeof formData] as string)
    );

    if (validations.every(v => v) && formData.agreeTerms) {
      try {
        const response = await fetch('http://localhost:4000/api/auth/signup/donor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone || undefined,
            password: formData.password,
            panCard: formData.panCard || undefined
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create account');
        }

        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard or home page
        navigate('/dashboard');
      } catch (error) {
        console.error('Signup error:', error);
        // You might want to show an error message to the user here
      }
    }
  }, [formData, validateField, navigate]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <PersonIconComponent />
            <Typography variant="h4" component="h2" mt={1} gutterBottom>
              Individual Supporter
            </Typography>
            <Typography color="text.secondary">
              Join to donate and track your contributions
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              onBlur={handleBlur('fullName')}
              error={!!errors.fullName}
              helperText={errors.fullName}
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
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange('phone')}
              onBlur={handleBlur('phone')}
              error={!!errors.phone}
              helperText={errors.phone || "Optional but useful for SMS alerts"}
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
            
            <Input
              label="PAN Card Number"
              value={formData.panCard}
              onChange={handleChange('panCard')}
              onBlur={handleBlur('panCard')}
              error={!!errors.panCard}
              helperText={errors.panCard || "Optional - For tax exemption benefits"}
            />

            <Box mt={2} mb={3}>
              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              disabled={!isFormValid}
              sx={{ mb: 3 }}
            >
              Create Donor Account
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

export default DonorSignup; 
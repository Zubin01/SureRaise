import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CardContent, Grid, SelectChangeEvent } from '@mui/material';
import { Button, Card, Input, Select, FileUpload, Checkbox, Alert } from '../../components/common';
import { CampaignIconComponent } from '../../components/icons/Icons';
import { validateEmail, validatePassword, validateConfirmPassword, validateRequiredPhone, validateRequiredPAN, validateName, validateRequired, validateFile } from '../../utils/validation';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  city?: string;
  state?: string;
  panNumber?: string;
  govtId?: string;
  idType?: string;
}

const CampaignerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    panNumber: '',
    govtId: null as File | null,
    idType: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((fieldName: string, value: string | File | null) => {
    let validation: { isValid: boolean; message: string };
    switch (fieldName) {
      case 'fullName':
        validation = validateName(value as string);
        break;
      case 'email':
        validation = validateEmail(value as string);
        break;
      case 'phone':
        validation = validateRequiredPhone(value as string);
        break;
      case 'password':
        validation = validatePassword(value as string);
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(formData.password, value as string);
        break;
      case 'city':
        validation = validateRequired(value as string, 'City');
        break;
      case 'state':
        validation = validateRequired(value as string, 'State');
        break;
      case 'panNumber':
        validation = validateRequiredPAN(value as string);
        break;
      case 'idType':
        validation = validateRequired(value as string, 'ID Type');
        break;
      case 'govtId':
        validation = validateFile(value as File, true);
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

  const handleSelectChange = useCallback((field: string) => (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: string) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    if (field === 'govtId') {
      validateField(field, value as File);
    } else {
      validateField(field, value as string);
    }
  }, [formData, validateField]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, govtId: file }));
    
    if (touched.govtId) {
      validateField('govtId', file);
    }
  }, [touched.govtId, validateField]);

  // Compute form validity without calling validation functions that update state
  const isFormValid = useMemo(() => {
    const requiredFields = ['fullName', 'email', 'phone', 'password', 'confirmPassword', 'city', 'state', 'panNumber', 'idType'];
    
    // Check if required fields have values and no errors
    const fieldsValid = requiredFields.every(field => {
      const value = formData[field as keyof typeof formData] as string;
      return value.trim() !== '' && !errors[field as keyof FormErrors];
    });
    
    // Check if file is uploaded and no file error
    const fileValid = formData.govtId !== null && !errors.govtId;
    
    return fieldsValid && fileValid && formData.agreeTerms;
  }, [formData, errors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allFields = ['fullName', 'email', 'phone', 'password', 'confirmPassword', 'city', 'state', 'panNumber', 'idType'];
    const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), { govtId: true });
    setTouched(newTouched);

    // Validate all fields
    const validations = allFields.map(field => {
      const value = formData[field as keyof typeof formData] as string;
      return validateField(field, value);
    });
    
    const fileValidation = validateField('govtId', formData.govtId);

    if (validations.every(v => v) && fileValidation && formData.agreeTerms) {
      console.log('Campaigner signup:', formData);
      // Handle successful submission here
    }
  }, [formData, validateField]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <CampaignIconComponent />
            <Typography variant="h4" component="h2" mt={1} gutterBottom>
              Individual Fundraiser
            </Typography>
            <Typography color="text.secondary">
              Start fundraisers and help others in need
            </Typography>
          </Box>

          <Alert type="info" sx={{ mb: 3 }}>
            Verification is required to ensure donor trust and prevent fraud
          </Alert>

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
              helperText={errors.phone || "Required for trust and OTP verification"}
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Input
                  label="City"
                  value={formData.city}
                  onChange={handleChange('city')}
                  onBlur={handleBlur('city')}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  label="State"
                  value={formData.state}
                  onChange={handleChange('state')}
                  onBlur={handleBlur('state')}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>
            </Grid>
            
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
              label="PAN Number"
              value={formData.panNumber}
              onChange={handleChange('panNumber')}
              onBlur={handleBlur('panNumber')}
              error={!!errors.panNumber}
              helperText={errors.panNumber || "Required for fund withdrawal and tax compliance"}
              required
            />

            <Select
              label="Government ID Type"
              value={formData.idType}
              onChange={handleSelectChange('idType')}
              error={!!errors.idType}
              helperText={errors.idType}
              options={[
                { value: '', label: 'Select ID Type' },
                { value: 'aadhar', label: 'Aadhar Card' },
                { value: 'voter', label: 'Voter ID' },
                { value: 'passport', label: 'Passport' },
                { value: 'driving', label: 'Driving License' }
              ]}
              required
            />

            <Box sx={{ mb: 2 }}>
              <FileUpload
                label="Upload Government ID"
                value={formData.govtId}
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              {errors.govtId && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.govtId}
                </Typography>
              )}
            </Box>

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
              Create Campaigner Account
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

export default CampaignerSignup; 
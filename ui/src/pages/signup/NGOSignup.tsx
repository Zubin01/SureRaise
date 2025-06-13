import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CardContent, SelectChangeEvent } from '@mui/material';
import { Button, Card, Input, Select, FileUpload, Checkbox, Stepper } from '../../components/common';
import { BusinessIconComponent } from '../../components/icons/Icons';
import { validateEmail, validatePassword, validateConfirmPassword, validatePhone, validatePAN, validateName, validateRequired, validateFile, validateWebsite } from '../../utils/validation';

interface FormErrors {
  ngoName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  state?: string;
  city?: string;
  website?: string;
  registrationNumber?: string;
  certificate?: string;
  panTan?: string;
}

const NGOSignup = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    ngoName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: '',
    city: '',
    website: '',
    registrationNumber: '',
    certificate: null as File | null,
    panTan: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const steps = ['Basic Information', 'Location & Contact', 'Verification Documents'];

  const validateField = useCallback((fieldName: string, value: string | File | null) => {
    let validation: { isValid: boolean; message: string };
    switch (fieldName) {
      case 'ngoName':
        validation = validateName(value as string);
        break;
      case 'email':
        validation = validateEmail(value as string);
        break;
      case 'phone':
        validation = validatePhone(value as string);
        break;
      case 'password':
        validation = validatePassword(value as string);
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(formData.password, value as string);
        break;
      case 'state':
        validation = validateRequired(value as string, 'State');
        break;
      case 'city':
        validation = validateRequired(value as string, 'City');
        break;
      case 'website':
        validation = validateWebsite(value as string);
        break;
      case 'registrationNumber':
        validation = validateRequired(value as string, 'Registration Number');
        break;
      case 'certificate':
        validation = validateFile(value as File, true);
        break;
      case 'panTan':
        validation = validatePAN(value as string);
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
    if (field === 'certificate') {
      validateField(field, value as File);
    } else {
      validateField(field, value as string);
    }
  }, [formData, validateField]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, certificate: file }));
    
    if (touched.certificate) {
      validateField('certificate', file);
    }
  }, [touched.certificate, validateField]);

  // Validate current step
  const isStepValid = useMemo(() => {
    switch (activeStep) {
      case 0: // Basic Information
        const step0Fields = ['ngoName', 'email', 'password', 'confirmPassword'];
        return step0Fields.every(field => {
          const value = formData[field as keyof typeof formData] as string;
          return value.trim() !== '' && !errors[field as keyof FormErrors];
        }) && (!formData.phone || !errors.phone); // Phone is optional
      
      case 1: // Location & Contact
        const step1Fields = ['state', 'city'];
        return step1Fields.every(field => {
          const value = formData[field as keyof typeof formData] as string;
          return value.trim() !== '' && !errors[field as keyof FormErrors];
        }) && (!formData.website || !errors.website); // Website is optional
      
      case 2: // Verification Documents
        const step2Fields = ['registrationNumber'];
        const fieldsValid = step2Fields.every(field => {
          const value = formData[field as keyof typeof formData] as string;
          return value.trim() !== '' && !errors[field as keyof FormErrors];
        });
        const fileValid = formData.certificate !== null && !errors.certificate;
        const panValid = !formData.panTan || !errors.panTan; // PAN is optional
        
        return fieldsValid && fileValid && panValid && formData.agreeTerms;
      
      default:
        return false;
    }
  }, [activeStep, formData, errors]);

  const handleNext = useCallback(() => {
    // Mark current step fields as touched
    const currentStepFields = getCurrentStepFields();
    const newTouched = currentStepFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(prev => ({ ...prev, ...newTouched }));

    // Validate current step fields
    const validations = currentStepFields.map(field => {
      const value = formData[field as keyof typeof formData];
      return validateField(field, value as string | File);
    });

    if (validations.every(v => v) && isStepValid) {
      setActiveStep(prev => prev + 1);
    }
  }, [formData, validateField, isStepValid]);

  const handleBack = useCallback(() => {
    setActiveStep(prev => prev - 1);
  }, []);

  const getCurrentStepFields = () => {
    switch (activeStep) {
      case 0:
        return ['ngoName', 'email', 'phone', 'password', 'confirmPassword'];
      case 1:
        return ['state', 'city', 'website'];
      case 2:
        return ['registrationNumber', 'certificate', 'panTan'];
      default:
        return [];
    }
  };

  const handleSubmit = useCallback(() => {
    // Mark all fields as touched
    const allFields = ['ngoName', 'email', 'phone', 'password', 'confirmPassword', 'state', 'city', 'website', 'registrationNumber', 'certificate', 'panTan'];
    const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(newTouched);

    // Validate all fields
    const validations = allFields.map(field => {
      const value = formData[field as keyof typeof formData];
      return validateField(field, value as string | File);
    });

    if (validations.every(v => v) && formData.agreeTerms) {
      console.log('NGO signup:', formData);
      // Handle successful submission here
    }
  }, [formData, validateField]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Input
              label="NGO Name"
              value={formData.ngoName}
              onChange={handleChange('ngoName')}
              onBlur={handleBlur('ngoName')}
              error={!!errors.ngoName}
              helperText={errors.ngoName}
              required
            />
            <Input
              label="Official Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
            <Input
              label="Office Phone Number"
              value={formData.phone}
              onChange={handleChange('phone')}
              onBlur={handleBlur('phone')}
              error={!!errors.phone}
              helperText={errors.phone || "Optional but builds trust"}
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
          </Box>
        );
      case 1:
        return (
          <Box>
            <Select
              label="State"
              value={formData.state}
              onChange={handleSelectChange('state')}
              error={!!errors.state}
              helperText={errors.state}
              options={[
                { value: '', label: 'Select State' },
                { value: 'rajasthan', label: 'Rajasthan' },
                { value: 'delhi', label: 'Delhi' },
                { value: 'maharashtra', label: 'Maharashtra' },
                { value: 'karnataka', label: 'Karnataka' }
              ]}
              required
            />
            <Input
              label="City"
              value={formData.city}
              onChange={handleChange('city')}
              onBlur={handleBlur('city')}
              error={!!errors.city}
              helperText={errors.city}
              required
            />
            <Input
              label="Website/Social Media Link"
              value={formData.website}
              onChange={handleChange('website')}
              onBlur={handleBlur('website')}
              error={!!errors.website}
              helperText={errors.website || "Optional - Builds credibility"}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Input
              label="NGO Registration Number"
              value={formData.registrationNumber}
              onChange={handleChange('registrationNumber')}
              onBlur={handleBlur('registrationNumber')}
              error={!!errors.registrationNumber}
              helperText={errors.registrationNumber}
              required
            />
            <Box sx={{ mb: 2 }}>
              <FileUpload
                label="Upload NGO Certificate (PDF/JPEG)"
                value={formData.certificate}
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              {errors.certificate && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.certificate}
                </Typography>
              )}
            </Box>
            <Input
              label="PAN/TAN Number"
              value={formData.panTan}
              onChange={handleChange('panTan')}
              onBlur={handleBlur('panTan')}
              error={!!errors.panTan}
              helperText={errors.panTan || "Optional - For financial transparency"}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <BusinessIconComponent />
            <Typography variant="h4" component="h2" mt={1} gutterBottom>
              NGO Registration
            </Typography>
            <Typography color="text.secondary">
              Join our verified NGO directory
            </Typography>
          </Box>

          <Box mb={4}>
            <Stepper activeStep={activeStep} steps={steps} />
          </Box>

          <Box>{renderStepContent(activeStep)}</Box>

          {activeStep === steps.length - 1 && (
            <Box mt={2} mb={3}>
              <Checkbox
                label="I agree to the Terms of Service and Privacy Policy"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
              />
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate('/') : handleBack}
            >
              {activeStep === 0 ? 'Back to Home' : 'Back'}
            </Button>
            <Button
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
              disabled={!isStepValid}
            >
              {activeStep === steps.length - 1 ? 'Create NGO Account' : 'Next'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NGOSignup; 
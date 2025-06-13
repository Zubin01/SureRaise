export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
  }
  return { isValid: true, message: '' };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  return { isValid: true, message: '' };
};

export const validatePhone = (phone: string): ValidationResult => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  if (!phone) {
    return { isValid: true, message: '' }; // Phone is optional in some forms
  }
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: 'Please enter a valid 10-digit mobile number' };
  }
  return { isValid: true, message: '' };
};

export const validateRequiredPhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }
  return validatePhone(phone);
};

export const validatePAN = (pan: string): ValidationResult => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!pan) {
    return { isValid: true, message: '' }; // PAN is optional in some forms
  }
  if (!panRegex.test(pan.toUpperCase())) {
    return { isValid: false, message: 'Please enter a valid PAN number (e.g., ABCDE1234F)' };
  }
  return { isValid: true, message: '' };
};

export const validateRequiredPAN = (pan: string): ValidationResult => {
  if (!pan) {
    return { isValid: false, message: 'PAN number is required' };
  }
  return validatePAN(pan);
};

export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }
  if (name.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, message: 'Name can only contain letters and spaces' };
  }
  return { isValid: true, message: '' };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

export const validateFile = (file: File | null, required: boolean = false): ValidationResult => {
  if (!file && required) {
    return { isValid: false, message: 'Please upload a file' };
  }
  if (!file) {
    return { isValid: true, message: '' };
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Please upload a valid file (JPG, PNG, or PDF)' };
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, message: 'File size must be less than 5MB' };
  }
  
  return { isValid: true, message: '' };
};

export const validateWebsite = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: true, message: '' }; // Website is optional
  }
  
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (!urlRegex.test(url)) {
    return { isValid: false, message: 'Please enter a valid website URL' };
  }
  
  return { isValid: true, message: '' };
};

export const validateAccessCode = (code: string): ValidationResult => {
  if (!code) {
    return { isValid: false, message: 'Access code is required' };
  }
  if (code.length < 6) {
    return { isValid: false, message: 'Access code must be at least 6 characters long' };
  }
  return { isValid: true, message: '' };
}; 
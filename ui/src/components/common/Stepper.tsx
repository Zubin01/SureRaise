import React from 'react';
import { Stepper as MuiStepper, Step, StepLabel, StepContent } from '@mui/material';

interface StepperProps {
  activeStep: number;
  steps: string[];
  orientation?: 'horizontal' | 'vertical';
}

const Stepper: React.FC<StepperProps> = ({ activeStep, steps, orientation = 'horizontal' }) => {
  return (
    <MuiStepper activeStep={activeStep} orientation={orientation}>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
          {orientation === 'vertical' && (
            <StepContent>
              {/* Content for vertical stepper can be added here */}
            </StepContent>
          )}
        </Step>
      ))}
    </MuiStepper>
  );
};

export default Stepper; 
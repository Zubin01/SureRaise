import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';

interface CardProps extends MuiCardProps {
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, onClick, ...props }) => {
  return (
    <MuiCard
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: 3
        } : {}
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </MuiCard>
  );
};

export default Card; 
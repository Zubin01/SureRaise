import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    login();
    navigate('/campaigns');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login to Local Charity Hub
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login (Demo)
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login; 
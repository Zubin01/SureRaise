import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Support Local Causes
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Join us in making a difference in our community. Your support can help change lives
          and create lasting impact for those in need.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/campaigns')}
          >
            View Campaigns
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 
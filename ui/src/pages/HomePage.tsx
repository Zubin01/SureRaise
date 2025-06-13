import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, CardContent, Box } from '@mui/material';
import { Button, Card } from '../components/common';
import { 
  PersonIconComponent, 
  BusinessIconComponent, 
  CampaignIconComponent, 
  AdminIconComponent 
} from '../components/icons/Icons';

const HomePage = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      type: 'donor',
      title: 'Individual Supporter',
      description: 'Donate to causes, track your contributions, and get tax receipts',
      icon: <PersonIconComponent />,
      color: 'primary.light'
    },
    {
      type: 'ngo',
      title: 'NGO Organization',
      description: 'Publish content, manage campaigns, and appear in our directory',
      icon: <BusinessIconComponent />,
      color: 'success.light'
    },
    {
      type: 'campaigner',
      title: 'Individual Fundraiser',
      description: 'Start fundraisers for yourself or others in need',
      icon: <CampaignIconComponent />,
      color: 'warning.light'
    },
    {
      type: 'admin',
      title: 'Admin Access',
      description: 'Manage website content, users, and campaigns',
      icon: <AdminIconComponent />,
      color: 'error.light'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom color="text.primary">
          Join Our Platform
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Choose your account type to get started
        </Typography>
      </Box>
      
      <Grid container spacing={3} mb={4}>
        {userTypes.map((user) => (
          <Grid item xs={12} md={6} key={user.type}>
            <Card 
              onClick={() => navigate(`/signup/${user.type}`)}
              sx={{ 
                bgcolor: user.color,
                height: '100%',
                cursor: 'pointer'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box mb={2}>{user.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {user.title}
                </Typography>
                <Typography color="text.secondary">
                  {user.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center">
        <Typography color="text.secondary" component="span">
          Already have an account?{' '}
        </Typography>
        <Button variant="text" onClick={() => navigate('/signin')}>
          Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage; 
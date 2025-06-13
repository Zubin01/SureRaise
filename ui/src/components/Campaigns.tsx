import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, LinearProgress, Box } from '@mui/material';
import axios from 'axios';
import { config } from 'process';

interface Campaign {
  id: number;
  title: string;
  goal: number;
  raised: number;
  description: string;
}

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: "Help Local Food Bank",
      goal: 10000,
      raised: 7500,
      description: "Support our local food bank to provide meals for families in need"
    },
    {
      id: 2,
      title: "School Supplies Drive",
      goal: 5000,
      raised: 3200,
      description: "Help provide school supplies for underprivileged children"
    },
    {
      id: 3,
      title: "Community Garden Project",
      goal: 8000,
      raised: 4500,
      description: "Create a community garden to promote sustainable living"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/campaigns');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Active Campaigns
      </Typography>
      <Grid container spacing={4}>
        {campaigns.map((campaign) => (
          <Grid item key={campaign.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {campaign.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {campaign.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Progress: ${campaign.raised} / ${campaign.goal}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(campaign.raised / campaign.goal) * 100}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Campaigns;
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

interface Donor {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  panCard: string;
  createdAt: string;
}

const DonorList: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('/api/auth/donors');
        if (!response.ok) throw new Error('Failed to fetch donors');
        const data = await response.json();
        setDonors(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            All Donors
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>PAN Card</TableCell>
                    <TableCell>Joined</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {donors.map((donor) => (
                    <TableRow key={donor.id}>
                      <TableCell>{donor.id}</TableCell>
                      <TableCell>{donor.fullName}</TableCell>
                      <TableCell>{donor.email}</TableCell>
                      <TableCell>{donor.phone}</TableCell>
                      <TableCell>{donor.panCard}</TableCell>
                      <TableCell>{new Date(donor.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default DonorList; 
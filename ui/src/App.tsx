import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box, CssBaseline } from '@mui/material';
import Home from './components/Home';
import Campaigns from './components/Campaigns';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import new pages
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import DonorSignup from './pages/signup/DonorSignup';
import NGOSignup from './pages/signup/NGOSignup';
import CampaignerSignup from './pages/signup/CampaignerSignup';
import AdminSignup from './pages/signup/AdminSignup';
import DonorList from './pages/DonorList';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Local Charity Hub
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/campaigns">
              Campaigns
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/signup-options">
              Sign Up
            </Button>
            <Button color="inherit" component={Link} to="/signin">
              Sign In
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />

          <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup-options" element={<HomePage />} />
              <Route path="/signup/donor" element={<DonorSignup />} />
              <Route path="/signup/ngo" element={<NGOSignup />} />
              <Route path="/signup/campaigner" element={<CampaignerSignup />} />
              <Route path="/signup/admin" element={<AdminSignup />} />
              <Route path="/donors" element={<DonorList />} />
              <Route
                path="/campaigns"
                element={
                  <ProtectedRoute>
                    <Campaigns />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>

          <Box component="footer" sx={{ py: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
                <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
                <Link to="/privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy</Link>
              </Box>
            </Container>
          </Box>
        </Box>
      </Router>
    </AuthProvider>
  );
}

export default App;

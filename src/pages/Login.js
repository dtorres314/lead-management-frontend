import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Container, Grid, Alert } from '@mui/material';
import AuthForm from '../components/AuthForm';
import { login as loginAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (values) => {
    loginAPI(values)
      .then((response) => {
        setSuccessMessage('Login successful! Redirecting to dashboard...');
        setErrorMessage('');
        login(response.data.user, response.data.token);

        // Delay navigation to dashboard so the user sees the success message for a few seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000); // 1 second delay before redirecting to dashboard
      })
      .catch(() => {
        setErrorMessage('Login failed. Please check your credentials.');
        setSuccessMessage('');
      });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

        <AuthForm initialValues={{ email: '', password: '' }} onSubmit={handleSubmit} buttonText="Login" />

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="body2">
              {"Don't have an account? "}
              <Link to="/signup" style={{ color: 'blue', textDecoration: 'underline' }}>Sign Up</Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;

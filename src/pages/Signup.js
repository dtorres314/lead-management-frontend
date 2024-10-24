import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Container, Grid, Alert } from '@mui/material';
import AuthForm from '../components/AuthForm';
import { register } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (values) => {
    register(values)
      .then(() => {
        setSuccessMessage('Signup successful! Redirecting to login...');
        setErrorMessage('');
        // Delay navigation so the user sees the success message for a few seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000); // 2 seconds delay before redirecting to login
      })
      .catch(() => {
        setErrorMessage('Signup failed. Please check the entered data.');
        setSuccessMessage('');
      });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}

        <AuthForm
          initialValues={{ name: '', email: '', password: '', password_confirmation: '' }}
          onSubmit={handleSubmit}
          buttonText="Sign Up"
        />

        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="body2">
              {"Already have an account? "}
              <Link to="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Login</Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Signup;

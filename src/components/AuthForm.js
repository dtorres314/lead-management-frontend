import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';

const AuthForm = ({ onSubmit, initialValues, buttonText }) => {
  const validationSchema = Yup.object({
    name: 'name' in initialValues ? Yup.string().required('Required') : undefined, // Name only for signup
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Required'),
    password_confirmation: 'password_confirmation' in initialValues
      ? Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required')
      : undefined, // Confirm password only for signup
  });

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched, handleChange, handleSubmit }) => (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {/* Name field only for Signup */}
          {'name' in initialValues && (
            <TextField
              fullWidth
              label="Name"
              name="name"
              margin="normal"
              onChange={handleChange}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
          )}

          {/* Email field for both Login and Signup */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            margin="normal"
            onChange={handleChange}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />

          {/* Password field for both Login and Signup */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            onChange={handleChange}
            error={touched.password && Boolean(errors.password)}
            helperText={touched.password && errors.password}
          />

          {/* Confirm Password field only for Signup */}
          {'password_confirmation' in initialValues && (
            <TextField
              fullWidth
              label="Confirm Password"
              name="password_confirmation"
              type="password"
              margin="normal"
              onChange={handleChange}
              error={touched.password_confirmation && Boolean(errors.password_confirmation)}
              helperText={touched.password_confirmation && errors.password_confirmation}
            />
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {buttonText}
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export default AuthForm;

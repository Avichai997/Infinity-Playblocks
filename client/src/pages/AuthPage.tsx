import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';

import { useLoginMutation, useRegisterMutation } from '@/mutations';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  useEffect(() => {
    if (loginMutation.isError) {
      const err = loginMutation.error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Login failed');
    } else if (registerMutation.isError) {
      const err = registerMutation.error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Registration failed');
    }
  }, [
    loginMutation.isError,
    loginMutation.error,
    registerMutation.isError,
    registerMutation.error,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isLogin) {
      loginMutation.mutate(
        { email, password },
        {
          onError: (err) => {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Login failed');
          },
        },
      );
    } else {
      registerMutation.mutate(
        { email, password },
        {
          onError: (err) => {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Registration failed');
          },
        },
      );
    }
  };

  return (
    <Box className='flex min-h-screen items-center justify-center bg-gray-50'>
      <Container maxWidth='sm'>
        <Card className='shadow-lg'>
          <CardContent className='p-8'>
            <Typography variant='h4' component='h1' className='mb-6 text-center font-bold'>
              {isLogin ? 'Login' : 'Register'}
            </Typography>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <TextField
                fullWidth
                label='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant='outlined'
                className='mb-4'
              />

              <TextField
                fullWidth
                label='Password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant='outlined'
                className='mb-4'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => setShowPassword(!showPassword)}
                        edge='end'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Alert severity='error' className='mb-4'>
                  {error}
                </Alert>
              )}

              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={loginMutation.isPending || registerMutation.isPending}
                className='mb-4 bg-indigo-600 hover:bg-indigo-700'
                sx={{ py: 1.5 }}
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>

              <Box className='text-center'>
                <Button
                  type='button'
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className='text-indigo-600 hover:text-indigo-500'
                >
                  {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

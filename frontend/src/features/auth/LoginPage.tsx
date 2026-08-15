import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Box, Button, Paper, Stack, TextField, Typography, Alert,
  InputAdornment, IconButton, Divider, Chip,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setCredentials, selectIsAuthenticated } from '@/app/authSlice';
import { useLoginMutation } from './authApi';
import type { LoginPayload } from '@/types/auth';

export function LoginPage() {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const isAuth     = useAppSelector(selectIsAuthenticated);
  const [login, { isLoading, error }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuth) navigate('/', { replace: true });
  }, [isAuth, navigate]);

  const { control, handleSubmit } = useForm<LoginPayload>({
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values: LoginPayload) => {
    const result = await login(values);
    if ('data' in result && result.data) {
      dispatch(setCredentials(result.data));
    }
  };

  const errorMessage =
    error && 'data' in error
      ? (error.data as { message?: string })?.message ?? 'Invalid credentials. Please try again.'
      : null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ bgcolor: 'grey.100' }}
    >
      <Paper elevation={3} sx={{ p: 5, width: 420, borderRadius: 3 }}>
        {/* Logo / Title */}
        <Stack alignItems="center" spacing={1} mb={3}>
          <Box
            sx={{
              width: 52, height: 52, borderRadius: '50%',
              bgcolor: 'primary.main', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <LockOutlinedIcon sx={{ color: 'white', fontSize: 26 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            PDM Portal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Provider Data Management System
          </Typography>
        </Stack>

        <Divider sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary">Sign in to your account</Typography>
        </Divider>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Controller
              name="username"
              control={control}
              rules={{ required: 'Username is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Username"
                  autoFocus
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ mt: 1, py: 1.4, fontWeight: 600, borderRadius: 2 }}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Stack>
        </form>

        {/* Role legend */}
        <Stack direction="row" spacing={1} mt={3} justifyContent="center" flexWrap="wrap">
          <Chip size="small" label="PD_ADMIN" color="primary" variant="outlined" />
          <Chip size="small" label="PD_ASSOCIATE" color="success" variant="outlined" />
          <Chip size="small" label="READ_ONLY" color="default" variant="outlined" />
        </Stack>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
          Access is role-based. Contact your administrator for credentials.
        </Typography>
      </Paper>
    </Box>
  );
}

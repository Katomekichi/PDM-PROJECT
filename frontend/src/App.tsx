import {
  AppBar, Toolbar, Typography, Box, CssBaseline,
  Menu, MenuItem, Avatar, Chip, Stack, Divider, ListItemIcon, Tooltip, IconButton,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { theme } from './theme';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { logout, selectCurrentUser, selectFullName, selectCurrentRoles, selectIsAuthenticated } from './app/authSlice';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { PractitionerListPage } from './features/practitioner/PractitionerListPage';
import { PractitionerFormPage } from './features/practitioner/PractitionerFormPage';
import { PractitionerDetailPage } from './features/practitioner/PractitionerDetailPage';
import { AuditTransactionPage } from './features/practitioner/AuditTransactionPage';
import { OrganizationListPage } from './features/organization/OrganizationListPage';
import { OrganizationFormPage } from './features/organization/OrganizationFormPage';
import { OrganizationDetailPage } from './features/organization/OrganizationDetailPage';
import Dashboard from './features/dashboard/Dashboard';

// Returns initials from a full name string (e.g. "John Doe" → "JD")
function getInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function NavBar() {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const isAuth     = useAppSelector(selectIsAuthenticated);
  const username   = useAppSelector(selectCurrentUser);
  const fullName   = useAppSelector(selectFullName);
  const roles      = useAppSelector(selectCurrentRoles);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  if (!isAuth) return null;

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* ── Left: brand ── */}
        <Typography
          variant="h6"
          fontWeight={700}
          color="primary.main"
          sx={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => navigate('/')}
        >
          PDM · Provider Data Management
        </Typography>

        {/* ── Center: nav links ── */}
        {/* <Stack direction="row" spacing={3}>
          {[
            { label: 'Dashboard',      to: '/' },
            { label: 'Practitioners',  to: '/practitioners' },
            { label: 'Organizations',  to: '/organizations' },
          ].map(({ label, to }) => (
            <Typography
              key={to}
              component={Link}
              to={to}
              variant="body2"
              fontWeight={500}
              color="text.primary"
              sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              {label}
            </Typography>
          ))}
        </Stack> */}

        {/* ── Right: user avatar + menu ── */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {fullName ?? username}
          </Typography>
          <Tooltip title="Account">
            <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0 }}>
              <Avatar
                sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }}
              >
                {getInitials(fullName ?? username)}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Stack>

        {/* ── Dropdown menu ── */}
        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{ sx: { mt: 1, minWidth: 220 } }}
        >
          {/* User info header */}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>{fullName ?? username}</Typography>
            <Typography variant="caption" color="text.secondary">@{username}</Typography>
            <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap">
              {roles.map((r) => (
                <Chip
                  key={r}
                  label={r}
                  size="small"
                  color={r === 'PD_ADMIN' ? 'primary' : r === 'PD_ASSOCIATE' ? 'success' : 'default'}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>

          <Divider />

          <MenuItem onClick={() => { setAnchor(null); navigate('/'); }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            My Profile
          </MenuItem>

          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Box>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/practitioners" element={<ProtectedRoute><PractitionerListPage /></ProtectedRoute>} />
            <Route path="/practitioners/new" element={<ProtectedRoute><PractitionerFormPage /></ProtectedRoute>} />
            <Route path="/practitioners/:id/edit" element={<ProtectedRoute><PractitionerFormPage /></ProtectedRoute>} />
            <Route path="/practitioners/:id" element={<ProtectedRoute><PractitionerDetailPage /></ProtectedRoute>} />
            <Route path="/practitioners/:id/audit-transactions" element={<ProtectedRoute><AuditTransactionPage /></ProtectedRoute>} />
            <Route path="/organizations" element={<ProtectedRoute><OrganizationListPage /></ProtectedRoute>} />
            <Route path="/organizations/new" element={<ProtectedRoute><OrganizationFormPage /></ProtectedRoute>} />
            <Route path="/organizations/:id" element={<ProtectedRoute><OrganizationDetailPage /></ProtectedRoute>} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

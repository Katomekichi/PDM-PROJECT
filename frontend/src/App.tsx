import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { theme } from '@/shared/theme';
import { NavBar } from '@/shared/layout/NavBar';
import { AppRoutes } from '@/app/routes';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Box>
          <AppRoutes />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Playlists } from './pages/Playlists';
import SpotifyPage from './pages/SpotifyPage';
import { useAuth } from './context/AuthContext';
import { theme } from './theme/theme';
import { Box, CircularProgress } from '@mui/material';
import PlaylistDetailPage from './pages/PlaylistDetailPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/playlists" />;
};

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route
                path="/playlists"
                element={
                  <PrivateRoute>
                    <Playlists />
                  </PrivateRoute>
                }
              />
              <Route
                path="/playlist/:id"
                element={
                  <PrivateRoute>
                    <PlaylistDetailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/spotify"
                element={
                  <PrivateRoute>
                    <SpotifyPage />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/playlists" />} />
              <Route path="/callback" element={<SpotifyPage />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

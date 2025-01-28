import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954',
      light: '#1ed760',
      dark: '#1aa34a'
    },
    secondary: {
      main: '#b3b3b3',
      light: '#d9d9d9',
      dark: '#808080'
    },
    background: {
      default: '#121212',
      paper: '#282828'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3'
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 700
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 700
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 700
    },
    body1: {
      fontSize: '1rem'
    },
    body2: {
      fontSize: '0.875rem'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 16px'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});

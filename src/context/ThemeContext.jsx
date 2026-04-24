import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggleTheme = () => setMode(prev => prev === 'light' ? 'dark' : 'light');

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#7C3AED' },
      secondary: { main: '#F59E0B' },
      background: {
        default: mode === 'dark' ? '#0F0F1A' : '#F8F7FF',
        paper: mode === 'dark' ? '#1A1A2E' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#F1F0FF' : '#1A1A2E',
        secondary: mode === 'dark' ? '#9B9BC0' : '#6B6B8A',
      },
      success: { main: '#10B981' },
      warning: { main: '#F59E0B' },
      error: { main: '#EF4444' },
      divider: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    },
    typography: {
      fontFamily: '"DM Sans", sans-serif',
      h1: { fontFamily: '"Syne", sans-serif', fontWeight: 800 },
      h2: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
      h3: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
      h4: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
      h5: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            fontFamily: '"DM Sans", sans-serif',
            borderRadius: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
      MuiTextField: {
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

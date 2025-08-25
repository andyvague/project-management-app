import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { MONKEYBRAINS_BRANDING, getBrandColors } from '../config/branding';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Check localStorage for saved preference, default to light mode
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'light';
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const brandColors = getBrandColors(mode);
  
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: brandColors.primary,
        light: mode === 'light' ? '#4CAF50' : '#66BB6A',
        dark: mode === 'light' ? '#1B5E20' : '#388E3C',
      },
      secondary: {
        main: brandColors.secondary,
        light: mode === 'light' ? '#FF9800' : '#FFB74D',
        dark: mode === 'light' ? '#E65100' : '#F57C00',
      },
      background: {
        default: brandColors.background,
        paper: brandColors.surface,
      },
      text: {
        primary: brandColors.text,
        secondary: brandColors.textSecondary,
      },
      divider: mode === 'light' ? '#E0E0E0' : '#424242',
      success: {
        main: MONKEYBRAINS_BRANDING.colors.success,
      },
      warning: {
        main: MONKEYBRAINS_BRANDING.colors.warning,
      },
      error: {
        main: MONKEYBRAINS_BRANDING.colors.error,
      },
      info: {
        main: MONKEYBRAINS_BRANDING.colors.info,
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 2px 8px rgba(0,0,0,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.3)',
            borderRadius: 8,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#1976d2' : '#1e1e1e',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            color: mode === 'light' ? '#000000' : '#ffffff',
          },
        },
      },
    },
  });

  const value: ThemeContextType = {
    mode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

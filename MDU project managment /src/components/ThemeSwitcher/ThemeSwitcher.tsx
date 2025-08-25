import React from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  variant?: 'icon' | 'button';
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  size = 'medium', 
  showLabel = false,
  variant = 'icon'
}) => {
  const { mode, toggleTheme } = useThemeContext();

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'small';
      case 'large':
        return 'large';
      default:
        return 'medium';
    }
  };

  const getTooltipTitle = () => {
    const action = mode === 'light' ? 'dark' : 'light';
    return `Switch to ${action} mode`;
  };

  if (variant === 'button') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={toggleTheme}
          size={size}
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              backgroundColor: 'action.hover',
              transform: 'scale(1.05)',
              transition: 'transform 0.2s ease',
            }
          }}
        >
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
        {showLabel && (
          <span style={{ fontSize: '0.875rem', color: 'inherit' }}>
            {mode === 'light' ? 'Dark' : 'Light'} Mode
          </span>
        )}
      </Box>
    );
  }

  return (
    <Tooltip title={getTooltipTitle()}>
      <IconButton
        onClick={toggleTheme}
        size={size}
        sx={{ 
          color: 'inherit',
          '&:hover': {
            backgroundColor: 'action.hover',
            transform: 'rotate(180deg)',
            transition: 'transform 0.3s ease',
          }
        }}
      >
        {mode === 'light' ? 
          <DarkModeIcon fontSize={getIconSize()} /> : 
          <LightModeIcon fontSize={getIconSize()} />
        }
      </IconButton>
    </Tooltip>
  );
};

export default ThemeSwitcher;

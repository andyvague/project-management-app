import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useThemeContext } from '../../context/ThemeContext';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

const ThemeDemo: React.FC = () => {
  const { mode } = useThemeContext();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Theme Demo
          </Typography>
          <ThemeSwitcher variant="button" showLabel />
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Current theme: <strong>{mode === 'light' ? 'Light Mode' : 'Dark Mode'}</strong>
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          <Chip 
            label="Primary Color" 
            color="primary" 
            size="small" 
          />
          <Chip 
            label="Secondary Color" 
            color="secondary" 
            size="small" 
          />
          <Chip 
            label="Success" 
            color="success" 
            size="small" 
          />
          <Chip 
            label="Warning" 
            color="warning" 
            size="small" 
          />
          <Chip 
            label="Error" 
            color="error" 
            size="small" 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Notice how the colors and backgrounds adapt to your chosen theme. 
          The system automatically adjusts all components for optimal visibility.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ThemeDemo;

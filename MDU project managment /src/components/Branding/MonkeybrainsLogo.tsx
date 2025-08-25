import React from 'react';
import { Box, Typography, SvgIcon } from '@mui/material';
import { MONKEYBRAINS_BRANDING } from '../../config/branding';

interface MonkeybrainsLogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  color?: 'primary' | 'inherit' | 'white';
}

const MonkeybrainsLogo: React.FC<MonkeybrainsLogoProps> = ({
  variant = 'full',
  size = 'medium',
  showTagline = true,
  color = 'primary'
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { logoSize: 24, fontSize: '1.25rem', taglineSize: '0.75rem' };
      case 'large':
        return { logoSize: 48, fontSize: '2rem', taglineSize: '1rem' };
      default:
        return { logoSize: 32, fontSize: '1.5rem', taglineSize: '0.875rem' };
    }
  };

  const { logoSize, fontSize, taglineSize } = getSizeStyles();

  const getColorValue = () => {
    switch (color) {
      case 'primary':
        return 'primary.main';
      case 'white':
        return 'white';
      default:
        return 'inherit';
    }
  };

  // Try to import logo images - these will be undefined if files don't exist
  const getLogoImage = () => {
    try {
      // Look for the user's logo.svg file first
      const url = new URL('../../assets/images/logo.svg', import.meta.url);
      return url.href;
    } catch {
      // Fallback to size-specific files if logo.svg not found
      const logoFiles = {
        small: ['logo-small.png', 'logo-small.svg', 'logo-small.jpg'],
        medium: ['logo-medium.png', 'logo-medium.svg', 'logo-medium.jpg'],
        large: ['logo-large.png', 'logo-large.svg', 'logo-large.jpg']
      };

      const sizeKey = size as keyof typeof logoFiles;
      const files = logoFiles[sizeKey];

      for (const file of files) {
        try {
          const url = new URL(`../../assets/images/${file}`, import.meta.url);
          return url.href;
        } catch {
          continue; // Try next file format
        }
      }
      
      return null; // No logo files found
    }
  };

  const logoImage = getLogoImage();

  // Simple antenna icon for fallback when no logo image is available
  const AntennaIcon = () => (
    <SvgIcon 
      sx={{ 
        fontSize: logoSize, 
        color: getColorValue(),
        mr: 1 
      }}
    >
      <path d="M12 2L8 6H6C4.9 6 4 6.9 4 8V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8C20 6.9 19.1 6 18 6H16L12 2Z" />
      <path d="M12 8C13.1 8 14 8.9 14 10V18C14 19.1 13.1 20 12 20C10.9 20 10 19.1 10 18V10C10 8.9 10.9 8 12 8Z" />
    </SvgIcon>
  );

  // Logo component that uses image if available, falls back to icon
  const LogoDisplay = () => {
    if (logoImage) {
      const isSvg = logoImage.includes('.svg');
      
      return (
        <img 
          src={logoImage} 
          alt={`${MONKEYBRAINS_BRANDING.company.name} Logo`}
          style={{ 
            width: logoSize, 
            height: logoSize,
            marginRight: 8,
            // SVG files can scale better, so we can be more flexible with sizing
            objectFit: isSvg ? 'contain' : 'cover'
          }}
        />
      );
    }
    return <AntennaIcon />;
  };

  if (variant === 'icon') {
    return <LogoDisplay />;
  }

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LogoDisplay />
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontSize,
            fontWeight: 'bold',
            color: getColorValue(),
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          {MONKEYBRAINS_BRANDING.company.name}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <LogoDisplay />
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontSize,
            fontWeight: 'bold',
            color: getColorValue(),
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          {MONKEYBRAINS_BRANDING.company.name}
        </Typography>
      </Box>
      {showTagline && (
        <Typography
          variant="caption"
          sx={{
            fontSize: taglineSize,
            color: color === 'white' ? 'rgba(255,255,255,0.8)' : 'text.secondary',
            fontStyle: 'italic',
            ml: logoSize + 8, // Align with text after icon
          }}
        >
          {MONKEYBRAINS_BRANDING.company.tagline}
        </Typography>
      )}
    </Box>
  );
};

export default MonkeybrainsLogo;

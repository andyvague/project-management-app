import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';
import { MONKEYBRAINS_BRANDING } from '../../config/branding';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} {MONKEYBRAINS_BRANDING.company.fullName}
        </Typography>
        
        <Typography variant="caption" color="text.secondary" align="center">
          {MONKEYBRAINS_BRANDING.company.tagline}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Link
            href={MONKEYBRAINS_BRANDING.company.website}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="body2"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Visit Website
          </Link>
          
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Based in {MONKEYBRAINS_BRANDING.company.location}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Since {MONKEYBRAINS_BRANDING.company.founded}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;

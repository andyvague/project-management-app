import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Speed as SpeedIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { MONKEYBRAINS_BRANDING } from '../../config/branding';

interface CompanyInfoProps {
  variant?: 'compact' | 'detailed';
  showStats?: boolean;
  showServices?: boolean;
  showValues?: boolean;
}

const CompanyInfo: React.FC<CompanyInfoProps> = ({
  variant = 'detailed',
  showStats = true,
  showServices = true,
  showValues = true,
}) => {
  if (variant === 'compact') {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          {MONKEYBRAINS_BRANDING.company.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {MONKEYBRAINS_BRANDING.company.tagline}
        </Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" color="primary" gutterBottom>
          About {MONKEYBRAINS_BRANDING.company.name}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {MONKEYBRAINS_BRANDING.company.description}
        </Typography>

        {showStats && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Company Statistics
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <LocationIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" color="primary">
                    {MONKEYBRAINS_BRANDING.stats.locations}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Locations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <ScheduleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" color="primary">
                    {MONKEYBRAINS_BRANDING.stats.newLocationsPerWeek}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New per Week
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <SpeedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" color="primary">
                    {MONKEYBRAINS_BRANDING.stats.maxSpeed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Max Speed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <BusinessIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" color="primary">
                    {MONKEYBRAINS_BRANDING.stats.yearsOfService}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Years of Service
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        )}

        {showServices && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Our Services
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {MONKEYBRAINS_BRANDING.services.map((service, index) => (
                <Chip
                  key={index}
                  label={service}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </>
        )}

        {showValues && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Our Values
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {MONKEYBRAINS_BRANDING.values.map((value, index) => (
                <Chip
                  key={index}
                  label={value}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </>
        )}

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Founded in {MONKEYBRAINS_BRANDING.company.founded} by{' '}
            {MONKEYBRAINS_BRANDING.company.founders.join(' and ')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Based in {MONKEYBRAINS_BRANDING.company.location}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompanyInfo;

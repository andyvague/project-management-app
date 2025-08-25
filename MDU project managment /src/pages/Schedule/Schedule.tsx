import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Schedule as ScheduleIcon } from '@mui/icons-material';

const Schedule: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Schedule
      </Typography>
      
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <ScheduleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Technician Scheduling
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Schedule technician shifts and installation dates for buildout projects.
          </Typography>
          <Button variant="contained" disabled>
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Schedule;

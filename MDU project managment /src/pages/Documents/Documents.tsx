import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Description as DocumentIcon } from '@mui/icons-material';

const Documents: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Documents
      </Typography>
      
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <DocumentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Document Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage permits, engineering drawings, approvals, and other project documents.
          </Typography>
          <Button variant="contained" disabled>
            Coming Soon
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Documents;

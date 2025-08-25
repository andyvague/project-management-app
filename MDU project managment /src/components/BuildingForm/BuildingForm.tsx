import React, { useState } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Building, BuildingStatus } from '../../types';

interface BuildingFormProps {
  building?: Partial<Building>;
  onSubmit: (buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ building, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    address: building?.address || '',
    city: building?.city || '',
    state: building?.state || '',
    zipCode: building?.zipCode || '',
    status: (building?.status as BuildingStatus) || 'planning',
    buildoutStartDate: building?.buildoutStartDate 
      ? building.buildoutStartDate.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    estimatedCompletion: building?.estimatedCompletion
      ? building.estimatedCompletion.toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectManager: building?.projectManager || '',
    notes: building?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!formData.projectManager.trim()) {
      newErrors.projectManager = 'Project manager is required';
    }
    if (new Date(formData.buildoutStartDate) >= new Date(formData.estimatedCompletion)) {
      newErrors.estimatedCompletion = 'Estimated completion must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        status: formData.status,
        buildoutStartDate: new Date(formData.buildoutStartDate),
        estimatedCompletion: new Date(formData.estimatedCompletion),
        projectManager: formData.projectManager.trim(),
        notes: formData.notes.trim(),
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            error={!!errors.city}
            helperText={errors.city}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel>State</InputLabel>
            <Select
              value={formData.state}
              label="State"
              onChange={(e) => handleChange('state', e.target.value)}
              required
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="ZIP Code"
            value={formData.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            error={!!errors.zipCode}
            helperText={errors.zipCode}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="planning">Planning</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="on-hold">On Hold</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Project Manager"
            value={formData.projectManager}
            onChange={(e) => handleChange('projectManager', e.target.value)}
            error={!!errors.projectManager}
            helperText={errors.projectManager}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Buildout Start Date"
            type="date"
            value={formData.buildoutStartDate}
            onChange={(e) => handleChange('buildoutStartDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Estimated Completion"
            type="date"
            value={formData.estimatedCompletion}
            onChange={(e) => handleChange('estimatedCompletion', e.target.value)}
            error={!!errors.estimatedCompletion}
            helperText={errors.estimatedCompletion}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            multiline
            rows={4}
            placeholder="Additional notes about the building or project..."
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          {building ? 'Update Building' : 'Add Building'}
        </Button>
      </Box>
    </Box>
  );
};

export default BuildingForm;

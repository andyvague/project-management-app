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
} from '@mui/material';
import { Building, BuildingStatus } from '../../types';

interface BuildingFormProps {
  building?: Partial<Building>;
  onSubmit: (buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
}

const BuildingForm: React.FC<BuildingFormProps> = ({ building, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: building?.name || '',
    address: building?.address || '',
    buildingType: (building?.buildingType as Building['buildingType']) || 'apartment_complex',
    totalUnits: typeof building?.totalUnits === 'number' ? String(building?.totalUnits) : '',
    status: (building?.status as BuildingStatus) || 'planning',
    buildoutStartDate: building?.buildoutStartDate
      ? building.buildoutStartDate.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    estimatedCompletion: building?.estimatedCompletion
      ? building.estimatedCompletion.toISOString().split('T')[0]
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    propertyManager: building?.propertyManager || '',
    notes: building?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.propertyManager.trim()) {
      newErrors.propertyManager = 'Property manager is required';
    }
    if (!formData.totalUnits || Number.isNaN(Number(formData.totalUnits)) || Number(formData.totalUnits) <= 0) {
      newErrors.totalUnits = 'Enter a valid number of units';
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
        name: formData.name.trim(),
        address: formData.address.trim(),
        buildingType: formData.buildingType,
        totalUnits: Number(formData.totalUnits),
        status: formData.status,
        buildoutStartDate: new Date(formData.buildoutStartDate),
        estimatedCompletion: new Date(formData.estimatedCompletion),
        propertyManager: formData.propertyManager.trim(),
        // The remaining required fields will be populated with sensible defaults in context
        notes: formData.notes.trim(),
        propertyManagerContact: '',
        propertyManagerEmail: '',
        fiberAccess: 'pending',
        rooftopAccess: 'available',
        basementAccess: 'available',
        electricalRoomAccess: 'available',
        priority: 'medium',
        estimatedRevenue: 0,
        actualRevenue: 0,
        buildoutStage: 'planning',
        actualCompletion: undefined,
      } as Omit<Building, 'id' | 'createdAt' | 'updatedAt'>);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // no-op

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
        </Grid>

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

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Building Type</InputLabel>
            <Select
              value={formData.buildingType}
              label="Building Type"
              onChange={(e) => handleChange('buildingType', e.target.value)}
            >
              <MenuItem value="apartment_complex">Apartment Complex</MenuItem>
              <MenuItem value="condominium">Condominium</MenuItem>
              <MenuItem value="mixed_use">Mixed Use</MenuItem>
              <MenuItem value="student_housing">Student Housing</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Units"
            type="number"
            inputProps={{ min: 1 }}
            value={formData.totalUnits}
            onChange={(e) => handleChange('totalUnits', e.target.value)}
            error={!!errors.totalUnits}
            helperText={errors.totalUnits}
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
            label="Property Manager"
            value={formData.propertyManager}
            onChange={(e) => handleChange('propertyManager', e.target.value)}
            error={!!errors.propertyManager}
            helperText={errors.propertyManager}
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

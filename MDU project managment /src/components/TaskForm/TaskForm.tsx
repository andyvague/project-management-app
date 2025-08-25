import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  FormHelperText,
  Grid,
  InputAdornment,
} from '@mui/material';
import { useBuildingContext } from '../../context/BuildingContext';
import { useUserContext } from '../../context/UserContext';
import { BuildoutTask, TaskStatus, BuildoutStage } from '../../types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<BuildoutTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<BuildoutTask>;
  mode: 'add' | 'edit';
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const { state: buildingState } = useBuildingContext();
  const { state: userState } = useUserContext();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buildingId: '',
    status: 'not-started' as TaskStatus,
    stage: 'planning' as BuildoutStage,
    assignedTo: '',
    dueDate: new Date(),
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    estimatedHours: 0,
    category: 'coordination' as BuildoutTask['category'],
    notes: '',
    dependencies: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data when editing
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        buildingId: initialData.buildingId || '',
        status: initialData.status || 'not-started',
        stage: initialData.stage || 'planning',
        assignedTo: initialData.assignedTo || '',
        dueDate: initialData.dueDate || new Date(),
        priority: initialData.priority || 'medium',
        estimatedHours: initialData.estimatedHours || 0,
        category: initialData.category || 'coordination',
        notes: initialData.notes || '',
        dependencies: initialData.dependencies || [],
      });
    }
  }, [initialData, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }

    if (!formData.buildingId) {
      newErrors.buildingId = 'Building selection is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Assignee is required';
    }

    if (formData.estimatedHours <= 0) {
      newErrors.estimatedHours = 'Estimated hours must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const taskData: Omit<BuildoutTask, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData,
        buildingId: formData.buildingId,
        dueDate: formData.dueDate,
        estimatedHours: formData.estimatedHours,
      };

      onSubmit(taskData);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      buildingId: '',
      status: 'not-started',
      stage: 'planning',
      assignedTo: '',
      dueDate: new Date(),
      priority: 'medium',
      estimatedHours: 0,
      category: 'coordination',
      notes: '',
      dependencies: [],
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'blocked': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === 'add' ? 'Add New Task' : 'Edit Task'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Task Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>

            {/* Project Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Project Details
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.buildingId}>
                <InputLabel>Building</InputLabel>
                <Select
                  value={formData.buildingId}
                  onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                  label="Building"
                  required
                >
                  {buildingState.buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name} - {building.address}
                    </MenuItem>
                  ))}
                </Select>
                {errors.buildingId && <FormHelperText>{errors.buildingId}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Buildout Stage</InputLabel>
                <Select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as BuildoutStage })}
                  label="Buildout Stage"
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="infrastructure_installation">Infrastructure Installation</MenuItem>
                  <MenuItem value="equipment_installation">Equipment Installation</MenuItem>
                  <MenuItem value="tenant_installation">Tenant Installation</MenuItem>
                  <MenuItem value="testing">Testing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  label="Category"
                >
                  <MenuItem value="survey">Survey</MenuItem>
                  <MenuItem value="permits">Permits</MenuItem>
                  <MenuItem value="equipment">Equipment</MenuItem>
                  <MenuItem value="cabling">Cabling</MenuItem>
                  <MenuItem value="wireless">Wireless</MenuItem>
                  <MenuItem value="configuration">Configuration</MenuItem>
                  <MenuItem value="installation">Installation</MenuItem>
                  <MenuItem value="testing">Testing</MenuItem>
                  <MenuItem value="coordination">Coordination</MenuItem>
                  <MenuItem value="evaluation">Evaluation</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  label="Status"
                >
                  <MenuItem value="not-started">Not Started</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Assignment & Timeline */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Assignment & Timeline
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.assignedTo}>
                <InputLabel>Assigned To</InputLabel>
                <Select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  label="Assigned To"
                  required
                >
                  {userState.users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </MenuItem>
                  ))}
                </Select>
                {errors.assignedTo && <FormHelperText>{errors.assignedTo}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Due Date"
                value={formData.dueDate.toISOString().slice(0, 10)}
                onChange={(e) => setFormData({ ...formData, dueDate: new Date(e.target.value) })}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Estimated Hours"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                error={!!errors.estimatedHours}
                helperText={errors.estimatedHours}
                InputProps={{
                  endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dependencies"
                placeholder="Enter task IDs separated by commas"
                value={formData.dependencies.join(', ')}
                onChange={(e) => {
                  const deps = e.target.value.split(',').map(d => d.trim()).filter(d => d);
                  setFormData({ ...formData, dependencies: deps });
                }}
                helperText="Enter task IDs that this task depends on"
              />
            </Grid>

            {/* Additional Notes */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Additional Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                helperText="Additional notes, context, or special instructions"
              />
            </Grid>

            {/* Current Status Display */}
            {mode === 'edit' && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="body2">Current Status:</Typography>
                  <Chip 
                    label={formData.status} 
                    color={getStatusColor(formData.status) as any}
                    size="small"
                  />
                  <Typography variant="body2">Priority:</Typography>
                  <Chip 
                    label={formData.priority} 
                    color={getPriorityColor(formData.priority) as any}
                    size="small"
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={Object.keys(errors).length > 0}
          >
            {mode === 'add' ? 'Create Task' : 'Update Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;

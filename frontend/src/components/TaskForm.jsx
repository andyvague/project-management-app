import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { tasksAPI, projectsAPI, usersAPI } from '../services/api'

/**
 * TaskForm Component
 * 
 * A comprehensive form dialog for creating and editing tasks.
 * Supports all task properties including assignees, tags, and project selection.
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onClose - Callback when dialog closes
 * @param {object} task - Task object for editing (null for new tasks)
 * @param {string} projectId - Pre-selected project ID (optional)
 * @param {function} onSuccess - Callback when task is successfully saved
 */
const TaskForm = ({ open, onClose, task = null, projectId = null, onSuccess }) => {
  // Form state - holds all task data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: projectId || '',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
    estimatedHours: '',
    assigneeIds: [],
    tags: []
  })
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Data state - for dropdowns and selections
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  
  // Predefined tags for quick selection
  const [availableTags] = useState([
    'bug', 'feature', 'enhancement', 'documentation', 'design', 'testing', 'deployment'
  ])

  /**
   * Effect: Initialize form data when dialog opens
   * - Loads projects and users for dropdowns
   * - Populates form with existing task data (for editing)
   * - Resets form for new task creation
   */
  useEffect(() => {
    if (open) {
      // Load data for dropdowns
      loadProjects()
      loadUsers()
      
      if (task) {
        // Editing existing task - populate form with current data
        setFormData({
          title: task.title || '',
          description: task.description || '',
          projectId: task.projectId || projectId || '',
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          estimatedHours: task.estimatedHours || '',
          assigneeIds: task.Users?.map(user => user.id) || [],
          tags: task.tags || []
        })
      } else {
        // Creating new task - reset form to defaults
        setFormData({
          title: '',
          description: '',
          projectId: projectId || '',
          status: 'todo',
          priority: 'medium',
          dueDate: null,
          estimatedHours: '',
          assigneeIds: [],
          tags: []
        })
      }
    }
  }, [open, task, projectId])

  /**
   * Load all projects for the project selection dropdown
   */
  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll({ limit: 100 })
      setProjects(response.data.projects || [])
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  /**
   * Load all users for the assignee selection dropdown
   */
  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll({ limit: 100 })
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  /**
   * Handle form submission - create or update task
   * - Validates required fields (title and projectId)
   * - Converts date and number fields to proper format
   * - Calls appropriate API (create or update)
   * - Handles success and error states
   */
  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError('')

      // Prepare data for API submission
      const submitData = {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null
      }

      // Create or update task based on whether we're editing
      if (task) {
        await tasksAPI.update(task.id, submitData)
      } else {
        await tasksAPI.create(submitData)
      }

      // Success - notify parent and close dialog
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving task:', error)
      setError(error.response?.data?.message || 'Failed to save task. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Generic form field change handler
   * Updates the form state when any field changes
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {task ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      <DialogContent>
        {/* Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {/* Form fields */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Task Title - Required field */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </Grid>
          
          {/* Task Description - Optional */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={3}
            />
          </Grid>

          {/* Project Selection - Required field */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={formData.projectId}
                onChange={(e) => handleChange('projectId', e.target.value)}
                label="Project"
                required
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Task Status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Task Priority */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Estimated Hours */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estimated Hours"
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => handleChange('estimatedHours', e.target.value)}
              inputProps={{ min: 0, step: 0.5 }}
            />
          </Grid>

          {/* Due Date Picker */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(date) => handleChange('dueDate', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Assignee Selection - Multi-select */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={users}
              getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
              value={users.filter(user => formData.assigneeIds.includes(user.id))}
              onChange={(event, newValue) => {
                handleChange('assigneeIds', newValue.map(user => user.id))
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assignees"
                  placeholder="Select assignees"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={`${option.firstName} ${option.lastName}`}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Grid>

          {/* Tags Selection - Multi-select with free text input */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={availableTags}
              value={formData.tags}
              onChange={(event, newValue) => handleChange('tags', newValue)}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tags"
                  placeholder="Add tags"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      {/* Dialog Actions */}
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.title.trim() || !formData.projectId}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : (task ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TaskForm 
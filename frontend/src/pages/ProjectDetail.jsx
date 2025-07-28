import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  Avatar,
  AvatarGroup,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  useTheme,
  Tooltip
} from '@mui/material'
// Import the TaskForm component for creating/editing tasks
import TaskForm from '../components/TaskForm'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Assignment as TaskIcon,
  Group as TeamIcon,
  Timeline as TimelineIcon,
  AttachMoney as BudgetIcon,
  CalendarToday as CalendarIcon,
  Flag as PriorityIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Error as ErrorIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { useParams, useNavigate } from 'react-router-dom'
import { projectsAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useTheme()
  const { user } = useAuth()
  
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Task form state management
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  
  const [editForm, setEditForm] = useState({})

  // Status colors
  const statusColors = {
    planning: '#ff9800',
    active: '#4caf50',
    'on-hold': '#f44336',
    completed: '#2196f3',
    cancelled: '#9e9e9e'
  }

  // Priority colors
  const priorityColors = {
    low: '#4caf50',
    medium: '#ff9800',
    high: '#f44336',
    urgent: '#9c27b0'
  }

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await projectsAPI.getById(id)
      setProject(response.data.project)
      setEditForm({
        name: response.data.project.name,
        description: response.data.project.description || '',
        status: response.data.project.status,
        priority: response.data.project.priority,
        startDate: response.data.project.startDate ? response.data.project.startDate.split('T')[0] : '',
        endDate: response.data.project.endDate ? response.data.project.endDate.split('T')[0] : '',
        budget: response.data.project.budget || '',
        color: response.data.project.color,
        isPublic: response.data.project.isPublic
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    try {
      const response = await projectsAPI.update(id, editForm)
      setProject(response.data.project)
      setEditDialogOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project')
    }
  }

  const handleDelete = async () => {
    try {
      await projectsAPI.delete(id)
      navigate('/projects')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project')
    }
  }

  const calculateProgress = () => {
    if (!project?.tasks?.length) return 0
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length
    return Math.round((completedTasks / project.tasks.length) * 100)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CompletedIcon />
      case 'active': return <TimelineIcon />
      case 'planning': return <PendingIcon />
      case 'on-hold': return <ErrorIcon />
      case 'cancelled': return <ErrorIcon />
      default: return <PendingIcon />
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Project not found</Alert>
      </Box>
    )
  }

  const progress = calculateProgress()
  const isOwner = user?.id === project.owner?.id

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            {project.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
            <Chip
              icon={getStatusIcon(project.status)}
              label={project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              sx={{
                backgroundColor: statusColors[project.status],
                color: 'white',
                fontWeight: 600
              }}
            />
            <Chip
              icon={<PriorityIcon />}
              label={project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
              sx={{
                backgroundColor: priorityColors[project.priority],
                color: 'white',
                fontWeight: 600
              }}
            />
            {project.isPublic && (
              <Chip label="Public" color="info" size="small" />
            )}
          </Box>
        </Box>
        
        {isOwner && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditDialogOpen(true)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Project Overview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Project Overview
            </Typography>
            
            {project.description && (
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                {project.description}
              </Typography>
            )}

            {/* Progress */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {progress}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
            </Box>

            {/* Project Details */}
            <Grid container spacing={2}>
              {project.startDate && (
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CalendarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {new Date(project.startDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {project.endDate && (
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CalendarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      End Date
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {new Date(project.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {project.budget && (
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <BudgetIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Budget
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      ${parseFloat(project.budget).toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <TaskIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Tasks
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {project.tasks?.length || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Tasks Section */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Tasks ({project.tasks?.length || 0})
              </Typography>
              {/* Add Task Button - Opens task creation form */}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setTaskFormOpen(true)}
              >
                Add Task
              </Button>
            </Box>
            
            {project.tasks?.length > 0 ? (
              <List>
                {project.tasks.slice(0, 5).map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: statusColors[task.status] }}>
                        <TaskIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {task.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                            <Chip
                              label={task.status}
                              size="small"
                              sx={{ backgroundColor: statusColors[task.status], color: 'white' }}
                            />
                            <Chip
                              label={task.priority}
                              size="small"
                              sx={{ backgroundColor: priorityColors[task.priority], color: 'white' }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <Button
                      size="small"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      View
                    </Button>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <TaskIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No tasks yet. Create the first task to get started!
                </Typography>
              </Box>
            )}
            
            {project.tasks?.length > 5 && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/projects/${id}/tasks`)}
                >
                  View All Tasks
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Project Owner */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Project Owner
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={project.owner?.avatar}
                sx={{ width: 56, height: 56 }}
              >
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {project.owner?.firstName} {project.owner?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.owner?.email}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Team Members */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Team Members
            </Typography>
            {project.tasks?.some(task => task.users?.length > 0) ? (
              <AvatarGroup max={4}>
                {project.tasks
                  .flatMap(task => task.users || [])
                  .filter((user, index, arr) => arr.findIndex(u => u.id === user.id) === index)
                  .slice(0, 8)
                  .map((user) => (
                    <Tooltip key={user.id} title={`${user.firstName} ${user.lastName}`}>
                      <Avatar src={user.avatar}>
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </Avatar>
                    </Tooltip>
                  ))}
              </AvatarGroup>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No team members assigned yet
              </Typography>
            )}
          </Paper>

          {/* Recent Activity */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Comments
            </Typography>
            {project.comments?.length > 0 ? (
              <List dense>
                {project.comments.slice(0, 3).map((comment) => (
                  <ListItem key={comment.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar src={comment.user?.avatar} sx={{ width: 32, height: 32 }}>
                        {comment.user?.firstName?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={comment.content}
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {comment.user?.firstName} {comment.user?.lastName} • {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No comments yet
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editForm.status}
                  label="Status"
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editForm.priority}
                  label="Priority"
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={editForm.startDate}
                onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={editForm.endDate}
                onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Budget"
                value={editForm.budget}
                onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="color"
                label="Color"
                value={editForm.color}
                onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{project.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Form Dialog - For creating and editing tasks */}
      <TaskForm
        open={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
        projectId={id}
        onSuccess={() => {
          fetchProject() // Refresh project data after task changes
        }}
      />
    </Box>
  )
}

export default ProjectDetail 
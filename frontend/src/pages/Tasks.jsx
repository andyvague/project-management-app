import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Fab,
  LinearProgress,
  Alert,
  CircularProgress,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  useTheme
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  MoreVert as MoreVertIcon,
  Assignment as TaskIcon,
  CalendarToday as CalendarIcon,
  Flag as PriorityIcon,
  Person as PersonIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { tasksAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useTheme as useAppTheme } from '../contexts/ThemeContext'
// Import TaskForm for creating/editing tasks
import TaskForm from '../components/TaskForm'

/**
 * Tasks Page Component
 * 
 * Comprehensive task management interface with:
 * - Grid and list view modes
 * - Advanced filtering and search
 * - Task creation and editing
 * - Real-time task data
 */
const Tasks = () => {
  // Task data state
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  
  // Task form state
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  
  // UI state
  const [refreshing, setRefreshing] = useState(false)

  const { user } = useAuth()
  const { darkMode } = useAppTheme()
  const navigate = useNavigate()
  const theme = useTheme()

  /**
   * Load tasks from API with current filters and search
   * Supports filtering by status, priority, and text search
   */
  const loadTasks = async () => {
    try {
      setError(null)
      setRefreshing(true)
      
      // Build query parameters
      const params = {
        limit: 50,
        sortBy: 'dueDate',
        sortOrder: 'asc'
      }
      
      // Add filters if not set to 'all'
      if (searchTerm) params.search = searchTerm
      if (statusFilter !== 'all') params.status = statusFilter
      if (priorityFilter !== 'all') params.priority = priorityFilter
      
      const response = await tasksAPI.getAll(params)
      setTasks(response.data.tasks || [])
    } catch (error) {
      console.error('Error loading tasks:', error)
      setError('Failed to load tasks. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [searchTerm, statusFilter, priorityFilter])

  /**
   * Open task form for creating a new task
   */
  const handleCreateTask = () => {
    setEditingTask(null)
    setTaskFormOpen(true)
  }

  /**
   * Open task form for editing an existing task
   */
  const handleEditTask = (task) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }

  /**
   * Delete a task and refresh the list
   */
  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId)
      setError(null)
      loadTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
      setError('Failed to delete task. Please try again.')
    }
  }

  /**
   * Get Material-UI color for task status
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'success'
      case 'in-progress': return 'warning'
      case 'review': return 'info'
      case 'todo': return 'default'
      default: return 'default'
    }
  }

  /**
   * Get Material-UI color for task priority
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error'
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  /**
   * Check if a task is overdue
   */
  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading tasks...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track all your tasks across projects
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters and Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Input */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          {/* Status Filter */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Priority Filter */}
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label="Priority"
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* View Mode Toggle */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <GridIcon />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ListIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* New Task Button */}
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTask}
              fullWidth
              sx={{
                background: 'linear-gradient(45deg, #10B981, #059669)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #059669, #047857)',
                }
              }}
            >
              New Task
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks Display - Grid or List View */}
      {tasks.length === 0 ? (
        // Empty State - No tasks found
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <TaskIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No tasks found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Create your first task to get started'
            }
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTask}
            sx={{
              background: 'linear-gradient(45deg, #10B981, #059669)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669, #047857)',
              }
            }}
          >
            Create Task
          </Button>
        </Paper>
      ) : viewMode === 'grid' ? (
        // Grid View - Card-based layout
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
                onClick={() => handleEditTask(task)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                      {task.title}
                    </Typography>
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  {task.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {task.description.length > 100 
                        ? `${task.description.substring(0, 100)}...` 
                        : task.description
                      }
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={task.status}
                      size="small"
                      color={getStatusColor(task.status)}
                    />
                    <Chip
                      label={task.priority}
                      size="small"
                      color={getPriorityColor(task.priority)}
                      variant="outlined"
                    />
                  </Box>

                  {task.dueDate && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography 
                        variant="caption" 
                        color={isOverdue(task.dueDate) ? 'error' : 'text.secondary'}
                      >
                        Due: {formatDate(task.dueDate)}
                      </Typography>
                    </Box>
                  )}

                  {task.Users && task.Users.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                        {task.Users.map((user) => (
                          <Avatar key={user.id} sx={{ width: 24, height: 24 }}>
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                    </Box>
                  )}

                  {task.Project && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: task.Project.color || '#1976d2'
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {task.Project.name}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // List View - Table-like layout
        <Paper>
          <List>
            {tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <ListItem 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleEditTask(task)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: task.Project?.color || '#1976d2' }}>
                      <TaskIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {task.title}
                        </Typography>
                        <Chip
                          label={task.status}
                          size="small"
                          color={getStatusColor(task.status)}
                        />
                        <Chip
                          label={task.priority}
                          size="small"
                          color={getPriorityColor(task.priority)}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        {task.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {task.description.length > 150 
                              ? `${task.description.substring(0, 150)}...` 
                              : task.description
                            }
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {task.dueDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography 
                                variant="caption" 
                                color={isOverdue(task.dueDate) ? 'error' : 'text.secondary'}
                              >
                                {formatDate(task.dueDate)}
                              </Typography>
                            </Box>
                          )}
                          {task.Project && (
                            <Typography variant="caption" color="text.secondary">
                              {task.Project.name}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < tasks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      {/* Floating Action Button - Quick task creation */}
      <Fab
        color="primary"
        aria-label="add task"
        onClick={handleCreateTask}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #10B981, #059669)',
          '&:hover': {
            background: 'linear-gradient(45deg, #059669, #047857)',
          }
        }}
      >
        <AddIcon />
      </Fab>

      {/* Task Form Dialog - For creating and editing tasks */}
      <TaskForm
        open={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
        onSuccess={() => {
          loadTasks() // Refresh task list after changes
        }}
      />
    </Box>
  )
}

export default Tasks 
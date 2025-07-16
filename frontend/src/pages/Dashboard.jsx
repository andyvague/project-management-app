import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  Add as AddIcon,
  Assignment as TaskIcon,
  Folder as ProjectIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme as useAppTheme } from '../contexts/ThemeContext'
import { projectsAPI, tasksAPI, usersAPI } from '../services/api'
import ThemeToggle from '../components/ThemeToggle'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const { user } = useAuth()
  const { darkMode } = useAppTheme()
  const navigate = useNavigate()

  const loadDashboardData = async () => {
    try {
      setError(null)
      setRefreshing(true)

      // Fetch user statistics
      const userStatsResponse = await usersAPI.getStats(user.id)
      const userStats = userStatsResponse.data

      // Fetch recent projects
      const projectsResponse = await projectsAPI.getAll({ 
        limit: 5, 
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      })
      const projects = projectsResponse.data.projects || []

      // Fetch recent tasks
      const tasksResponse = await tasksAPI.getAssigned()
      const tasks = tasksResponse.data.tasks || []

      // Calculate dashboard statistics
      const dashboardStats = {
        totalProjects: userStats.totalProjects || 0,
        activeProjects: userStats.activeProjects || 0,
        totalTasks: userStats.totalTasks || 0,
        completedTasks: userStats.completedTasks || 0,
        overdueTasks: userStats.overdueTasks || 0,
      }

      setStats(dashboardStats)
      setRecentProjects(projects)
      setRecentTasks(tasks)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadDashboardData()
    }
  }, [user?.id])

  const handleRefresh = () => {
    loadDashboardData()
  }

  const handleCreateProject = () => {
    navigate('/projects/new')
  }

  const handleCreateTask = () => {
    navigate('/tasks/new')
  }

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`)
  }

  const handleViewTask = (taskId) => {
    navigate(`/tasks/${taskId}`)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in-progress':
        return 'success'
      case 'planning':
      case 'todo':
        return 'warning'
      case 'completed':
      case 'done':
        return 'info'
      case 'on-hold':
      case 'overdue':
        return 'error'
      default:
        return 'default'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'success'
      default:
        return 'default'
    }
  }

  const getTaskStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'done':
      case 'completed':
        return 'success'
      case 'in-progress':
        return 'warning'
      case 'todo':
        return 'info'
      case 'review':
        return 'secondary'
      case 'overdue':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success'
    if (progress >= 50) return 'warning'
    return 'error'
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome back, {user?.firstName || 'User'}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your projects today
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
            size="small"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <ThemeToggle />
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.1)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(59,130,246,0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease-in-out',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Projects
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3B82F6' }}>
                    {stats.totalProjects}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#3B82F6', width: 56, height: 56 }}>
                  <ProjectIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.1)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(16,185,129,0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease-in-out',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Projects
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                    {stats.activeProjects}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#10B981', width: 56, height: 56 }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.1)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(245,158,11,0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease-in-out',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F59E0B' }}>
                    {stats.totalTasks}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#F59E0B', width: 56, height: 56 }}>
                  <TaskIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)',
              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(239,68,68,0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease-in-out',
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Overdue Tasks
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#EF4444' }}>
                    {stats.overdueTasks}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#EF4444', width: 56, height: 56 }}>
                  <WarningIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
            sx={{
              background: 'linear-gradient(45deg, #3B82F6, #1D4ED8)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563EB, #1E40AF)',
              }
            }}
          >
            New Project
          </Button>
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
            New Task
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/projects')}
            sx={{
              borderColor: '#3B82F6',
              color: '#3B82F6',
              '&:hover': {
                borderColor: '#2563EB',
                backgroundColor: 'rgba(59,130,246,0.04)',
              }
            }}
          >
            View All Projects
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/tasks')}
            sx={{
              borderColor: '#10B981',
              color: '#10B981',
              '&:hover': {
                borderColor: '#059669',
                backgroundColor: 'rgba(16,185,129,0.04)',
              }
            }}
          >
            View All Tasks
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Projects
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/projects')}
                  sx={{ color: '#3B82F6' }}
                >
                  View All
                </Button>
              </Box>
              
              {recentProjects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ProjectIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    No projects yet
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCreateProject}
                    sx={{ mt: 1 }}
                  >
                    Create your first project
                  </Button>
                </Box>
              ) : (
                <List>
                  {recentProjects.map((project, index) => (
                    <React.Fragment key={project.id}>
                      <ListItem 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                          borderRadius: 1,
                          mb: 1
                        }}
                        onClick={() => handleViewProject(project.id)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: project.color || '#3B82F6' }}>
                            <ProjectIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={project.name}
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Chip
                                  label={project.status || 'Unknown'}
                                  size="small"
                                  color={getStatusColor(project.status)}
                                />
                                {project.dueDate && (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                      {formatDate(project.dueDate)}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                              {project.progress !== undefined && (
                                <Box sx={{ width: '100%' }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Progress
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {project.progress}%
                                    </Typography>
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={project.progress}
                                    color={getProgressColor(project.progress)}
                                    sx={{ height: 6, borderRadius: 3 }}
                                  />
                                </Box>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < recentProjects.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Tasks */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Tasks
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/tasks')}
                  sx={{ color: '#10B981' }}
                >
                  View All
                </Button>
              </Box>
              
              {recentTasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TaskIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    No tasks assigned yet
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCreateTask}
                    sx={{ mt: 1 }}
                  >
                    Create your first task
                  </Button>
                </Box>
              ) : (
                <List>
                  {recentTasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                      <ListItem 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
                          borderRadius: 1,
                          mb: 1
                        }}
                        onClick={() => handleViewTask(task.id)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#10B981' }}>
                            <TaskIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={task.title}
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Chip
                                  label={task.status || 'Unknown'}
                                  size="small"
                                  color={getTaskStatusColor(task.status)}
                                />
                                <Chip
                                  label={task.priority || 'Medium'}
                                  size="small"
                                  color={getPriorityColor(task.priority)}
                                  variant="outlined"
                                />
                                {task.project && (
                                  <Typography variant="caption" color="text.secondary">
                                    {task.project.name || task.project}
                                  </Typography>
                                )}
                              </Box>
                              {task.dueDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    Due: {formatDate(task.dueDate)}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < recentTasks.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Dashboard

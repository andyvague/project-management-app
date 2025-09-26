import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Assignment as TaskIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useBuildingContext } from '../../context/BuildingContext';
import { useTaskContext } from '../../context/TaskContext';
// import { useUserContext } from '../../context/UserContext';
import { DashboardStats } from '../../types';


const Dashboard: React.FC = () => {
  const { state: buildingState } = useBuildingContext();
  const { state: taskState } = useTaskContext();
  // const { state: userState } = useUserContext();
  const [stats, setStats] = useState<DashboardStats>({
    totalBuildings: 0,
    activeBuildings: 0,
    completedBuildings: 0,
    overdueTasks: 0,
    upcomingDeadlines: 0,
    averageCompletionTime: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [buildingState.buildings, taskState.tasks]);

  const calculateStats = () => {
    const totalBuildings = buildingState.buildings.length;
    const activeBuildings = buildingState.buildings.filter(
      (b) => b.status === 'active'
    ).length;
    const completedBuildings = buildingState.buildings.filter(
      (b) => b.status === 'completed'
    ).length;

    const overdueTasks = taskState.tasks.filter(
      (t) => t.dueDate < new Date() && t.status !== 'completed'
    ).length;

    const upcomingDeadlines = taskState.tasks.filter(
      (t) => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return t.dueDate <= nextWeek && t.status !== 'completed';
      }
    ).length;

    // Calculate average completion time for completed buildings
    const completedBuildingsWithDates = buildingState.buildings.filter(
      (b) => b.status === 'completed' && b.actualCompletion
    );
    
    let averageCompletionTime = 0;
    if (completedBuildingsWithDates.length > 0) {
      const totalDays = completedBuildingsWithDates.reduce((acc, building) => {
        if (building.actualCompletion && building.buildoutStartDate) {
          const days = Math.ceil(
            (building.actualCompletion.getTime() - building.buildoutStartDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return acc + days;
        }
        return acc;
      }, 0);
      averageCompletionTime = Math.round(totalDays / completedBuildingsWithDates.length);
    }

    setStats({
      totalBuildings,
      activeBuildings,
      completedBuildings,
      overdueTasks,
      upcomingDeadlines,
      averageCompletionTime,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'planning':
        return 'info';
      case 'on-hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const recentTasks = taskState.tasks
    .filter((task) => task.status !== 'completed')
    .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())
    .slice(0, 5);

  const recentBuildings = buildingState.buildings
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);

  return (
    <Box>
                  <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Buildings</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {stats.totalBuildings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Projects</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.activeBuildings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Completed</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {stats.completedBuildings}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Overdue Tasks</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {stats.overdueTasks}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Status Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {['planning', 'active', 'completed', 'on-hold'].map((status) => {
                  const count = buildingState.buildings.filter((b) => b.status === status).length;
                  const percentage = stats.totalBuildings > 0 ? (count / stats.totalBuildings) * 100 : 0;
                  
                  return (
                    <Box key={status} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {status.replace('-', ' ')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {count} ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Deadlines
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                {stats.upcomingDeadlines}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tasks due within the next 7 days
              </Typography>
              {stats.averageCompletionTime > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Average completion time: {stats.averageCompletionTime} days
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              <List dense>
                {recentTasks.map((task) => (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      <TaskIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={`Due: ${task.dueDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`}
                    />
                    <Chip
                      label={task.priority}
                      size="small"
                      color={getPriorityColor(task.priority) as any}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Buildings
              </Typography>
              <List dense>
                {recentBuildings.map((building) => (
                  <ListItem key={building.id}>
                    <ListItemIcon>
                      <BusinessIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={building.address}
                      secondary={`Status: ${building.status}`}
                    />
                    <Chip
                      label={building.status}
                      size="small"
                      color={getStatusColor(building.status) as any}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Assignment as TaskIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { useTaskContext } from '../../context/TaskContext';
import { useBuildingContext } from '../../context/BuildingContext';
import { useUserContext } from '../../context/UserContext';
import { BuildoutTask, TaskStatus, BuildoutStage } from '../../types';

import TaskForm from '../../components/TaskForm/TaskForm';

const Tasks: React.FC = () => {
  const { state: taskState, addTask, updateTask, deleteTask } = useTaskContext();
  const { state: buildingState } = useBuildingContext();
  const { state: userState } = useUserContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<BuildoutTask | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const filteredTasks = taskState.tasks.filter((task) => {
    const assignedUserName = userState.users.find(u => u.id === task.assignedTo)?.name || '';
    const buildingName = buildingState.buildings.find(b => b.id === task.buildingId)?.name || '';
    
    const matchesSearch = searchTerm === '' || 
                         task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignedUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buildingName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesStage = stageFilter === 'all' || task.stage === stageFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesStage && matchesPriority && matchesCategory;
  });

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'in-progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'not-started':
        return 'default';
      case 'blocked':
        return 'error';
      case 'cancelled':
        return 'error';
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

  const getStageColor = (stage: BuildoutStage) => {
    switch (stage) {
      case 'planning':
        return 'info';
      case 'infrastructure_installation':
        return 'primary';
      case 'equipment_installation':
        return 'secondary';
      case 'tenant_installation':
        return 'warning';
      case 'testing':
        return 'success';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getBuildingAddress = (buildingId: string) => {
    const building = buildingState.buildings.find(b => b.id === buildingId);
    return building ? building.address : 'Unknown Building';
  };

  const isOverdue = (task: BuildoutTask) => {
    return task.dueDate < new Date() && task.status !== 'completed';
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm || searchTerm.trim() === '') return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <Box key={index} component="span" sx={{ backgroundColor: 'warning.light', color: 'warning.contrastText', px: 0.5, borderRadius: 0.5 }}>
          {part}
        </Box>
      ) : part
    );
  };

  const handleAddTask = (taskData: Omit<BuildoutTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
    setOpenDialog(false);
  };

  const handleEditTask = (taskData: Omit<BuildoutTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTask) {
      // Update the existing task
      updateTask(editingTask.id, taskData);
      setEditDialogOpen(false);
      setEditingTask(null);
    }
  };

  const openEditDialog = (task: BuildoutTask) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Buildout Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Task
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search tasks, descriptions, assignees, buildings..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearching(true);
                  // Clear the searching state after a brief delay
                  setTimeout(() => setIsSearching(false), 300);
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: isSearching ? 'primary.main' : 'text.secondary' }} />,
                }}
                helperText={
                  isSearching 
                    ? "Searching..." 
                    : "Search by task title, description, assignee name, or building name"
                }
                sx={{
                  '& .MuiInputBase-root': {
                    transition: 'all 0.2s ease-in-out',
                    ...(isSearching && {
                      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                    }),
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="not-started">Not Started</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="blocked">Blocked</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Stage</InputLabel>
                <Select
                  value={stageFilter}
                  label="Stage"
                  onChange={(e) => setStageFilter(e.target.value)}
                >
                  <MenuItem value="all">All Stages</MenuItem>
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="infrastructure_installation">Infrastructure Installation</MenuItem>
                  <MenuItem value="equipment_installation">Equipment Installation</MenuItem>
                  <MenuItem value="tenant_installation">Tenant Installation</MenuItem>
                  <MenuItem value="testing">Testing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>

                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
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
            <Grid item xs={12} md={1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    transition: 'all 0.3s ease-in-out',
                    ...(isSearching && {
                      color: 'primary.main',
                      fontWeight: 'bold',
                    }),
                  }}
                >
                  {filteredTasks.length} of {taskState.tasks.length} tasks
                </Typography>
                {(searchTerm !== '' || statusFilter !== 'all' || stageFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
                  <Chip 
                    label="Filters Active" 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                )}
                {isSearching && (
                  <Chip 
                    label="Live Search" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                    sx={{ mt: 0.5, animation: 'pulse 1.5s infinite' }}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setStageFilter('all');
                  setPriorityFilter('all');
                  setCategoryFilter('all');
                }}
                disabled={searchTerm === '' && statusFilter === 'all' && stageFilter === 'all' && priorityFilter === 'all' && categoryFilter === 'all'}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardContent>
          <List>
            {filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon>
                  <TaskIcon color="primary" />
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {highlightSearchTerm(task.title, searchTerm)}
                      </Typography>
                      {isOverdue(task) && (
                        <Chip
                          label="OVERDUE"
                          size="small"
                          color="error"
                          icon={<FlagIcon />}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {highlightSearchTerm(task.description, searchTerm)}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        <Chip
                          label={task.stage}
                          size="small"
                          color={getStageColor(task.stage) as any}
                        />
                        <Chip
                          label={task.status}
                          size="small"
                          color={getStatusColor(task.status) as any}
                        />
                        <Chip
                          label={task.priority}
                          size="small"
                          color={getPriorityColor(task.priority) as any}
                        />
                        <Chip
                          label={getBuildingAddress(task.buildingId)}
                          size="small"
                          variant="outlined"
                          icon={<BusinessIcon />}
                        />
                      </Box>
                    </Box>
                  }
                />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openEditDialog(task)}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          deleteTask(task.id);
                        }
                      }}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      Delete
                    </Button>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    <PersonIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                    {userState.users.find(u => u.id === task.assignedTo)?.name || 'Unassigned'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <ScheduleIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                    Due: {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Est: {task.estimatedHours}h
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
          
          {filteredTasks.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <TaskIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? `No tasks found for "${searchTerm}"` : 'No tasks found'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {searchTerm || statusFilter !== 'all' || stageFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first task'
                }
              </Typography>
              {searchTerm && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Search suggestions:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Chip 
                      label="Clear search" 
                      size="small" 
                      variant="outlined" 
                      onClick={() => setSearchTerm('')}
                      sx={{ cursor: 'pointer' }}
                    />
                    <Chip 
                      label="Check spelling" 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label="Try different terms" 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Task Form */}
      <TaskForm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleAddTask}
        mode="add"
      />

      {/* Edit Task Form */}
      <TaskForm
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleEditTask}
        initialData={editingTask || undefined}
        mode="edit"
      />
    </Box>
  );
};

export default Tasks;

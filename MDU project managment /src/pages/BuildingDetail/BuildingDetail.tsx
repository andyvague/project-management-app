import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Grid, Chip,
  List, ListItem, ListItemText, ListItemIcon, LinearProgress,
  Tabs, Tab, Paper, IconButton
} from '@mui/material';
import {
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Assignment as TaskIcon,
  Description as DocumentIcon,
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  FiberManualRecord as StatusIcon,
  TrendingUp as RevenueIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useBuildingContext } from '../../context/BuildingContext';
import { useTaskContext } from '../../context/TaskContext';
import { useDocumentContext } from '../../context/DocumentContext';
import { useScheduleContext } from '../../context/ScheduleContext';
import { useUserContext } from '../../context/UserContext';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`building-tabpanel-${index}`}
      aria-labelledby={`building-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const BuildingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  const { state: buildingState } = useBuildingContext();
  const { state: taskState } = useTaskContext();
  const { state: documentState } = useDocumentContext();
  const { state: scheduleState } = useScheduleContext();
  const { state: userState } = useUserContext();

  const building = buildingState.buildings.find(b => b.id === id);
  
  // Get related data
  const buildingTasks = taskState.tasks.filter(task => task.buildingId === id);
  const buildingDocuments = documentState.documents.filter(doc => doc.buildingId === id);
  const buildingSchedules = scheduleState.schedules.filter(schedule => schedule.buildingId === id);

  useEffect(() => {
    if (!building) {
      navigate('/buildings');
    }
  }, [building, navigate]);

  if (!building) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">
          Building not found
        </Typography>
        <Button onClick={() => navigate('/buildings')} sx={{ mt: 2 }}>
          Back to Buildings
        </Button>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'planning': return 'info';
      case 'on-hold': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <StatusIcon color="primary" />;
      case 'completed': return <CheckIcon color="success" />;
      case 'planning': return <StatusIcon color="info" />;
      case 'on-hold': return <WarningIcon color="warning" />;
      case 'cancelled': return <ErrorIcon color="error" />;
      default: return <StatusIcon />;
    }
  };

  const getProgressPercentage = () => {
    if (buildingTasks.length === 0) return 0;
    const completedTasks = buildingTasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / buildingTasks.length) * 100);
  };

  const getRevenueStatus = () => {
    if (building.actualRevenue > 0) {
      const percentage = Math.round((building.actualRevenue / building.estimatedRevenue) * 100);
      return { percentage, color: percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error' };
    }
    return { percentage: 0, color: 'default' };
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/buildings')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {building.name}
        </Typography>
        <Chip
          icon={getStatusIcon(building.status)}
          label={building.status.replace('-', ' ').toUpperCase()}
          color={getStatusColor(building.status) as any}
          variant="outlined"
        />
      </Box>

      {/* Building Overview Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Building Information</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <LocationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {building.address}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <BusinessIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {building.buildingType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {building.totalUnits} units
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {building.propertyManager}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {building.propertyManagerContact}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {building.propertyManagerEmail}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
                             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                 <RevenueIcon sx={{ mr: 1, color: 'primary.main' }} />
                 <Typography variant="h6">Progress & Revenue</Typography>
               </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Buildout Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={getProgressPercentage()} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {getProgressPercentage()}% Complete ({buildingTasks.filter(t => t.status === 'completed').length} of {buildingTasks.length} tasks)
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Revenue Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" color="primary.main">
                    ${building.actualRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    of ${building.estimatedRevenue.toLocaleString()}
                  </Typography>
                </Box>
                {building.actualRevenue > 0 && (
                  <Chip
                    label={`${getRevenueStatus().percentage}% of target`}
                    color={getRevenueStatus().color as any}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  Started: {building.buildoutStartDate.toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <TimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  Estimated: {building.estimatedCompletion.toLocaleDateString()}
                </Typography>
                {building.actualCompletion && (
                  <Typography variant="body2" color="success.main" gutterBottom>
                    <CheckIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    Completed: {building.actualCompletion.toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs for Related Data */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="building data tabs">
          <Tab label={`Tasks (${buildingTasks.length})`} />
          <Tab label={`Documents (${buildingDocuments.length})`} />
          <Tab label={`Schedule (${buildingSchedules.length})`} />
        </Tabs>

        {/* Tasks Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box>
            <Typography variant="h6" gutterBottom>Buildout Tasks</Typography>
            {buildingTasks.length === 0 ? (
              <Typography color="text.secondary">No tasks found for this building.</Typography>
            ) : (
              <List>
                {buildingTasks.map((task) => (
                  <ListItem key={task.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <TaskIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {task.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            <Chip label={task.status} size="small" color={task.status === 'completed' ? 'success' : 'default'} />
                            <Chip label={task.stage} size="small" variant="outlined" />
                            <Chip label={task.priority} size="small" variant="outlined" />
                            <Chip label={task.category} size="small" variant="outlined" />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Due: {task.dueDate.toLocaleDateString()} • 
                            Assigned: {userState.users.find(u => u.id === task.assignedTo)?.name || 'Unassigned'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </TabPanel>

        {/* Documents Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Typography variant="h6" gutterBottom>Project Documents</Typography>
            {buildingDocuments.length === 0 ? (
              <Typography color="text.secondary">No documents found for this building.</Typography>
            ) : (
              <List>
                {buildingDocuments.map((doc) => (
                  <ListItem key={doc.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <DocumentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={doc.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {doc.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            <Chip label={doc.type} size="small" variant="outlined" />
                            <Chip label={doc.fileSize} size="small" variant="outlined" />
                            {doc.isPublic && <Chip label="Public" size="small" color="success" />}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Uploaded by: {userState.users.find(u => u.id === doc.uploadedBy)?.name || 'Unknown'} • 
                            {doc.createdAt.toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </TabPanel>

        {/* Schedule Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            <Typography variant="h6" gutterBottom>Project Schedule</Typography>
            {buildingSchedules.length === 0 ? (
              <Typography color="text.secondary">No scheduled events found for this building.</Typography>
            ) : (
              <List>
                {buildingSchedules.map((schedule) => (
                  <ListItem key={schedule.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={schedule.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {schedule.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            <Chip label={schedule.type} size="small" variant="outlined" />
                            <Chip label={schedule.status} size="small" color={schedule.status === 'completed' ? 'success' : 'default'} />
                            <Chip label={schedule.priority} size="small" variant="outlined" />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {schedule.startTime.toLocaleDateString()} - {schedule.endTime.toLocaleDateString()} • 
                            Location: {schedule.location} • 
                            Assigned: {userState.users.find(u => u.id === schedule.assignedTo)?.name || 'Unassigned'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default BuildingDetail;

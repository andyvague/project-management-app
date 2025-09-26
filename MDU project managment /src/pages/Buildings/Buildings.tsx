import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useBuildingContext } from '../../context/BuildingContext';
import { Building, BuildingStatus } from '../../types';

import BuildingForm from '../../components/BuildingForm/BuildingForm';

const Buildings: React.FC = () => {
  const navigate = useNavigate();
  const { state, addBuilding, updateBuilding, deleteBuilding } = useBuildingContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  // const [showFilters, setShowFilters] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortBy, setSortBy] = useState<'address' | 'status' | 'updatedAt'>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isSearching, setIsSearching] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buildingBeingEdited, setBuildingBeingEdited] = useState<Building | null>(null);
  const [buildingToDelete, setBuildingToDelete] = useState<Building | null>(null);

  const filteredBuildings = state.buildings
    .filter((building) => {
      const matchesSearch = searchTerm === '' || 
                           building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           building.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           building.propertyManager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           building.buildingType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || building.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'updatedAt') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      } else {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusColor = (status: BuildingStatus) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'planning':
        return 'info';
      case 'on-hold':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleAddBuilding = async (buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addBuilding(buildingData);
      setOpenDialog(false);
    } catch (error) {
      // Error is handled by context
      console.error('Failed to add building:', error);
    }
  };

  const handleEditClick = (building: Building) => {
    setBuildingBeingEdited(building);
    setEditDialogOpen(true);
  };

  const handleUpdateBuilding = async (updated: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!buildingBeingEdited) return;
    try {
      await updateBuilding(buildingBeingEdited.id, updated as Partial<Building>);
      setEditDialogOpen(false);
      setBuildingBeingEdited(null);
    } catch (error) {
      // Error is handled by context
      console.error('Failed to update building:', error);
    }
  };

  const handleDeleteClick = (building: Building) => {
    setBuildingToDelete(building);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (buildingToDelete) {
      try {
        await deleteBuilding(buildingToDelete.id);
        setDeleteDialogOpen(false);
        setBuildingToDelete(null);
      } catch (error) {
        // Error is handled by context
        console.error('Failed to delete building:', error);
      }
    }
  };

  const getProgressPercentage = (building: Building) => {
    // This would be calculated based on completed tasks
    // For now, return a placeholder value
    switch (building.status) {
      case 'planning':
        return 25;
      case 'active':
        return 60;
      case 'completed':
        return 100;
      case 'on-hold':
        return 40;
      default:
        return 0;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Buildings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Building
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search buildings, addresses, property managers..."
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
                    : "Search by building name, address, property manager, or building type"
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses ({state.buildings.length})</MenuItem>
                  <MenuItem value="planning">Planning ({state.buildings.filter(b => b.status === 'planning').length})</MenuItem>
                  <MenuItem value="active">Active ({state.buildings.filter(b => b.status === 'active').length})</MenuItem>
                  <MenuItem value="completed">Completed ({state.buildings.filter(b => b.status === 'completed').length})</MenuItem>
                  <MenuItem value="on-hold">On Hold ({state.buildings.filter(b => b.status === 'on-hold').length})</MenuItem>
                  <MenuItem value="cancelled">Cancelled ({state.buildings.filter(b => b.status === 'cancelled').length})</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                  <MenuItem value="updatedAt">Last Updated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                disabled={searchTerm === '' && statusFilter === 'all'}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Count */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          Showing {filteredBuildings.length} of {state.buildings.length} buildings
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {(searchTerm !== '' || statusFilter !== 'all') && (
            <Chip 
              label="Filters Active" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
          {isSearching && (
            <Chip 
              label="Live Search" 
              size="small" 
              color="success" 
              variant="outlined"
              sx={{ animation: 'pulse 1.5s infinite' }}
            />
          )}
        </Box>
      </Box>

      {/* Status Summary */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          label={`All (${state.buildings.length})`}
          color={statusFilter === 'all' ? 'primary' : 'default'}
          variant={statusFilter === 'all' ? 'filled' : 'outlined'}
          onClick={() => setStatusFilter('all')}
          sx={{ cursor: 'pointer' }}
        />
        <Chip 
          label={`Planning (${state.buildings.filter(b => b.status === 'planning').length})`}
          color={statusFilter === 'planning' ? 'info' : 'default'}
          variant={statusFilter === 'planning' ? 'filled' : 'outlined'}
          onClick={() => setStatusFilter('planning')}
          sx={{ cursor: 'pointer' }}
        />
        <Chip 
          label={`Active (${state.buildings.filter(b => b.status === 'active').length})`}
          color={statusFilter === 'active' ? 'primary' : 'default'}
          variant={statusFilter === 'active' ? 'filled' : 'outlined'}
          onClick={() => setStatusFilter('active')}
          sx={{ cursor: 'pointer' }}
        />
        <Chip 
          label={`Completed (${state.buildings.filter(b => b.status === 'completed').length})`}
          color={statusFilter === 'completed' ? 'success' : 'default'}
          variant={statusFilter === 'completed' ? 'filled' : 'outlined'}
          onClick={() => setStatusFilter('completed')}
          sx={{ cursor: 'pointer' }}
        />
        <Chip 
          label={`On Hold (${state.buildings.filter(b => b.status === 'on-hold').length})`}
          color={statusFilter === 'on-hold' ? 'warning' : 'default'}
          variant={statusFilter === 'on-hold' ? 'filled' : 'outlined'}
          onClick={() => setStatusFilter('on-hold')}
          sx={{ cursor: 'pointer' }}
        />
        <Chip 
          label={`Cancelled (${state.buildings.filter(b => b.status === 'cancelled').length})`}
          color={statusFilter === 'cancelled' ? 'error' : 'default'}
          variant={statusFilter === 'cancelled' ? 'filled' : 'outlined'}
          onClick={() => setStatusFilter('cancelled')}
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      {/* Buildings Grid */}
      <Grid container spacing={3}>
        {filteredBuildings.map((building) => (
          <Grid item xs={12} md={6} lg={4} key={building.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                  '& .building-card-overlay': {
                    opacity: 1,
                  }
                }
              }}
              onClick={() => {
                // Navigate to building detail page
                navigate(`/buildings/${building.id}`);
              }}
            >
              {/* Hover overlay indicator */}
              <Box
                className="building-card-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease-in-out',
                  borderRadius: 1,
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
                  <Chip
                    label={building.status}
                    color={getStatusColor(building.status) as any}
                    size="small"
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {searchTerm && building.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                    <Box component="span">
                      {building.name.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part, index) => 
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <Box key={index} component="span" sx={{ backgroundColor: 'warning.light', color: 'warning.contrastText', px: 0.5, borderRadius: 0.5 }}>
                            {part}
                          </Box>
                        ) : part
                      )}
                    </Box>
                  ) : building.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <LocationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  {searchTerm && building.address.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                    <Box component="span">
                      {building.address.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part, index) => 
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <Box key={index} component="span" sx={{ backgroundColor: 'warning.light', color: 'warning.contrastText', px: 0.5, borderRadius: 0.5 }}>
                            {part}
                          </Box>
                        ) : part
                      )}
                    </Box>
                  ) : building.address}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  {building.propertyManager}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <BusinessIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  {building.buildingType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {building.totalUnits} units
                </Typography>
                
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getProgressPercentage(building)}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 8,
                      backgroundColor: 'grey.200',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${getProgressPercentage(building)}%`,
                        height: '100%',
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontStyle: 'italic' }}>
                      Click card to view full details
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      <CalendarIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                      Updated {building.updatedAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                    </Typography>
                  </Box>
                  
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/buildings/${building.id}`);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(building);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(building);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredBuildings.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No buildings found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first building'
            }
          </Typography>
        </Box>
      )}

      {/* Add Building Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Building</DialogTitle>
        <DialogContent>
          <BuildingForm onSubmit={handleAddBuilding} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Building Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Building</DialogTitle>
        <DialogContent>
          {buildingBeingEdited && (
            <BuildingForm
              building={buildingBeingEdited}
              onSubmit={handleUpdateBuilding}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Building</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete
            {buildingToDelete ? ` "${buildingToDelete.name}"` : ''}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Buildings;

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Description as DocumentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BuildingIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  GetApp as DownloadFileIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { useDocumentContext } from '../../context/DocumentContext';
import { useBuildingContext } from '../../context/BuildingContext';
import { Document, DocumentType } from '../../types';
import DocumentForm from '../../components/DocumentForm/DocumentForm';
import FilePreview from '../../components/FilePreview/FilePreview';
import DocumentThumbnail from '../../components/DocumentThumbnail/DocumentThumbnail';
import { documentsApi } from '../../services/api';

const Documents: React.FC = () => {
  const { state, addDocument, updateDocument, deleteDocument } = useDocumentContext();
  const { state: buildingState } = useBuildingContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'type' | 'createdAt' | 'buildingId'>('createdAt');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [documentBeingEdited, setDocumentBeingEdited] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [documentToPreview, setDocumentToPreview] = useState<Document | null>(null);

  const filteredDocuments = state.documents
    .filter((document) => {
      const matchesSearch = searchTerm === '' || 
                           document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           document.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || document.type === typeFilter;
      const matchesBuilding = buildingFilter === 'all' || document.buildingId === buildingFilter;
      return matchesSearch && matchesType && matchesBuilding;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      } else if (sortBy === 'buildingId') {
        const buildingA = buildingState.buildings.find(b => b.id === a.buildingId);
        const buildingB = buildingState.buildings.find(building => building.id === b.buildingId);
        aValue = buildingA?.name || '';
        bValue = buildingB?.name || '';
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

  const getTypeColor = (type: DocumentType) => {
    switch (type) {
      case 'survey_report':
        return 'info';
      case 'permit':
        return 'warning';
      case 'technical_drawing':
        return 'primary';
      case 'approval':
        return 'success';
      case 'schedule':
        return 'secondary';
      case 'financial':
        return 'error';
      case 'other':
        return 'default';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: DocumentType) => {
    switch (type) {
      case 'survey_report':
        return '📋';
      case 'permit':
        return '📄';
      case 'technical_drawing':
        return '📐';
      case 'approval':
        return '✅';
      case 'schedule':
        return '📅';
      case 'financial':
        return '💰';
      case 'other':
        return '📁';
      default:
        return '📄';
    }
  };

  const getBuildingName = (buildingId: string) => {
    const building = buildingState.buildings.find(b => b.id === buildingId);
    return building?.name || 'Unknown Building';
  };

  const handleAddDocument = async (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, file?: File) => {
    try {
      await addDocument(documentData, file);
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to add document:', error);
    }
  };

  const handleEditClick = (document: Document) => {
    setDocumentBeingEdited(document);
    setEditDialogOpen(true);
  };

  const handleUpdateDocument = (updated: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!documentBeingEdited) return;
    updateDocument(documentBeingEdited.id, updated as Partial<Document>);
    setEditDialogOpen(false);
    setDocumentBeingEdited(null);
  };

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDownload = async (doc: Document) => {
    try {
      const blob = await documentsApi.download(doc.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = doc.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  const handlePreview = (doc: Document) => {
    setDocumentToPreview(doc);
    setPreviewDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete.id);
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Documents</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Document
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search documents, descriptions, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="survey_report">Survey Report</MenuItem>
                  <MenuItem value="permit">Permit</MenuItem>
                  <MenuItem value="technical_drawing">Technical Drawing</MenuItem>
                  <MenuItem value="approval">Approval</MenuItem>
                  <MenuItem value="schedule">Schedule</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Building</InputLabel>
                <Select
                  value={buildingFilter}
                  label="Building"
                  onChange={(e) => setBuildingFilter(e.target.value)}
                >
                  <MenuItem value="all">All Buildings</MenuItem>
                  {buildingState.buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="type">Type</MenuItem>
                  <MenuItem value="buildingId">Building</MenuItem>
                  <MenuItem value="createdAt">Date</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Count */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredDocuments.length} of {state.documents.length} documents
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {(searchTerm !== '' || typeFilter !== 'all' || buildingFilter !== 'all') && (
            <Chip 
              label="Filters Active" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Documents Grid */}
      <Grid container spacing={3}>
        {filteredDocuments.map((document) => (
          <Grid item xs={12} md={6} lg={4} key={document.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease-in-out',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {/* Thumbnail Preview */}
                  <Box sx={{ flexShrink: 0 }}>
                    <DocumentThumbnail 
                      document={document} 
                      size="medium"
                      onClick={() => handlePreview(document)}
                    />
                  </Box>
                  
                  {/* Document Info */}
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="span">
                          {getTypeIcon(document.type)}
                        </Typography>
                        <Chip
                          label={document.type.replace('_', ' ')}
                          color={getTypeColor(document.type) as any}
                          size="small"
                        />
                      </Box>
                    </Box>
                    
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {document.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                      {document.description}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BuildingIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {getBuildingName(document.buildingId)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {document.uploadedBy}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {document.createdAt.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {document.tags.slice(0, 3).map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                  {document.tags.length > 3 && (
                    <Chip label={`+${document.tags.length - 3}`} size="small" variant="outlined" />
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {document.fileSize}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Preview">
                      <IconButton size="small" onClick={() => handlePreview(document)}>
                        <PreviewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton size="small" onClick={() => handleDownload(document)}>
                        <DownloadFileIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditClick(document)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(document)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredDocuments.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <DocumentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No documents found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || typeFilter !== 'all' || buildingFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first document'
            }
          </Typography>
        </Box>
      )}

      {/* Add Document Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <DocumentForm onSubmit={handleAddDocument} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Document</DialogTitle>
        <DialogContent>
          {documentBeingEdited && (
            <DocumentForm
              document={documentBeingEdited}
              onSubmit={handleUpdateDocument}
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
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete
            {documentToDelete ? ` "${documentToDelete.title}"` : ''}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          {documentToPreview?.title}
          <Button 
            onClick={() => setPreviewDialogOpen(false)} 
            sx={{ float: 'right' }}
            size="small"
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '100%' }}>
          {documentToPreview && (
            <FilePreview document={documentToPreview} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Documents;

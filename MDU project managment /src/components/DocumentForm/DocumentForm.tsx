import React, { useState } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import { Document, DocumentType } from '../../types';
import { useBuildingContext } from '../../context/BuildingContext';

interface DocumentFormProps {
  document?: Partial<Document>;
  onSubmit: (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>, file?: File) => void;
  onCancel?: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ document, onSubmit, onCancel }) => {
  const { state: buildingState } = useBuildingContext();
  const [formData, setFormData] = useState({
    buildingId: document?.buildingId || '',
    title: document?.title || '',
    type: (document?.type as DocumentType) || 'other',
    fileUrl: document?.fileUrl || '',
    uploadedBy: document?.uploadedBy || '',
    description: document?.description || '',
    tags: document?.tags || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.buildingId.trim()) {
      newErrors.buildingId = 'Building is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!selectedFile && !document) {
      newErrors.file = 'File is required for new documents';
    }
    if (!formData.uploadedBy.trim()) {
      newErrors.uploadedBy = 'Uploaded by is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        buildingId: formData.buildingId,
        title: formData.title.trim(),
        type: formData.type,
        fileUrl: formData.fileUrl.trim(),
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : '',
        uploadedBy: formData.uploadedBy.trim(),
        description: formData.description.trim(),
        tags: formData.tags,
        isPublic: false, // Default to private
      }, selectedFile || undefined);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (60MB limit)
      if (file.size > 60 * 1024 * 1024) {
        setFileError('File size must be less than 60MB');
        setSelectedFile(null);
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'application/zip',
        'application/x-zip-compressed'
      ];

      if (!allowedTypes.includes(file.type)) {
        setFileError('File type not supported. Allowed: PDF, images, Word, Excel, text files, ZIP');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setFileError('');
    }
  };

  const documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'survey_report', label: 'Survey Report' },
    { value: 'permit', label: 'Permit' },
    { value: 'technical_drawing', label: 'Technical Drawing' },
    { value: 'approval', label: 'Approval' },
    { value: 'schedule', label: 'Schedule' },
    { value: 'financial', label: 'Financial' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.buildingId}>
            <InputLabel>Building</InputLabel>
            <Select
              value={formData.buildingId}
              label="Building"
              onChange={(e) => handleChange('buildingId', e.target.value)}
              required
            >
              {buildingState.buildings.map((building) => (
                <MenuItem key={building.id} value={building.id}>
                  {building.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => handleChange('type', e.target.value)}
            >
              {documentTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {document ? 'Current File' : 'Upload File'} *
            </Typography>
            {!document && (
              <Box sx={{ mb: 2 }}>
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.xls,.xlsx,.txt,.zip"
                />
                <label htmlFor="file-upload">
                  <Button variant="outlined" component="span" fullWidth>
                    Choose File
                  </Button>
                </label>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </Typography>
                )}
                {fileError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {fileError}
                  </Alert>
                )}
                {errors.file && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.file}
                  </Alert>
                )}
              </Box>
            )}
            {document && (
              <TextField
                fullWidth
                label="File URL"
                value={formData.fileUrl}
                onChange={(e) => handleChange('fileUrl', e.target.value)}
                helperText="Current file path (read-only for existing documents)"
                InputProps={{ readOnly: true }}
              />
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Uploaded By"
            value={formData.uploadedBy}
            onChange={(e) => handleChange('uploadedBy', e.target.value)}
            error={!!errors.uploadedBy}
            helperText={errors.uploadedBy}
            required
          />
        </Grid>


        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {formData.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                size="small"
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={handleAddTag}
              disabled={!newTag.trim() || formData.tags.includes(newTag.trim())}
            >
              Add
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          {document ? 'Update Document' : 'Add Document'}
        </Button>
      </Box>
    </Box>
  );
};

export default DocumentForm;

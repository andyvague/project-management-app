import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { Document } from '../../types';
import { documentsApi } from '../../services/api';

interface FilePreviewProps {
  document: Document;
}

const FilePreview: React.FC<FilePreviewProps> = ({ document: doc }) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadPreview = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get the view URL for the document
        const viewUrl = await documentsApi.view(doc.id);
        setPreviewUrl(viewUrl);
      } catch (err) {
        console.error('Failed to load preview:', err);
        setError('Failed to load file preview');
      } finally {
        setLoading(false);
      }
    };

    loadPreview();
  }, [doc.id]);

  const getFileExtension = (filename: string): string => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const isImageFile = (filename: string): boolean => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    return imageExtensions.includes(getFileExtension(filename));
  };

  const isPdfFile = (filename: string): boolean => {
    return getFileExtension(filename) === 'pdf';
  };

  const isTextFile = (filename: string): boolean => {
    const textExtensions = ['txt', 'md', 'json', 'xml', 'csv'];
    return textExtensions.includes(getFileExtension(filename));
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%',
          minHeight: '400px'
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading preview...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.open(previewUrl, '_blank')}
          disabled={!previewUrl}
        >
          Open in New Tab
        </Button>
      </Box>
    );
  }

  // Get filename from fileUrl or fallback to title
  const getFilename = () => {
    if (doc.fileUrl) {
      const urlParts = doc.fileUrl.split('/');
      return urlParts[urlParts.length - 1] || doc.title || 'document';
    }
    return doc.title || 'document';
  };
  
  const filename = getFilename();
  const fileExtension = getFileExtension(filename);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* File Info */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" color="text.secondary">
          File: {filename} • Size: {doc.fileSize} • Type: {doc.type}
        </Typography>
      </Box>

      {/* Preview Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {isImageFile(filename) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <img
              src={previewUrl}
              alt={doc.title}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              onError={() => setError('Failed to load image preview')}
            />
          </Box>
        ) : isPdfFile(filename) ? (
          <Box sx={{ height: '100%' }}>
            <iframe
              src={previewUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title={doc.title}
              onError={() => setError('Failed to load PDF preview')}
            />
          </Box>
        ) : isTextFile(filename) ? (
          <Box sx={{ height: '100%' }}>
            <iframe
              src={previewUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title={doc.title}
              onError={() => setError('Failed to load text preview')}
            />
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            textAlign: 'center',
            p: 3
          }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Preview not available for this file type
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              File extension: .{fileExtension}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.open(previewUrl, '_blank')}
            >
              Open in New Tab
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => {
                const link = document.createElement('a');
                link.href = previewUrl;
                link.download = doc.title;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              sx={{ mt: 1 }}
            >
              Download File
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FilePreview;

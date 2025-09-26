import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as TextIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { Document } from '../../types';
import { documentsApi } from '../../services/api';

interface DocumentThumbnailProps {
  document: Document;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const DocumentThumbnail: React.FC<DocumentThumbnailProps> = ({ 
  document, 
  size = 'medium',
  onClick 
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const sizeMap = {
    small: { width: 60, height: 60 },
    medium: { width: 120, height: 120 },
    large: { width: 200, height: 200 },
  };

  const { width, height } = sizeMap[size];

  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Get the view URL for the document
        const viewUrl = await documentsApi.view(document.id);
        setPreviewUrl(viewUrl);
      } catch (err) {
        console.error('Failed to load thumbnail:', err);
        setError('Failed to load thumbnail');
      } finally {
        setLoading(false);
      }
    };

    loadThumbnail();
  }, [document.id]);

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

  const getFileIcon = (filename: string) => {
    if (isPdfFile(filename)) return <PdfIcon sx={{ fontSize: width * 0.4 }} />;
    if (isImageFile(filename)) return <ImageIcon sx={{ fontSize: width * 0.4 }} />;
    if (isTextFile(filename)) return <TextIcon sx={{ fontSize: width * 0.4 }} />;
    return <FileIcon sx={{ fontSize: width * 0.4 }} />;
  };

  // Get filename from fileUrl or fallback to title
  const getFilename = () => {
    if (document.fileUrl) {
      const urlParts = document.fileUrl.split('/');
      return urlParts[urlParts.length - 1] || document.title || 'document';
    }
    return document.title || 'document';
  };
  
  const filename = getFilename();


  if (loading) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'grey.100',
          borderRadius: 1,
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
      >
        <CircularProgress size={width * 0.3} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'grey.100',
          borderRadius: 1,
          cursor: onClick ? 'pointer' : 'default',
          p: 1,
        }}
        onClick={onClick}
      >
        {getFileIcon(filename)}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, textAlign: 'center' }}>
          {getFileExtension(filename).toUpperCase()}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width,
        height,
        borderRadius: 1,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': onClick ? {
          borderColor: 'primary.main',
          boxShadow: 1,
        } : {},
      }}
      onClick={onClick}
    >
      {isImageFile(filename) && previewUrl ? (
        <img
          src={previewUrl}
          alt={document.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={() => setError('Failed to load image')}
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'grey.50',
            p: 1,
          }}
        >
          {getFileIcon(filename)}
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              mt: 0.5, 
              textAlign: 'center',
              fontSize: width < 100 ? '0.6rem' : '0.75rem',
            }}
          >
            {getFileExtension(filename).toUpperCase()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DocumentThumbnail;

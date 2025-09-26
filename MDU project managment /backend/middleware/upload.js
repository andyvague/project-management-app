const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create building-specific folder if buildingId is provided
    const buildingId = req.body.buildingId;
    let uploadPath = uploadsDir;
    
    if (buildingId) {
      const buildingDir = path.join(uploadsDir, buildingId);
      if (!fs.existsSync(buildingDir)) {
        fs.mkdirSync(buildingDir, { recursive: true });
      }
      uploadPath = buildingDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;
    cb(null, filename);
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
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
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: PDF, images, Word, Excel, text files, and ZIP archives.`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 60 * 1024 * 1024, // 60MB limit
    files: 1 // Only one file at a time
  },
  fileFilter: fileFilter
});

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 60MB.' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Too many files. Only one file allowed at a time.' 
      });
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({ 
      error: error.message 
    });
  }
  
  next(error);
};

module.exports = {
  upload,
  handleUploadError
};

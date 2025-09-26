const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const db = require('../database/db');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Helper function to convert database row to Document object
function rowToDocument(row) {
  return {
    id: row.id,
    buildingId: row.building_id,
    title: row.title,
    type: row.type,
    fileUrl: row.file_url,
    fileSize: row.file_size,
    uploadedBy: row.uploaded_by,
    description: row.description,
    tags: JSON.parse(row.tags || '[]'),
    isPublic: Boolean(row.is_public),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

// GET /api/documents - Get all documents
router.get('/', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM documents ORDER BY updated_at DESC');
    const documents = rows.map(rowToDocument);
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// GET /api/documents/:id - Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const row = await db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const document = rowToDocument(row);
    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// POST /api/documents - Create new document with file upload
router.post('/', upload.single('file'), handleUploadError, async (req, res) => {
  try {
    const {
      buildingId,
      title,
      type,
      uploadedBy,
      description,
      tags,
      isPublic
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();
    const filePath = req.file.path;
    const fileSize = req.file.size;
    const originalName = req.file.originalname;

    // Parse tags if provided as string
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }

    await db.run(`
      INSERT INTO documents (
        id, building_id, title, type, file_url, file_size, uploaded_by,
        description, tags, is_public, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, buildingId, title, type, filePath, fileSize, uploadedBy,
      description, JSON.stringify(parsedTags), isPublic === 'true', now, now
    ]);

    const newDocument = await db.get('SELECT * FROM documents WHERE id = ?', [id]);
    res.status(201).json(rowToDocument(newDocument));
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// PUT /api/documents/:id - Update document
router.put('/:id', async (req, res) => {
  try {
    const {
      buildingId,
      title,
      type,
      uploadedBy,
      description,
      tags,
      isPublic
    } = req.body;

    const now = new Date().toISOString();

    // Parse tags if provided
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }

    const result = await db.run(`
      UPDATE documents SET
        building_id = ?, title = ?, type = ?, uploaded_by = ?,
        description = ?, tags = ?, is_public = ?, updated_at = ?
      WHERE id = ?
    `, [
      buildingId, title, type, uploadedBy,
      description, JSON.stringify(parsedTags), isPublic === 'true', now, req.params.id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    res.json(rowToDocument(updatedDocument));
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// DELETE /api/documents/:id - Delete document
router.delete('/:id', async (req, res) => {
  try {
    // First get the document to find the file path
    const document = await db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete the file from filesystem
    if (document.file_url && fs.existsSync(document.file_url)) {
      try {
        fs.unlinkSync(document.file_url);
      } catch (fileError) {
        console.warn('Could not delete file:', document.file_url, fileError.message);
      }
    }

    // Delete from database
    const result = await db.run('DELETE FROM documents WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// GET /api/documents/:id/download - Download document file
router.get('/:id/download', async (req, res) => {
  try {
    const document = await db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = document.file_url;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers for file download
    const fileName = path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

// GET /api/documents/:id/view - View document file (inline)
router.get('/:id/view', async (req, res) => {
  try {
    const document = await db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const filePath = document.file_url;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set appropriate headers for inline viewing
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName).toLowerCase();
    
    let contentType = 'application/octet-stream';
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.txt') contentType = 'text/plain';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error viewing document:', error);
    res.status(500).json({ error: 'Failed to view document' });
  }
});

module.exports = router;

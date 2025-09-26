const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Sample documents data
const sampleDocuments = [
  {
    buildingId: 'building-1', // Marina Towers
    title: 'Marina Towers Site Survey Report',
    type: 'survey_report',
    fileUrl: '/uploads/documents/building-1/sample-survey-report.pdf',
    fileSize: 2400000, // 2.4 MB
    uploadedBy: 'user-3',
    description: 'Comprehensive site survey including access points, routing paths, and equipment placement recommendations',
    tags: ['survey', 'planning', 'marina-towers'],
    isPublic: true,
  },
  {
    buildingId: 'building-1', // Marina Towers
    title: 'Fiber Trenching Permit Application',
    type: 'permit',
    fileUrl: '/uploads/documents/building-1/sample-permit-application.pdf',
    fileSize: 1800000, // 1.8 MB
    uploadedBy: 'user-5',
    description: 'City of San Francisco permit application for fiber optic cable installation',
    tags: ['permit', 'legal', 'marina-towers'],
    isPublic: false,
  },
  {
    buildingId: 'building-1', // Marina Towers
    title: 'Marina Towers Network Design',
    type: 'technical_drawing',
    fileUrl: '/uploads/documents/building-1/sample-network-design.dwg',
    fileSize: 5200000, // 5.2 MB
    uploadedBy: 'user-2',
    description: 'Detailed network design including equipment placement, cable routing, and power requirements',
    tags: ['design', 'technical', 'marina-towers'],
    isPublic: true,
  },
  {
    buildingId: 'building-2', // Pacific Heights Condos
    title: 'HOA Approval Letter - Pacific Heights',
    type: 'approval',
    fileUrl: '/uploads/documents/building-2/sample-hoa-approval.pdf',
    fileSize: 800000, // 0.8 MB
    uploadedBy: 'user-5',
    description: 'Official HOA approval for network infrastructure installation',
    tags: ['approval', 'legal', 'pacific-heights'],
    isPublic: false,
  },
  {
    buildingId: 'building-3', // Mission Bay Apartments
    title: 'Mission Bay Construction Timeline',
    type: 'schedule',
    fileUrl: '/uploads/documents/building-3/sample-construction-timeline.xlsx',
    fileSize: 500000, // 0.5 MB
    uploadedBy: 'user-1',
    description: 'Construction timeline with network installation milestones integrated',
    tags: ['schedule', 'coordination', 'mission-bay'],
    isPublic: true,
  },
  {
    buildingId: 'building-5', // Hayes Valley Commons
    title: 'Hayes Valley ROI Analysis',
    type: 'financial',
    fileUrl: '/uploads/documents/building-5/sample-roi-analysis.pdf',
    fileSize: 1200000, // 1.2 MB
    uploadedBy: 'user-1',
    description: 'Return on investment analysis for completed Hayes Valley project',
    tags: ['financial', 'roi', 'hayes-valley'],
    isPublic: false,
  },
];

async function seedDocuments() {
  // Initialize database first
  await db.init();
  
  try {
    console.log('🌱 Seeding database with sample documents...');
    
    // Clear existing documents
    await db.run('DELETE FROM documents');
    console.log('✅ Cleared existing documents');
    
    // Create sample files (placeholder files)
    const uploadsDir = path.join(__dirname, '../uploads/documents');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Insert sample documents
    for (const doc of sampleDocuments) {
      const id = uuidv4();
      const now = new Date().toISOString();
      
      // Create building-specific directory
      const buildingDir = path.join(uploadsDir, doc.buildingId);
      if (!fs.existsSync(buildingDir)) {
        fs.mkdirSync(buildingDir, { recursive: true });
      }
      
      // Create placeholder file
      const fileName = path.basename(doc.fileUrl);
      const filePath = path.join(buildingDir, fileName);
      fs.writeFileSync(filePath, `Placeholder file for ${doc.title}`);
      
      await db.run(`
        INSERT INTO documents (
          id, building_id, title, type, file_url, file_size, uploaded_by,
          description, tags, is_public, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, doc.buildingId, doc.title, doc.type, filePath, doc.fileSize, doc.uploadedBy,
        doc.description, JSON.stringify(doc.tags), doc.isPublic, now, now
      ]);
    }
    
    console.log(`✅ Seeded ${sampleDocuments.length} documents`);
    console.log('🎉 Document seeding completed!');
    await db.close();
    
  } catch (error) {
    console.error('❌ Error seeding documents:', error);
    await db.close();
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDocuments()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedDocuments };

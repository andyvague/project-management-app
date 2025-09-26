const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Helper function to convert database row to Building object
function rowToBuilding(row) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    buildingType: row.building_type,
    totalUnits: row.total_units,
    status: row.status,
    buildoutStartDate: new Date(row.buildout_start_date),
    estimatedCompletion: new Date(row.estimated_completion),
    actualCompletion: row.actual_completion ? new Date(row.actual_completion) : undefined,
    propertyManager: row.property_manager,
    propertyManagerContact: row.property_manager_contact,
    propertyManagerEmail: row.property_manager_email,
    fiberAccess: row.fiber_access,
    rooftopAccess: row.rooftop_access,
    basementAccess: row.basement_access,
    electricalRoomAccess: row.electrical_room_access,
    notes: row.notes,
    priority: row.priority,
    estimatedRevenue: row.estimated_revenue,
    actualRevenue: row.actual_revenue,
    buildoutStage: row.buildout_stage,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  };
}

// GET /api/buildings - Get all buildings
router.get('/', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM buildings ORDER BY updated_at DESC');
    const buildings = rows.map(rowToBuilding);
    res.json(buildings);
  } catch (error) {
    console.error('Error fetching buildings:', error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});

// GET /api/buildings/:id - Get building by ID
router.get('/:id', async (req, res) => {
  try {
    const row = await db.get('SELECT * FROM buildings WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ error: 'Building not found' });
    }
    const building = rowToBuilding(row);
    res.json(building);
  } catch (error) {
    console.error('Error fetching building:', error);
    res.status(500).json({ error: 'Failed to fetch building' });
  }
});

// POST /api/buildings - Create new building
router.post('/', async (req, res) => {
  try {
    const {
      name,
      address,
      buildingType,
      totalUnits,
      status,
      buildoutStartDate,
      estimatedCompletion,
      actualCompletion,
      propertyManager,
      propertyManagerContact,
      propertyManagerEmail,
      fiberAccess,
      rooftopAccess,
      basementAccess,
      electricalRoomAccess,
      notes,
      priority,
      estimatedRevenue,
      actualRevenue,
      buildoutStage
    } = req.body;

    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(`
      INSERT INTO buildings (
        id, name, address, building_type, total_units, status,
        buildout_start_date, estimated_completion, actual_completion,
        property_manager, property_manager_contact, property_manager_email,
        fiber_access, rooftop_access, basement_access, electrical_room_access,
        notes, priority, estimated_revenue, actual_revenue, buildout_stage,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, name, address, buildingType, totalUnits, status,
      buildoutStartDate, estimatedCompletion, actualCompletion,
      propertyManager, propertyManagerContact, propertyManagerEmail,
      fiberAccess, rooftopAccess, basementAccess, electricalRoomAccess,
      notes, priority, estimatedRevenue || 0, actualRevenue || 0, buildoutStage,
      now, now
    ]);

    const newBuilding = await db.get('SELECT * FROM buildings WHERE id = ?', [id]);
    res.status(201).json(rowToBuilding(newBuilding));
  } catch (error) {
    console.error('Error creating building:', error);
    res.status(500).json({ error: 'Failed to create building' });
  }
});

// PUT /api/buildings/:id - Update building
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      address,
      buildingType,
      totalUnits,
      status,
      buildoutStartDate,
      estimatedCompletion,
      actualCompletion,
      propertyManager,
      propertyManagerContact,
      propertyManagerEmail,
      fiberAccess,
      rooftopAccess,
      basementAccess,
      electricalRoomAccess,
      notes,
      priority,
      estimatedRevenue,
      actualRevenue,
      buildoutStage
    } = req.body;

    const now = new Date().toISOString();

    const result = await db.run(`
      UPDATE buildings SET
        name = ?, address = ?, building_type = ?, total_units = ?, status = ?,
        buildout_start_date = ?, estimated_completion = ?, actual_completion = ?,
        property_manager = ?, property_manager_contact = ?, property_manager_email = ?,
        fiber_access = ?, rooftop_access = ?, basement_access = ?, electrical_room_access = ?,
        notes = ?, priority = ?, estimated_revenue = ?, actual_revenue = ?, buildout_stage = ?,
        updated_at = ?
      WHERE id = ?
    `, [
      name, address, buildingType, totalUnits, status,
      buildoutStartDate, estimatedCompletion, actualCompletion,
      propertyManager, propertyManagerContact, propertyManagerEmail,
      fiberAccess, rooftopAccess, basementAccess, electricalRoomAccess,
      notes, priority, estimatedRevenue || 0, actualRevenue || 0, buildoutStage,
      now, req.params.id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Building not found' });
    }

    const updatedBuilding = await db.get('SELECT * FROM buildings WHERE id = ?', [req.params.id]);
    res.json(rowToBuilding(updatedBuilding));
  } catch (error) {
    console.error('Error updating building:', error);
    res.status(500).json({ error: 'Failed to update building' });
  }
});

// DELETE /api/buildings/:id - Delete building
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.run('DELETE FROM buildings WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Building not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting building:', error);
    res.status(500).json({ error: 'Failed to delete building' });
  }
});

module.exports = router;

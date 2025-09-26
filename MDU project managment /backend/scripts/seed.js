const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Sample data from the frontend
const sampleBuildings = [
  {
    name: 'The Marina Towers',
    address: '2450 Lombard Street, San Francisco, CA 94123',
    buildingType: 'apartment_complex',
    totalUnits: 156,
    status: 'active',
    buildoutStartDate: '2024-01-15',
    estimatedCompletion: '2024-06-30',
    actualCompletion: null,
    propertyManager: 'Marina Property Management',
    propertyManagerContact: '+1 (415) 555-0200',
    propertyManagerEmail: 'manager@marinaproperties.com',
    fiberAccess: 'available',
    rooftopAccess: 'available',
    basementAccess: 'available',
    electricalRoomAccess: 'available',
    notes: 'High-end residential complex. Property manager very cooperative. Rooftop has clear line of sight to our PoP.',
    priority: 'high',
    estimatedRevenue: 46800,
    actualRevenue: 0,
    buildoutStage: 'infrastructure_installation'
  },
  {
    name: 'Pacific Heights Condos',
    address: '1800 California Street, San Francisco, CA 94109',
    buildingType: 'condominium',
    totalUnits: 89,
    status: 'active',
    buildoutStartDate: '2024-02-01',
    estimatedCompletion: '2024-07-15',
    actualCompletion: null,
    propertyManager: 'Pacific Heights Management',
    propertyManagerContact: '+1 (415) 555-0201',
    propertyManagerEmail: 'info@phmanagement.com',
    fiberAccess: 'available',
    rooftopAccess: 'available',
    basementAccess: 'limited',
    electricalRoomAccess: 'available',
    notes: 'Historic building. Some access restrictions in basement. HOA approval required for major changes.',
    priority: 'medium',
    estimatedRevenue: 26700,
    actualRevenue: 0,
    buildoutStage: 'equipment_installation'
  },
  {
    name: 'Mission Bay Apartments',
    address: '185 Berry Street, San Francisco, CA 94158',
    buildingType: 'apartment_complex',
    totalUnits: 234,
    status: 'active',
    buildoutStartDate: '2024-01-01',
    estimatedCompletion: '2024-08-30',
    actualCompletion: null,
    propertyManager: 'Mission Bay Properties',
    propertyManagerContact: '+1 (415) 555-0202',
    propertyManagerEmail: 'contact@missionbayprop.com',
    fiberAccess: 'available',
    rooftopAccess: 'available',
    basementAccess: 'available',
    electricalRoomAccess: 'available',
    notes: 'New construction. Excellent access to all areas. Close to our main PoP. High tenant demand.',
    priority: 'high',
    estimatedRevenue: 70200,
    actualRevenue: 0,
    buildoutStage: 'tenant_installation'
  },
  {
    name: 'North Beach Lofts',
    address: '1200 Columbus Avenue, San Francisco, CA 94133',
    buildingType: 'mixed_use',
    totalUnits: 67,
    status: 'on-hold',
    buildoutStartDate: '2024-04-01',
    estimatedCompletion: '2024-09-30',
    actualCompletion: null,
    propertyManager: 'North Beach Development',
    propertyManagerContact: '+1 (415) 555-0203',
    propertyManagerEmail: 'dev@northbeachlofts.com',
    fiberAccess: 'pending',
    rooftopAccess: 'available',
    basementAccess: 'available',
    electricalRoomAccess: 'available',
    notes: 'Mixed-use building with retail on ground floor. Project on hold due to city permit delays.',
    priority: 'medium',
    estimatedRevenue: 20100,
    actualRevenue: 0,
    buildoutStage: 'planning'
  },
  {
    name: 'Hayes Valley Commons',
    address: '450 Hayes Street, San Francisco, CA 94102',
    buildingType: 'apartment_complex',
    totalUnits: 112,
    status: 'completed',
    buildoutStartDate: '2023-08-01',
    estimatedCompletion: '2024-01-31',
    actualCompletion: '2024-01-15',
    propertyManager: 'Hayes Valley Management',
    propertyManagerContact: '+1 (415) 555-0204',
    propertyManagerEmail: 'management@hayesvalley.com',
    fiberAccess: 'available',
    rooftopAccess: 'available',
    basementAccess: 'available',
    electricalRoomAccess: 'available',
    notes: 'Successfully completed. 89% tenant adoption rate. Excellent ROI.',
    priority: 'low',
    estimatedRevenue: 33600,
    actualRevenue: 29904,
    buildoutStage: 'completed'
  },
  {
    name: 'Financial District Tower',
    address: '100 Pine Street, San Francisco, CA 94111',
    buildingType: 'mixed_use',
    totalUnits: 45,
    status: 'cancelled',
    buildoutStartDate: '2024-01-01',
    estimatedCompletion: '2024-06-30',
    actualCompletion: null,
    propertyManager: 'Financial District Properties',
    propertyManagerContact: '+1 (415) 555-0205',
    propertyManagerEmail: 'info@fdp.com',
    fiberAccess: 'unavailable',
    rooftopAccess: 'unavailable',
    basementAccess: 'unavailable',
    electricalRoomAccess: 'unavailable',
    notes: 'Project cancelled due to building owner bankruptcy. No access to building infrastructure.',
    priority: 'low',
    estimatedRevenue: 13500,
    actualRevenue: 0,
    buildoutStage: 'planning'
  }
];

async function seedDatabase() {
  // Initialize database first
  await db.init();
  
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // Clear existing data
    await db.run('DELETE FROM buildings');
    console.log('✅ Cleared existing buildings');
    
    // Insert sample buildings
    for (const building of sampleBuildings) {
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
        id, building.name, building.address, building.buildingType, building.totalUnits, building.status,
        building.buildoutStartDate, building.estimatedCompletion, building.actualCompletion,
        building.propertyManager, building.propertyManagerContact, building.propertyManagerEmail,
        building.fiberAccess, building.rooftopAccess, building.basementAccess, building.electricalRoomAccess,
        building.notes, building.priority, building.estimatedRevenue, building.actualRevenue, building.buildoutStage,
        now, now
      ]);
    }
    
    console.log(`✅ Seeded ${sampleBuildings.length} buildings`);
    console.log('🎉 Database seeding completed!');
    await db.close();
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await db.close();
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };

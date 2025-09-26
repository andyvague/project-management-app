-- MDU Project Management Database Schema

-- Buildings table
CREATE TABLE IF NOT EXISTS buildings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    building_type TEXT NOT NULL CHECK (building_type IN ('apartment_complex', 'condominium', 'mixed_use', 'student_housing')),
    total_units INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('planning', 'active', 'completed', 'on-hold', 'cancelled')),
    buildout_start_date TEXT NOT NULL,
    estimated_completion TEXT NOT NULL,
    actual_completion TEXT,
    property_manager TEXT NOT NULL,
    property_manager_contact TEXT,
    property_manager_email TEXT,
    fiber_access TEXT NOT NULL CHECK (fiber_access IN ('available', 'pending', 'unavailable')),
    rooftop_access TEXT NOT NULL CHECK (rooftop_access IN ('available', 'limited', 'unavailable')),
    basement_access TEXT NOT NULL CHECK (basement_access IN ('available', 'limited', 'unavailable')),
    electrical_room_access TEXT NOT NULL CHECK (electrical_room_access IN ('available', 'limited', 'unavailable')),
    notes TEXT,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    estimated_revenue REAL DEFAULT 0,
    actual_revenue REAL DEFAULT 0,
    buildout_stage TEXT NOT NULL CHECK (buildout_stage IN ('planning', 'infrastructure_installation', 'equipment_installation', 'tenant_installation', 'testing', 'completed')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Buildout tasks table
CREATE TABLE IF NOT EXISTS buildout_tasks (
    id TEXT PRIMARY KEY,
    building_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('not-started', 'in-progress', 'completed', 'blocked', 'cancelled')),
    stage TEXT NOT NULL CHECK (stage IN ('planning', 'infrastructure_installation', 'equipment_installation', 'tenant_installation', 'testing', 'completed')),
    assigned_to TEXT NOT NULL,
    due_date TEXT NOT NULL,
    completed_date TEXT,
    dependencies TEXT, -- JSON array of task IDs
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_hours INTEGER NOT NULL,
    actual_hours INTEGER,
    notes TEXT,
    category TEXT NOT NULL CHECK (category IN ('survey', 'permits', 'equipment', 'cabling', 'wireless', 'configuration', 'installation', 'testing', 'coordination', 'evaluation')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE CASCADE
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    building_id TEXT NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('survey_report', 'permit', 'technical_drawing', 'approval', 'schedule', 'financial', 'other')),
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_by TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT, -- JSON array of strings
    is_public BOOLEAN NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE CASCADE
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id TEXT PRIMARY KEY,
    building_id TEXT,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('installation', 'meeting', 'survey', 'maintenance')),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    assigned_to TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    notes TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (building_id) REFERENCES buildings (id) ON DELETE SET NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'project_manager', 'senior_engineer', 'network_engineer', 'field_technician', 'permit_coordinator', 'viewer')),
    phone TEXT NOT NULL,
    avatar TEXT NOT NULL,
    department TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_buildings_status ON buildings(status);
CREATE INDEX IF NOT EXISTS idx_buildings_created_at ON buildings(created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_building_id ON buildout_tasks(building_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON buildout_tasks(status);
CREATE INDEX IF NOT EXISTS idx_documents_building_id ON documents(building_id);
CREATE INDEX IF NOT EXISTS idx_schedules_building_id ON schedules(building_id);
CREATE INDEX IF NOT EXISTS idx_schedules_start_time ON schedules(start_time);

export interface Building {
  id: string;
  name: string;
  address: string;
  buildingType: 'apartment_complex' | 'condominium' | 'mixed_use' | 'student_housing';
  totalUnits: number;
  status: BuildingStatus;
  buildoutStartDate: Date;
  estimatedCompletion: Date;
  actualCompletion?: Date;
  propertyManager: string;
  propertyManagerContact: string;
  propertyManagerEmail: string;
  fiberAccess: 'available' | 'pending' | 'unavailable';
  rooftopAccess: 'available' | 'limited' | 'unavailable';
  basementAccess: 'available' | 'limited' | 'unavailable';
  electricalRoomAccess: 'available' | 'limited' | 'unavailable';
  notes: string;
  priority: 'low' | 'medium' | 'high';
  estimatedRevenue: number;
  actualRevenue: number;
  buildoutStage: BuildoutStage;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildoutTask {
  id: string;
  buildingId: string;
  title: string;
  description: string;
  status: TaskStatus;
  stage: BuildoutStage;
  assignedTo: string;
  dueDate: Date;
  completedDate?: Date;
  dependencies: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours: number;
  actualHours?: number;
  notes?: string;
  category: 'survey' | 'permits' | 'equipment' | 'cabling' | 'wireless' | 'configuration' | 'installation' | 'testing' | 'coordination' | 'evaluation';
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  buildingId: string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  fileSize: string;
  uploadedBy: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  buildingId: string;
  title: string;
  type: 'installation' | 'meeting' | 'survey' | 'maintenance';
  startTime: Date;
  endTime: Date;
  assignedTo: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  location: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  department: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BuildingStatus = 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked' | 'cancelled';
export type BuildoutStage = 'planning' | 'infrastructure_installation' | 'equipment_installation' | 'tenant_installation' | 'testing' | 'completed';
export type DocumentType = 'survey_report' | 'permit' | 'technical_drawing' | 'approval' | 'schedule' | 'financial' | 'other';
export type UserRole = 'admin' | 'project_manager' | 'senior_engineer' | 'network_engineer' | 'field_technician' | 'permit_coordinator' | 'viewer';

export interface DashboardStats {
  totalBuildings: number;
  activeBuildings: number;
  completedBuildings: number;
  overdueTasks: number;
  upcomingDeadlines: number;
  averageCompletionTime: number;
}

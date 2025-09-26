import { Document } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export interface Building {
  id: string;
  name: string;
  address: string;
  buildingType: 'apartment_complex' | 'condominium' | 'mixed_use' | 'student_housing';
  totalUnits: number;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
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
  buildoutStage: 'planning' | 'infrastructure_installation' | 'equipment_installation' | 'tenant_installation' | 'testing' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBuildingData = Omit<Building, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBuildingData = Partial<CreateBuildingData>;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
  }
  
  if (response.status === 204) {
    return undefined as T;
  }
  
  return response.json();
}

export const buildingsApi = {
  async getAll(): Promise<Building[]> {
    const response = await fetch(`${API_BASE_URL}/buildings`);
    const buildings = await handleResponse<Building[]>(response);
    
    // Convert date strings back to Date objects
    return buildings.map(building => ({
      ...building,
      buildoutStartDate: new Date(building.buildoutStartDate),
      estimatedCompletion: new Date(building.estimatedCompletion),
      actualCompletion: building.actualCompletion ? new Date(building.actualCompletion) : undefined,
      createdAt: new Date(building.createdAt),
      updatedAt: new Date(building.updatedAt),
    }));
  },

  async getById(id: string): Promise<Building> {
    const response = await fetch(`${API_BASE_URL}/buildings/${id}`);
    const building = await handleResponse<Building>(response);
    
    // Convert date strings back to Date objects
    return {
      ...building,
      buildoutStartDate: new Date(building.buildoutStartDate),
      estimatedCompletion: new Date(building.estimatedCompletion),
      actualCompletion: building.actualCompletion ? new Date(building.actualCompletion) : undefined,
      createdAt: new Date(building.createdAt),
      updatedAt: new Date(building.updatedAt),
    };
  },

  async create(data: CreateBuildingData): Promise<Building> {
    const response = await fetch(`${API_BASE_URL}/buildings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        buildoutStartDate: data.buildoutStartDate.toISOString(),
        estimatedCompletion: data.estimatedCompletion.toISOString(),
        actualCompletion: data.actualCompletion?.toISOString(),
      }),
    });
    
    const building = await handleResponse<Building>(response);
    
    // Convert date strings back to Date objects
    return {
      ...building,
      buildoutStartDate: new Date(building.buildoutStartDate),
      estimatedCompletion: new Date(building.estimatedCompletion),
      actualCompletion: building.actualCompletion ? new Date(building.actualCompletion) : undefined,
      createdAt: new Date(building.createdAt),
      updatedAt: new Date(building.updatedAt),
    };
  },

  async update(id: string, data: UpdateBuildingData): Promise<Building> {
    const response = await fetch(`${API_BASE_URL}/buildings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        buildoutStartDate: data.buildoutStartDate?.toISOString(),
        estimatedCompletion: data.estimatedCompletion?.toISOString(),
        actualCompletion: data.actualCompletion?.toISOString(),
      }),
    });
    
    const building = await handleResponse<Building>(response);
    
    // Convert date strings back to Date objects
    return {
      ...building,
      buildoutStartDate: new Date(building.buildoutStartDate),
      estimatedCompletion: new Date(building.estimatedCompletion),
      actualCompletion: building.actualCompletion ? new Date(building.actualCompletion) : undefined,
      createdAt: new Date(building.createdAt),
      updatedAt: new Date(building.updatedAt),
    };
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/buildings/${id}`, {
      method: 'DELETE',
    });
    
    await handleResponse<void>(response);
  },
};

export const healthApi = {
  async check(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse<{ status: string; timestamp: string }>(response);
  },
};

export type CreateDocumentData = Omit<Document, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDocumentData = Partial<CreateDocumentData>;

export const documentsApi = {
  async getAll(): Promise<Document[]> {
    const response = await fetch(`${API_BASE_URL}/documents`);
    const documents = await handleResponse<Document[]>(response);
    
    // Convert date strings back to Date objects
    return documents.map(document => ({
      ...document,
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt),
    }));
  },

  async getById(id: string): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`);
    const document = await handleResponse<Document>(response);
    
    // Convert date strings back to Date objects
    return {
      ...document,
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt),
    };
  },

  async create(data: CreateDocumentData, file?: File): Promise<Document> {
    const formData = new FormData();
    
    // Add file if provided
    if (file) {
      formData.append('file', file);
    }
    
    // Add other form fields
    formData.append('buildingId', data.buildingId);
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('uploadedBy', data.uploadedBy);
    formData.append('description', data.description);
    formData.append('tags', JSON.stringify(data.tags));
    formData.append('isPublic', data.isPublic.toString());
    
    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      body: formData,
    });
    
    const document = await handleResponse<Document>(response);
    
    // Convert date strings back to Date objects
    return {
      ...document,
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt),
    };
  },

  async update(id: string, data: UpdateDocumentData): Promise<Document> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : undefined,
      }),
    });
    
    const document = await handleResponse<Document>(response);
    
    // Convert date strings back to Date objects
    return {
      ...document,
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt),
    };
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE',
    });
    
    await handleResponse<void>(response);
  },

  async download(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/download`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }
    return response.blob();
  },

  async view(id: string): Promise<string> {
    const url = `${API_BASE_URL}/documents/${id}/view`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(response.status, errorData.error || `HTTP ${response.status}`);
    }
    return url;
  },
};

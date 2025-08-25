import { Building, BuildoutTask, Document, Schedule, User } from '../types';
import { sampleBuildings, sampleTasks, sampleDocuments, sampleSchedules, sampleUsers } from './sampleData';

export const loadSampleData = () => {
  // Load users first
  const users: User[] = sampleUsers.map((userData, index) => ({
    ...userData,
    id: `user-${index + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Load buildings with proper IDs
  const buildings: Building[] = sampleBuildings.map((buildingData, index) => ({
    ...buildingData,
    id: `building-${index + 1}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  // Load tasks with proper building relationships
  const tasks: BuildoutTask[] = sampleTasks.map((taskData, index) => {
    // Determine building ID based on task content and logical grouping
    let buildingId: string;
    
    if (taskData.title.includes('Marina Towers') || 
        taskData.description.includes('Marina') ||
        taskData.notes?.includes('Marina')) {
      buildingId = 'building-1'; // Marina Towers
    } else if (taskData.title.includes('Pacific Heights') || 
               taskData.description.includes('HOA') ||
               taskData.notes?.includes('HOA')) {
      buildingId = 'building-2'; // Pacific Heights Condos
    } else if (taskData.title.includes('Mission Bay') || 
               taskData.description.includes('construction') ||
               taskData.notes?.includes('construction')) {
      buildingId = 'building-3'; // Mission Bay Apartments
    } else if (taskData.title.includes('North Beach') || 
               taskData.description.includes('city') ||
               taskData.notes?.includes('city')) {
      buildingId = 'building-4'; // North Beach Lofts
    } else if (taskData.title.includes('Hayes Valley') || 
               taskData.description.includes('ROI') ||
               taskData.notes?.includes('satisfaction')) {
      buildingId = 'building-5'; // Hayes Valley Commons
    } else if (taskData.title.includes('Financial District') || 
               taskData.description.includes('bankruptcy') ||
               taskData.notes?.includes('bankruptcy')) {
      buildingId = 'building-6'; // Financial District Tower
    } else {
      // Default to first building for any unmatched tasks
      buildingId = 'building-1';
    }

    return {
      ...taskData,
      id: `task-${index + 1}`,
      buildingId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  // Load documents with proper building relationships
  const documents: Document[] = sampleDocuments.map((docData, index) => {
    // Determine building ID based on document content
    let buildingId: string;
    
    if (docData.title.includes('Marina Towers') || 
        docData.description.includes('Marina') ||
        docData.tags.includes('marina-towers')) {
      buildingId = 'building-1';
    } else if (docData.title.includes('Pacific Heights') || 
               docData.description.includes('HOA') ||
               docData.tags.includes('pacific-heights')) {
      buildingId = 'building-2';
    } else if (docData.title.includes('Mission Bay') || 
               docData.description.includes('construction') ||
               docData.tags.includes('mission-bay')) {
      buildingId = 'building-3';
    } else if (docData.title.includes('North Beach') || 
               docData.description.includes('city')) {
      buildingId = 'building-4';
    } else if (docData.title.includes('Hayes Valley') || 
               docData.description.includes('ROI') ||
               docData.tags.includes('hayes-valley')) {
      buildingId = 'building-5';
    } else if (docData.title.includes('Financial District') || 
               docData.description.includes('bankruptcy') ||
               docData.tags.includes('financial-district')) {
      buildingId = 'building-6';
    } else {
      buildingId = 'building-1';
    }

    return {
      ...docData,
      id: `document-${index + 1}`,
      buildingId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  // Load schedules with proper building relationships
  const schedules: Schedule[] = sampleSchedules.map((scheduleData, index) => {
    // Determine building ID based on schedule content
    let buildingId: string;
    
    if (scheduleData.title.includes('Marina Towers') || 
        scheduleData.description.includes('Marina') ||
        scheduleData.location.includes('Marina')) {
      buildingId = 'building-1';
    } else if (scheduleData.title.includes('Pacific Heights') || 
               scheduleData.description.includes('HOA') ||
               scheduleData.location.includes('Pacific Heights')) {
      buildingId = 'building-2';
    } else if (scheduleData.title.includes('Mission Bay') || 
               scheduleData.description.includes('construction') ||
               scheduleData.location.includes('Mission Bay')) {
      buildingId = 'building-3';
    } else if (scheduleData.title.includes('North Beach')) {
      buildingId = 'building-4';
    } else if (scheduleData.title.includes('Hayes Valley')) {
      buildingId = 'building-5';
    } else if (scheduleData.title.includes('Financial District') || 
               scheduleData.description.includes('bankruptcy')) {
      buildingId = 'building-6';
    } else {
      // Weekly team meeting doesn't belong to a specific building
      buildingId = '';
    }

    return {
      ...scheduleData,
      id: `schedule-${index + 1}`,
      buildingId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  return { users, buildings, tasks, documents, schedules };
};

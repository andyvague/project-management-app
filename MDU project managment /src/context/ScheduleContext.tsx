import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Schedule } from '../types';
import { loadSampleData } from '../data/dataLoader';

interface ScheduleState {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  selectedSchedule: Schedule | null;
}

type ScheduleAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SCHEDULES'; payload: Schedule[] }
  | { type: 'ADD_SCHEDULE'; payload: Schedule }
  | { type: 'UPDATE_SCHEDULE'; payload: Schedule }
  | { type: 'DELETE_SCHEDULE'; payload: string }
  | { type: 'SET_SELECTED_SCHEDULE'; payload: Schedule | null };

const initialState: ScheduleState = {
  schedules: [],
  loading: false,
  error: null,
  selectedSchedule: null,
};

const scheduleReducer = (state: ScheduleState, action: ScheduleAction): ScheduleState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SCHEDULES':
      return { ...state, schedules: action.payload };
    case 'ADD_SCHEDULE':
      return { ...state, schedules: [...state.schedules, action.payload] };
    case 'UPDATE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.map(schedule =>
          schedule.id === action.payload.id ? action.payload : schedule
        ),
      };
    case 'DELETE_SCHEDULE':
      return {
        ...state,
        schedules: state.schedules.filter(schedule => schedule.id !== action.payload),
      };
    case 'SET_SELECTED_SCHEDULE':
      return { ...state, selectedSchedule: action.payload };
    default:
      return state;
  }
};

interface ScheduleContextType {
  state: ScheduleState;
  dispatch: React.Dispatch<ScheduleAction>;
  addSchedule: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  getScheduleById: (id: string) => Schedule | undefined;
  getSchedulesByBuilding: (buildingId: string) => Schedule[];
  getSchedulesByType: (type: string) => Schedule[];
  getSchedulesByDate: (date: Date) => Schedule[];
  getSchedulesByUser: (userId: string) => Schedule[];
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
};

interface ScheduleProviderProps {
  children: ReactNode;
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // Load sample data on mount
  useEffect(() => {
    if (state.schedules.length === 0) {
      const { schedules } = loadSampleData();
      schedules.forEach(schedule => {
        dispatch({ type: 'ADD_SCHEDULE', payload: schedule });
      });
    }
  }, [state.schedules.length]);

  const addSchedule = (scheduleData: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSchedule: Schedule = {
      ...scheduleData,
      id: `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_SCHEDULE', payload: newSchedule });
  };

  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    const existingSchedule = state.schedules.find(schedule => schedule.id === id);
    if (existingSchedule) {
      const updatedSchedule: Schedule = {
        ...existingSchedule,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_SCHEDULE', payload: updatedSchedule });
    }
  };

  const deleteSchedule = (id: string) => {
    dispatch({ type: 'DELETE_SCHEDULE', payload: id });
  };

  const getScheduleById = (id: string): Schedule | undefined => {
    return state.schedules.find(schedule => schedule.id === id);
  };

  const getSchedulesByBuilding = (buildingId: string): Schedule[] => {
    return state.schedules.filter(schedule => schedule.buildingId === buildingId);
  };

  const getSchedulesByType = (type: string): Schedule[] => {
    return state.schedules.filter(schedule => schedule.type === type);
  };

  const getSchedulesByDate = (date: Date): Schedule[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(targetDate);
    nextDate.setDate(nextDate.getDate() + 1);
    
    return state.schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.startTime);
      return scheduleDate >= targetDate && scheduleDate < nextDate;
    });
  };

  const getSchedulesByUser = (userId: string): Schedule[] => {
    return state.schedules.filter(schedule => schedule.assignedTo === userId);
  };

  const value: ScheduleContextType = {
    state,
    dispatch,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
    getSchedulesByBuilding,
    getSchedulesByType,
    getSchedulesByDate,
    getSchedulesByUser,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

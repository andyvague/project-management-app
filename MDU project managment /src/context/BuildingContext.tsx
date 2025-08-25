import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Building } from '../types';
import { loadSampleData } from '../data/dataLoader';

interface BuildingState {
  buildings: Building[];
  loading: boolean;
  error: string | null;
  selectedBuilding: Building | null;
}

type BuildingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BUILDINGS'; payload: Building[] }
  | { type: 'ADD_BUILDING'; payload: Building }
  | { type: 'UPDATE_BUILDING'; payload: Building }
  | { type: 'DELETE_BUILDING'; payload: string }
  | { type: 'SET_SELECTED_BUILDING'; payload: Building | null };

const initialState: BuildingState = {
  buildings: [],
  loading: false,
  error: null,
  selectedBuilding: null,
};

const buildingReducer = (state: BuildingState, action: BuildingAction): BuildingState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_BUILDINGS':
      return { ...state, buildings: action.payload };
    case 'ADD_BUILDING':
      return { ...state, buildings: [...state.buildings, action.payload] };
    case 'UPDATE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.map(building =>
          building.id === action.payload.id ? action.payload : building
        ),
      };
    case 'DELETE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.filter(building => building.id !== action.payload),
      };
    case 'SET_SELECTED_BUILDING':
      return { ...state, selectedBuilding: action.payload };
    default:
      return state;
  }
};

interface BuildingContextType {
  state: BuildingState;
  dispatch: React.Dispatch<BuildingAction>;
  addBuilding: (building: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  getBuildingById: (id: string) => Building | undefined;
}

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export const useBuildingContext = () => {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error('useBuildingContext must be used within a BuildingProvider');
  }
  return context;
};

interface BuildingProviderProps {
  children: ReactNode;
}

export const BuildingProvider: React.FC<BuildingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(buildingReducer, initialState);

  // Load sample data on mount
  useEffect(() => {
    if (state.buildings.length === 0) {
      const { buildings } = loadSampleData();
      // Set buildings directly instead of calling addBuilding to preserve IDs
      dispatch({ type: 'SET_BUILDINGS', payload: buildings });
    }
  }, [state.buildings.length]);

  const addBuilding = (buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBuilding: Building = {
      ...buildingData,
      id: `building-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_BUILDING', payload: newBuilding });
  };

  const updateBuilding = (id: string, updates: Partial<Building>) => {
    const building = state.buildings.find(b => b.id === id);
    if (building) {
      const updatedBuilding: Building = {
        ...building,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_BUILDING', payload: updatedBuilding });
    }
  };

  const deleteBuilding = (id: string) => {
    dispatch({ type: 'DELETE_BUILDING', payload: id });
  };

  const getBuildingById = (id: string) => {
    return state.buildings.find(building => building.id === id);
  };

  const value: BuildingContextType = {
    state,
    dispatch,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    getBuildingById,
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
};

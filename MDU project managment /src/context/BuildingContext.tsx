import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Building } from '../types';
import { buildingsApi, CreateBuildingData, UpdateBuildingData } from '../services/api';

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
  addBuilding: (building: CreateBuildingData) => Promise<void>;
  updateBuilding: (id: string, updates: UpdateBuildingData) => Promise<void>;
  deleteBuilding: (id: string) => Promise<void>;
  getBuildingById: (id: string) => Building | undefined;
  refreshBuildings: () => Promise<void>;
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

  // Load buildings from API on mount
  useEffect(() => {
    refreshBuildings();
  }, []);

  const refreshBuildings = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const buildings = await buildingsApi.getAll();
      dispatch({ type: 'SET_BUILDINGS', payload: buildings });
    } catch (error) {
      console.error('Failed to load buildings:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load buildings' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addBuilding = async (buildingData: CreateBuildingData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const newBuilding = await buildingsApi.create(buildingData);
      dispatch({ type: 'ADD_BUILDING', payload: newBuilding });
    } catch (error) {
      console.error('Failed to create building:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create building' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateBuilding = async (id: string, updates: UpdateBuildingData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const updatedBuilding = await buildingsApi.update(id, updates);
      dispatch({ type: 'UPDATE_BUILDING', payload: updatedBuilding });
    } catch (error) {
      console.error('Failed to update building:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update building' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteBuilding = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await buildingsApi.delete(id);
      dispatch({ type: 'DELETE_BUILDING', payload: id });
    } catch (error) {
      console.error('Failed to delete building:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete building' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
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
    refreshBuildings,
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
};

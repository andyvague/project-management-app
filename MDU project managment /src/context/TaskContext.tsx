import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { BuildoutTask } from '../types';
import { loadSampleData } from '../data/dataLoader';

interface TaskState {
  tasks: BuildoutTask[];
  loading: boolean;
  error: string | null;
  selectedTask: BuildoutTask | null;
}

type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: BuildoutTask[] }
  | { type: 'ADD_TASK'; payload: BuildoutTask }
  | { type: 'UPDATE_TASK'; payload: BuildoutTask }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_SELECTED_TASK'; payload: BuildoutTask | null };

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_SELECTED_TASK':
      return { ...state, selectedTask: action.payload };
    default:
      return state;
  }
};

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  addTask: (task: Omit<BuildoutTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<BuildoutTask>) => void;
  deleteTask: (id: string) => void;
  getTaskById: (id: string) => BuildoutTask | undefined;
  getTasksByBuilding: (buildingId: string) => BuildoutTask[];
  getTasksByStage: (stage: string) => BuildoutTask[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load sample data on mount
  useEffect(() => {
    if (state.tasks.length === 0) {
      const { tasks } = loadSampleData();
      tasks.forEach(task => {
        dispatch({ type: 'ADD_TASK', payload: task });
      });
    }
  }, [state.tasks.length]);

  const addTask = (taskData: Omit<BuildoutTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: BuildoutTask = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
  };

  const updateTask = (id: string, updates: Partial<BuildoutTask>) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const updatedTask: BuildoutTask = {
        ...task,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
    }
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const getTaskById = (id: string) => {
    return state.tasks.find(task => task.id === id);
  };

  const getTasksByBuilding = (buildingId: string) => {
    return state.tasks.filter(task => task.buildingId === buildingId);
  };

  const getTasksByStage = (stage: string) => {
    return state.tasks.filter(task => task.stage === stage);
  };

  const value: TaskContextType = {
    state,
    dispatch,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByBuilding,
    getTasksByStage,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

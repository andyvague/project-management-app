import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { loadSampleData } from '../data/dataLoader';

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

type UserAction =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  getUserById: (id: string) => User | undefined;
  getUsersByRole: (role: string) => User[];
  getUsersByDepartment: (department: string) => User[];
  addUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load sample users on mount
  useEffect(() => {
    try {
      if (state.users.length === 0) {
        const { users } = loadSampleData();
        users.forEach(user => {
          dispatch({ type: 'ADD_USER', payload: user });
        });
      }
    } catch (error) {
      console.error('Error loading sample users:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load users' });
    }
  }, []);

  const getUserById = (id: string): User | undefined => {
    return state.users.find(user => user.id === id);
  };

  const getUsersByRole = (role: string): User[] => {
    return state.users.filter(user => user.role === role);
  };

  const getUsersByDepartment = (department: string): User[] => {
    return state.users.filter(user => user.department === department);
  };

  const value: UserContextType = {
    state,
    dispatch,
    getUserById,
    getUsersByRole,
    getUsersByDepartment,
    addUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch({ type: 'ADD_USER', payload: newUser });
    },
    updateUser: (id: string, updates: Partial<User>) => {
      const existingUser = state.users.find(user => user.id === id);
      if (existingUser) {
        const updatedUser: User = {
          ...existingUser,
          ...updates,
          updatedAt: new Date(),
        };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      }
    },
    deleteUser: (id: string) => {
      dispatch({ type: 'DELETE_USER', payload: id });
    },
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Document } from '../types';
import { loadSampleData } from '../data/dataLoader';

interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  selectedDocument: Document | null;
}

type DocumentAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SET_SELECTED_DOCUMENT'; payload: Document | null };

const initialState: DocumentState = {
  documents: [],
  loading: false,
  error: null,
  selectedDocument: null,
};

const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? action.payload : doc
        ),
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
      };
    case 'SET_SELECTED_DOCUMENT':
      return { ...state, selectedDocument: action.payload };
    default:
      return state;
  }
};

interface DocumentContextType {
  state: DocumentState;
  dispatch: React.Dispatch<DocumentAction>;
  addDocument: (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  getDocumentById: (id: string) => Document | undefined;
  getDocumentsByBuilding: (buildingId: string) => Document[];
  getDocumentsByType: (type: string) => Document[];
  getDocumentsByTag: (tag: string) => Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  // Load sample data on mount
  useEffect(() => {
    if (state.documents.length === 0) {
      const { documents } = loadSampleData();
      documents.forEach(doc => {
        dispatch({ type: 'ADD_DOCUMENT', payload: doc });
      });
    }
  }, [state.documents.length]);

  const addDocument = (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDocument: Document = {
      ...documentData,
      id: `document-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    const existingDocument = state.documents.find(doc => doc.id === id);
    if (existingDocument) {
      const updatedDocument: Document = {
        ...existingDocument,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_DOCUMENT', payload: updatedDocument });
    }
  };

  const deleteDocument = (id: string) => {
    dispatch({ type: 'DELETE_DOCUMENT', payload: id });
  };

  const getDocumentById = (id: string): Document | undefined => {
    return state.documents.find(doc => doc.id === id);
  };

  const getDocumentsByBuilding = (buildingId: string): Document[] => {
    return state.documents.filter(doc => doc.buildingId === buildingId);
  };

  const getDocumentsByType = (type: string): Document[] => {
    return state.documents.filter(doc => doc.type === type);
  };

  const getDocumentsByTag = (tag: string): Document[] => {
    return state.documents.filter(doc => doc.tags.includes(tag));
  };

  const value: DocumentContextType = {
    state,
    dispatch,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    getDocumentsByBuilding,
    getDocumentsByType,
    getDocumentsByTag,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

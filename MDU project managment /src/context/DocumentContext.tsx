import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Document } from '../types';
import { documentsApi, CreateDocumentData, UpdateDocumentData } from '../services/api';

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
  addDocument: (documentData: CreateDocumentData, file?: File) => Promise<void>;
  updateDocument: (id: string, updates: UpdateDocumentData) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getDocumentById: (id: string) => Document | undefined;
  getDocumentsByBuilding: (buildingId: string) => Document[];
  getDocumentsByType: (type: string) => Document[];
  getDocumentsByTag: (tag: string) => Document[];
  refreshDocuments: () => Promise<void>;
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

  useEffect(() => {
    refreshDocuments();
  }, []);

  const refreshDocuments = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const documents = await documentsApi.getAll();
      dispatch({ type: 'SET_DOCUMENTS', payload: documents });
    } catch (error) {
      console.error('Failed to load documents:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load documents' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addDocument = async (documentData: CreateDocumentData, file?: File) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const newDocument = await documentsApi.create(documentData, file);
      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
    } catch (error) {
      console.error('Failed to create document:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create document' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateDocument = async (id: string, updates: UpdateDocumentData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const updatedDocument = await documentsApi.update(id, updates);
      dispatch({ type: 'UPDATE_DOCUMENT', payload: updatedDocument });
    } catch (error) {
      console.error('Failed to update document:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update document' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteDocument = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      await documentsApi.delete(id);
      dispatch({ type: 'DELETE_DOCUMENT', payload: id });
    } catch (error) {
      console.error('Failed to delete document:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete document' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
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
    refreshDocuments,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

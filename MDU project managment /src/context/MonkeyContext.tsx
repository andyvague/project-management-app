import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MonkeyContextType {
  showMonkeys: boolean;
  toggleMonkeys: () => void;
  setShowMonkeys: (show: boolean) => void;
}

const MonkeyContext = createContext<MonkeyContextType | undefined>(undefined);

export const useMonkeyContext = () => {
  const context = useContext(MonkeyContext);
  if (context === undefined) {
    throw new Error('useMonkeyContext must be used within a MonkeyProvider');
  }
  return context;
};

interface MonkeyProviderProps {
  children: ReactNode;
}

export const MonkeyProvider: React.FC<MonkeyProviderProps> = ({ children }) => {
  const [showMonkeys, setShowMonkeys] = useState(false);

  const toggleMonkeys = () => {
    setShowMonkeys(!showMonkeys);
  };

  const value = {
    showMonkeys,
    toggleMonkeys,
    setShowMonkeys,
  };

  return (
    <MonkeyContext.Provider value={value}>
      {children}
    </MonkeyContext.Provider>
  );
};

import React from 'react';
import { AppProvider } from '../store/AppContext';
import { ErrorBoundary } from '../components/feedback/ErrorBoundary';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary>
      <AppProvider>
        {children}
      </AppProvider>
    </ErrorBoundary>
  );
};

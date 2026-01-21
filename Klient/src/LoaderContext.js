import React, { createContext, useState, useContext } from 'react';
import './Loader.css';

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = () => setLoadingCount(prev => prev + 1);
  const stopLoading = () => setLoadingCount(prev => Math.max(0, prev - 1));

  return (
    <LoaderContext.Provider value={{ startLoading, stopLoading }}>
      {children}
      {loadingCount > 0 && (
        <div className="loader-overlay">
          <div className="loader-text">wczytywanie…</div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};

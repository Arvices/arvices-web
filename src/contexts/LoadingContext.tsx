import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import "./loading.css";
import arvicesLogo from "../assets/logo.svg";
interface LoadingContextProps {
  loading: boolean;
  loadingText: string;
  setLoading: (isLoading: boolean) => void;
  setLoadingText: (text: string) => void;
}
const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined,
);
export const LoadingProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [loading, setLoadingState] = useState(false);
  const [loadingText, setLoadingTextState] = useState("");
  const setLoading = (isLoading: boolean) => {
    setLoadingState(isLoading);
    if (!isLoading) {
      setLoadingTextState("");
    }
  };
  const setLoadingText = (text: string) => {
    setLoadingTextState(text);
  };
  return (
    <LoadingContext.Provider
      value={{
        loading,
        loadingText,
        setLoading,
        setLoadingText,
      }}
    >
      {loading && (
        <div className="loading-overlay-bg">
          <div className="loading-container">
            <img
              src={arvicesLogo}
              alt="loading-logo"
              className="loading-logo"
            />
            {loadingText && <p className="loading-text">{loadingText}</p>}
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

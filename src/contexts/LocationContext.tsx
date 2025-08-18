import React, { createContext, useContext, ReactNode } from "react";
import { LocationData } from "../components/map/LocationInput";
const LOCAL_STORAGE_KEY = "user_location_data";
interface LocationContextType {
  saveLocationData: (data: LocationData) => void;
  getLocationData: () => LocationData | null;
  clearLocationData: () => void;
}
const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);
export const LocationProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const saveLocationData = (data: LocationData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };
  const getLocationData = (): LocationData | null => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  };
  const clearLocationData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };
  return (
    <LocationContext.Provider
      value={{
        saveLocationData,
        getLocationData,
        clearLocationData,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
export const useUserGeoLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useUserGeoLocation must be used within a LocationProvider",
    );
  }
  return context;
};

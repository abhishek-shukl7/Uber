import React, { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

const GoogleMapsContext = createContext();

export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    preventGoogleFontsLoading: true,
    id: 'google-map-script', // Unique ID prevents duplicate loading
  });

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

// Custom hook to use Google Maps context
export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

export default GoogleMapsProvider;
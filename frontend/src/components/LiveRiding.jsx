import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GoogleMap, DirectionsRenderer, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useGoogleMaps } from '../context//GoogleMapsProvider';
const containerStyle = {
  width: '100%',
  height: '100%'
};

const libraries = ['places'];

const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const watcherId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );

    return () => navigator.geolocation.clearWatch(watcherId);
  }, []);

  return { position, error };
};

const LiveRiding = ({ origin, destination }) => {
  const [directions, setDirections] = useState(null);
  const [directionsError, setDirectionsError] = useState(null);
  const { position: userPosition, error: geolocationError } = useGeolocation();
  const originFetchedRef = useRef(false);

  const { isLoaded, loadError } = useGoogleMaps();

  // ✅ Fixed: Only create mapOptions when Google is actually available
  const mapOptions = useMemo(() => {
    // Wait for both isLoaded AND window.google to be available
    if (!isLoaded || typeof window === 'undefined' || !window.google?.maps) {
      return {};
    }
    
    return {
      mapTypeControl: false,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: window.google.maps.ControlPosition.LEFT_BOTTOM,
      },
      zoomControl: true,
      streetViewControl: false,
    };
  }, [isLoaded]);

  // ✅ Memoized function to fetch directions
  const fetchDirections = useCallback(() => {
    if (!isLoaded || !userPosition || !destination || !window.google?.maps) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: userPosition,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          setDirectionsError(null);
        } else {
          console.error(`Error fetching directions: ${status}`, result);
          setDirectionsError(`Failed to get directions: ${status}`);
        }
      }
    );
  }, [isLoaded, userPosition, destination]);

  // ✅ Effect to fetch directions when dependencies change
  useEffect(() => {
    if (!originFetchedRef.current && userPosition && destination) {
      fetchDirections();
      originFetchedRef.current = true;
    }
  }, [fetchDirections, userPosition, destination]);

  // ✅ Effect to refetch directions if user position changes significantly
  useEffect(() => {
    if (originFetchedRef.current && userPosition) {
      // Only refetch if user has moved significantly (optional optimization)
      fetchDirections();
    }
  }, [fetchDirections, userPosition]);

  // ✅ Early returns after all hooks
  if (loadError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Map Error</h3>
        <p>Map cannot be loaded right now. Please check your internet connection and try again.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Loading...</h3>
        <p>Loading Google Maps...</p>
      </div>
    );
  }

  if (geolocationError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Location Error</h3>
        <p>Geolocation error: {geolocationError}</p>
        <p>Please enable location services and refresh the page.</p>
      </div>
    );
  }

  // ✅ Fallback center if no user position
  const center = userPosition || { lat: 40.756795, lng: -73.954298 };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={mapOptions}
      >
        {directions && (
          <DirectionsRenderer 
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#4285F4',
                strokeWeight: 5,
              }
            }}
          />
        )}
        
        {userPosition && !directions && (
          <Marker 
            position={userPosition} 
            label="📍"
            title="Your Location"
          />
        )}
      </GoogleMap>
      
      {directionsError && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          {directionsError}
        </div>
      )}
      
      {!userPosition && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          backgroundColor: '#ffd93d',
          color: '#333',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          Getting your location...
        </div>
      )}
    </div>
  );
};

export default LiveRiding;
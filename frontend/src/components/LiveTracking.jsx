import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { LoadScript, GoogleMap, Marker} from '@react-google-maps/api'
import { useGoogleMaps } from '../context/GoogleMapsProvider';

const containerStyle = {
    width : '100%',
    height : '100%'
}

const center = {
    lat: -3.745,
    lng: -38.523
}

const LiveTracking = () => {

    const [ currentPosition, setCurrentPosition ] = useState(center);
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

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude
            });
        },(error) => {
                console.log('Error getting geolocation.',error);
            }
        );
        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude
            });
        },(error) => {
                console.log('Error watching location.',error);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
        return () => {
            if (watchId && navigator.geolocation && typeof navigator.geolocation.clearWatch === 'function') {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    },[]);

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

    return (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center = {currentPosition}
                zoom={15} 
                options={mapOptions}
                >
                <Marker position={currentPosition}/>
            </GoogleMap>
      
    );
}

export default LiveTracking
import React, { useEffect, useState } from "react";
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

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
    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center = {currentPosition}
                zoom={15} >
                <Marker position={currentPosition}/>
            </GoogleMap>
            
        </LoadScript>
    );
}

export default LiveTracking
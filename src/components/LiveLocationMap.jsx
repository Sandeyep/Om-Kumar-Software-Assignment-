import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
};

const LiveLocationMap = ({ 
  location = { lat: 27.6851, lng: 85.3423 }, // Default to Baneshwor
  zoom = 15,
  onLocationSelect = null,
  isEditable = false 
}) => {
  const handleMapClick = (e) => {
    if (isEditable && onLocationSelect) {
      onLocationSelect({
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      });
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={zoom}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        <Marker
          position={location}
          title="Selected Location"
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveLocationMap;

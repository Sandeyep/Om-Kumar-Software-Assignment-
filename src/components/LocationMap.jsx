import React, { useEffect, useState } from 'react';

const LocationMap = () => {
  const [location, setLocation] = useState({
    lat: 27.6851,  // Default coordinates for Baneshwor
    lng: 85.3423
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to Baneshwor coordinates if geolocation fails
          setLocation({
            lat: 27.6851,
            lng: 85.3423
          });
        }
      );
    }
  }, []);

  const mapSrc = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.740457285521!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb199a06c2eaf9%3A0xc5670a9173e161de!2sBaneshwor%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1`;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Location Map"
      />
    </div>
  );
};

export default LocationMap;

import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRuler, FaWifi, FaParking, FaSwimmingPool, FaFan, FaArrowRight } from 'react-icons/fa';
import { MdSecurity, MdElevator, MdLocationOn } from 'react-icons/md';

const FlatCard = ({ flat }) => {
  if (!flat) return null;

  const amenityIcons = {
    wifi: <FaWifi className="w-4 h-4" />,
    parking: <FaParking className="w-4 h-4" />,
    pool: <FaSwimmingPool className="w-4 h-4" />,
    security: <MdSecurity className="w-4 h-4" />,
    elevator: <MdElevator className="w-4 h-4" />,
    ac: <FaFan className="w-4 h-4" />
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-red-100 text-red-800';
      case 'booked':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Ensure we have a valid image URL
  const imageUrl = flat.image || 'https://via.placeholder.com/400x300';
  const flatId = flat._id || flat.id; // Handle both _id and id

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
      {/* Property Image */}
      <Link to={`/flats/${flatId}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={flat.title || 'Property'}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300';
            }}
          />
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(flat.status)}`}>
              {flat.status || 'Available'}
            </span>
          </div>
          {/* Price Tag */}
          <div className="absolute bottom-2 left-2">
            <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
              Rs. {(flat.price || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </Link>

      {/* Property Details */}
      <div className="p-4">
        <Link to={`/flats/${flatId}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors line-clamp-1">
            {flat.title || 'Untitled Property'}
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-500 mt-1">
          <MdLocationOn className="w-4 h-4 mr-1" />
          <p className="text-sm truncate">{flat.location || 'Location not specified'}</p>
        </div>

        {/* Core Features */}
        <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 mt-2">
          <div className="flex items-center text-gray-600">
            <FaBed className="w-4 h-4 text-indigo-600" />
            <span className="text-sm ml-1">{flat.bedrooms || '0'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaBath className="w-4 h-4 text-indigo-600" />
            <span className="text-sm ml-1">{flat.bathrooms || '0'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaRuler className="w-4 h-4 text-indigo-600" />
            <span className="text-sm ml-1">{flat.size || '0'}ft²</span>
          </div>
        </div>

        {/* Amenities */}
        {flat.amenities && flat.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {flat.amenities.slice(0, 3).map((amenity, index) => (
              <div
                key={index}
                className="inline-flex items-center bg-gray-50 px-2 py-1 rounded text-xs text-gray-600"
                title={amenity}
              >
                {amenityIcons[amenity.toLowerCase()] || null}
                <span className="ml-1">{amenity}</span>
              </div>
            ))}
            {flat.amenities.length > 3 && (
              <div className="inline-flex items-center bg-gray-50 px-2 py-1 rounded text-xs text-gray-600">
                +{flat.amenities.length - 3}
              </div>
            )}
          </div>
        )}

        {/* View More Button */}
        <Link 
          to={`/flats/${flatId}`}
          className="flex items-center justify-between mt-3 py-2 px-4 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors group"
        >
          <span className="text-sm font-medium">View Details</span>
          <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default FlatCard;

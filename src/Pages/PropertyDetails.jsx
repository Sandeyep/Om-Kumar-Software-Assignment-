import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPhone, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import LiveLocationMap from '../components/LiveLocationMap';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);

    // Fetch property details
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/property/${id}`);
      setProperty(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property details:', error);
      toast.error('Failed to load property details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Property Image */}
          <div className="relative h-96">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Property Details */}
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                <p className="mt-2 text-gray-600">{property.location}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-indigo-600">Rs. {property.price}</p>
                <p className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    property.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Description</h2>
              <p className="mt-4 text-gray-600">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <FaInfoCircle className="mr-2" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Location Map */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              {isLoggedIn ? (
                <div className="mt-4 h-[400px] rounded-lg overflow-hidden">
                  <LiveLocationMap 
                    location={property.coordinates || { lat: 27.6851, lng: 85.3423 }}
                    zoom={16}
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <div className="relative">
                    <div className="h-[400px] rounded-lg overflow-hidden filter blur-[8px]">
                      <LiveLocationMap 
                        location={{ lat: 27.6851, lng: 85.3423 }} // Always show Baneshwor for non-logged in users
                        zoom={16}
                      />
                    </div>
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-800 font-medium mb-4">Sign in to view exact location</p>
                        <div className="space-x-4">
                          <Link
                            to="/login"
                            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/signup"
                            className="inline-block bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            Sign Up
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              {isLoggedIn ? (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-2" />
                    <span>{property.contact?.phone || 'Phone number not available'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-2" />
                    <span>{property.contact?.email || 'Email not available'}</span>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="relative">
                    <div className="filter blur-[8px] select-none">
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaPhone className="mr-2" />
                        <span>+977-9876543210</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2" />
                        <span>example@email.com</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-800 font-medium mb-4">Sign in to view contact information</p>
                        <div className="space-x-4">
                          <Link
                            to="/login"
                            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            to="/signup"
                            className="inline-block bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                          >
                            Sign Up
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

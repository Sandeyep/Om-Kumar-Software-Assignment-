import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath, FaCheck } from 'react-icons/fa';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('');

  const amenitiesList = [
    { id: 'parking', label: 'Parking', icon: '🚗' },
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'ac', label: 'AC', icon: '❄️' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { id: 'water', label: 'Water', icon: '💧' },
    { id: 'laundry', label: 'Laundry', icon: '👕' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'furnished', label: 'Furnished', icon: '🛋️' },
    { id: 'gym', label: 'Gym', icon: '💪' },
  ];

  const propertyTypes = [
    { id: 'flat', label: 'Flat', icon: '🏢' },
    { id: 'house', label: 'House', icon: '🏠' },
    { id: 'room', label: 'Room', icon: '🛏️' },
    { id: 'commercial', label: 'Commercial', icon: '🏪' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Available', color: 'bg-green-500' },
    { value: 'rented', label: 'Rented', color: 'bg-red-500' },
    { value: 'booked', label: 'Booked', color: 'bg-yellow-500' },
  ];

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/property/${id}`);
      const propertyData = response.data;
      setProperty(propertyData);
      setCurrentStatus(propertyData.status);
      
      // Set form values
      Object.keys(propertyData).forEach(key => {
        if (key !== 'amenities' && key !== 'owner' && key !== 'details') {
          setValue(key, propertyData[key]);
        }
      });

      // Set owner details
      setValue('ownerName', propertyData.owner.name);
      setValue('contactEmail', propertyData.owner.contactEmail);
      setValue('contactPhone', propertyData.owner.contactPhone);

      // Set property details
      setValue('bedrooms', propertyData.details.bedrooms);
      setValue('bathrooms', propertyData.details.bathrooms);
      setValue('totalArea', propertyData.details.totalArea.replace(' sq ft', ''));
      setValue('furnished', propertyData.details.furnished.toString());

      // Set amenities
      propertyData.amenities.forEach(amenity => {
        setValue(`amenities.${amenity.toLowerCase()}`, true);
      });

      if (propertyData.image) {
        setPreviewImages([propertyData.image]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property');
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(`http://localhost:4000/property/${id}`, {
        status: newStatus
      });
      setCurrentStatus(newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedData = {
        id: property.id,
        title: data.title,
        type: data.propertyType,
        image: previewImages[0] || property.image,
        description: data.description,
        location: data.location,
        price: data.price,
        amenities: Object.entries(data.amenities || {})
          .filter(([_, value]) => value)
          .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
        status: currentStatus,
        owner: {
          name: data.ownerName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone
        },
        details: {
          bedrooms: parseInt(data.bedrooms) || null,
          bathrooms: parseInt(data.bathrooms) || null,
          totalArea: `${data.totalArea} sq ft`,
          furnished: data.furnished === "true"
        }
      };

      await axios.put(`http://localhost:4000/property/${id}`, formattedData);
      toast.success('Property updated successfully');
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rented':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'booked':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/admin/properties')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Back to Properties
          </button>
          
          {/* Status Badge and Controls */}
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(currentStatus)} border`}>
              Current Status: {currentStatus?.charAt(0).toUpperCase() + currentStatus?.slice(1)}
            </span>
            <div className="flex items-center space-x-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium text-white transition-all
                    ${currentStatus === option.value ? option.color : 'bg-gray-400 hover:bg-gray-500'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
            <p className="text-sm text-gray-500 mt-1">Update property information and settings</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  {...register('title', { required: 'Title is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <select
                  {...register('propertyType', { required: 'Property type is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  {propertyTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {/* Location and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('location')}
                    className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price (NPR)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('price', { required: 'Price is required' })}
                    className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBed className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    {...register('bedrooms')}
                    className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBath className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    {...register('bathrooms')}
                    className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total Area (sq ft)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHome className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('totalArea')}
                    className="pl-10 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Furnished</label>
                <select
                  {...register('furnished')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Property Images</label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {previewImages.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload new images</span>
                      <input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesList.map(amenity => (
                  <label
                    key={amenity.id}
                    className="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      {...register(`amenities.${amenity.id}`)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3">
                      <span className="text-xl mr-2">{amenity.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{amenity.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                  <input
                    type="text"
                    {...register('ownerName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input
                    type="email"
                    {...register('contactEmail')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                  <input
                    type="text"
                    {...register('contactPhone')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/properties')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Update Property
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;

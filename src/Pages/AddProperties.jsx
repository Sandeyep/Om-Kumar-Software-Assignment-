import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import LiveLocationMap from '../components/LiveLocationMap';

const AddProperties = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [addedProperty, setAddedProperty] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleLocationSelect = (location) => {
    setValue('location', location.address);
    setValue('latitude', location.lat);
    setValue('longitude', location.lng);
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleFormSubmit = async (data) => {
    if (currentStep < 3) {
      nextStep();
      return;
    }

    try {
      setLoading(true);
      // Format the data according to db.json structure
      const formattedData = {
        id: Date.now().toString(),
        title: data.title,
        type: data.propertyType,
        image: previewImages[0],
        description: data.description,
        location: data.location,
        price: data.price,
        amenities: Object.entries(data.amenities || {})
          .filter(([_, value]) => value)
          .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
        status: "available",
        owner: {
          name: data.ownerName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone
        },
        details: {
          bedrooms: parseInt(data.bedrooms) || null,
          bathrooms: parseInt(data.bathrooms) || null,
          totalArea: (data.totalArea || "") + " sq ft",
          furnished: data.furnished === "true"
        }
      };

      const response = await axios.post('http://localhost:4000/property', formattedData);
      setAddedProperty(response.data);
      setShowSuccess(true);
      toast.success('Property added successfully!');
      
      // After successful submission
      setTimeout(() => {
        navigate('/admin/properties');
      }, 2000);
      reset(); // Reset form
      setSelectedImages([]);
      setPreviewImages([]);
      setSelectedPropertyType('');
      setCurrentStep(1);
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    setAddedProperty(null);
    reset();
    setSelectedImages([]);
    setPreviewImages([]);
    setSelectedPropertyType('');
    setCurrentStep(1);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Property Added Successfully!</h2>
              <p className="mt-2 text-gray-600">Your property has been listed successfully.</p>
            </div>

            {/* Property Preview */}
            {addedProperty && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Property Details:</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {previewImages[0] && (
                        <img
                          src={previewImages[0]}
                          alt={addedProperty.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-xl">{addedProperty.title}</h4>
                      <p className="text-gray-600">{addedProperty.description}</p>
                      <p className="text-indigo-600 font-semibold">NPR {addedProperty.price}</p>
                      <div className="text-sm text-gray-600">
                        <p>Contact: {addedProperty.owner.name}</p>
                        <p>Email: {addedProperty.owner.contactEmail}</p>
                        <p>Phone: {addedProperty.owner.contactPhone}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {addedProperty.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleAddAnother}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Another Property
              </button>
              <button
                onClick={() => navigate('/admin/properties')}
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Back to Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
            <p className="mt-2 text-gray-600">Fill in the details to list your property</p>
            
            {/* Progress Steps */}
            <div className="mt-8 flex justify-between items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step 
                      ? 'bg-indigo-600 text-white' 
                      : currentStep > step 
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step ? '✓' : step}
                  </div>
                  <div className={`ml-3 ${step === currentStep ? 'text-indigo-600 font-medium' : 'text-gray-500'}`}>
                    {step === 1 ? 'Basic Info' : step === 2 ? 'Details & Features' : 'Location & Images'}
                  </div>
                  {step < 3 && (
                    <div className="mx-4 flex-1 h-0.5 bg-gray-200">
                      <div className={`h-full bg-indigo-600 transition-all ${
                        currentStep > step ? 'w-full' : 'w-0'
                      }`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Property Title</label>
                  <input
                    type="text"
                    {...register('title', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter property title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (NPR)</label>
                  <input
                    type="number"
                    {...register('price', { required: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter price"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Property Type</label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    {propertyTypes.map(type => (
                      <label
                        key={type.id}
                        onClick={() => {
                          setSelectedPropertyType(type.id);
                          setValue('propertyType', type.id);
                        }}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors ${
                          selectedPropertyType === type.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          {...register('propertyType', { required: true })}
                          value={type.id}
                          className="sr-only"
                        />
                        <span className="text-xl mr-2">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                        {selectedPropertyType === type.id && (
                          <span className="ml-auto text-indigo-600">✓</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    {...register('description', { required: true })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter property description"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Details & Features */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {selectedPropertyType === 'commercial' ? 'Rooms' : 'Bedrooms'}
                    </label>
                    <input
                      type="number"
                      {...register('bedrooms')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder={selectedPropertyType === 'commercial' ? 'Number of rooms' : 'Number of bedrooms'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {selectedPropertyType === 'commercial' ? 'Washrooms' : 'Bathrooms'}
                    </label>
                    <input
                      type="number"
                      {...register('bathrooms')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder={selectedPropertyType === 'commercial' ? 'Number of washrooms' : 'Number of bathrooms'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Area</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="number"
                        {...register('totalArea')}
                        className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Total area"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">sq ft</span>
                      </div>
                    </div>
                  </div>
                </div>


{/* Amenities Section */}
<div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        {...register('ownerName', { required: true })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter owner name"
                      />
                      {errors.ownerName && (
                        <p className="mt-1 text-sm text-red-600">Owner name is required</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                      <input
                        type="email"
                        {...register('contactEmail', { 
                          required: true,
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter contact email"
                      />
                      {errors.contactEmail && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.contactEmail.type === 'pattern' ? 'Invalid email address' : 'Contact email is required'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <input
                        type="tel"
                        {...register('contactPhone', { 
                          required: true,
                          pattern: {
                            value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                            message: "Invalid phone number"
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="+977 98XXXXXXXX"
                      />
                      {errors.contactPhone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.contactPhone.type === 'pattern' ? 'Invalid phone number' : 'Contact number is required'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location & Images */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Location</label>
                    <LiveLocationMap onLocationSelect={handleLocationSelect} />
                    <input
                      type="text"
                      {...register('location')}
                      placeholder="Selected location will appear here"
                      className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Property Images</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload files</span>
                            <input
                              type="file"
                              multiple
                              onChange={handleImageChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>

                    {previewImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newPreviews = previewImages.filter((_, i) => i !== index);
                                setPreviewImages(newPreviews);
                                const newImages = selectedImages.filter((_, i) => i !== index);
                                setSelectedImages(newImages);
                              }}
                              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="submit"
                  className="ml-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-auto px-6 py-2 rounded-lg text-white transition-colors ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding Property...
                    </span>
                  ) : (
                    'Add Property'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperties;

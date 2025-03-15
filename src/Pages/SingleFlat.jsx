import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaBed, FaBath, FaRuler, FaWifi, FaParking, FaSwimmingPool, FaFan, FaArrowRight, FaChevronLeft, FaChevronRight, FaLock } from 'react-icons/fa';
import { MdSecurity, MdElevator, MdLocationOn } from 'react-icons/md';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from '../context/AuthContext';

const CustomArrow = ({ className, style, onClick, Icon }) => (
  <div
    className={`${className} !flex items-center justify-center !w-10 !h-10 !bg-black/50 hover:!bg-black/70 !rounded-full z-10`}
    style={{ ...style, display: 'flex' }}
    onClick={onClick}
  >
    <Icon className="text-white" size={20} />
  </div>
);

const SingleFlat = () => {
  const { user } = useAuth();
  const [flat, setFlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const mainSlider = useRef(null);
  const thumbnailSlider = useRef(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Main slider settings
  const mainSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    adaptiveHeight: true,
    className: "rounded-lg overflow-hidden shadow-sm",
    prevArrow: <CustomArrow Icon={FaChevronLeft} />,
    nextArrow: <CustomArrow Icon={FaChevronRight} />,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '10px', width: '100%', padding: '10px 0' }}>
        <ul className="flex justify-center gap-2 m-0"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <button className="!w-2.5 !h-2.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors">
        <span className="sr-only">Go to slide {i + 1}</span>
      </button>
    ),
    beforeChange: (current, next) => {
      setCurrentSlide(next);
      if (thumbnailSlider.current) {
        thumbnailSlider.current.slickGoTo(next);
      }
    }
  };

  // Thumbnail slider settings
  const thumbnailSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    prevArrow: <CustomArrow Icon={FaChevronLeft} />,
    nextArrow: <CustomArrow Icon={FaChevronRight} />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
        }
      }
    ]
  };

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/property/${id}`);
      setFlat(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError(error.message);
      toast.error('Failed to load property details');
      setLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity?.toLowerCase()) {
      case 'wifi': return <FaWifi size={16} />;
      case 'parking': return <FaParking size={16} />;
      case 'pool': return <FaSwimmingPool size={16} />;
      case 'ac': return <FaFan size={16} />;
      case 'security': return <MdSecurity size={16} />;
      case 'elevator': return <MdElevator size={16} />;
      default: return <FaArrowRight size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] pt-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] pt-16">
        <div className="text-center">
          <div className="text-red-500 mb-3">{error}</div>
          <Link to="/flats" className="text-indigo-600 hover:text-indigo-700">
            Return to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Create an array of images
  const images = flat?.image ? [flat.image] : [];
  if (flat?.additionalImages) {
    images.push(...flat.additionalImages);
  }

  const handleThumbnailClick = (index) => {
    if (mainSlider.current) {
      mainSlider.current.slickGoTo(index);
    }
    setCurrentSlide(index);
  };

  const toggleFullImage = () => {
    setShowFullImage(!showFullImage);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pt-20">
      {/* Title Section */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold mb-1 text-gray-800">
              {flat?.title}
            </h1>
            <div className="flex items-center text-gray-500 text-sm">
              <MdLocationOn size={16} />
              <p className="ml-1">{flat?.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Left Column - Image */}
        <div className="md:col-span-2 bg-white rounded-lg overflow-hidden">
          {images.length > 0 ? (
            images.length === 1 ? (
              <div className="relative cursor-pointer" onClick={toggleFullImage}>
                <img 
                  src={images[0]} 
                  alt={flat?.title}
                  className="w-full h-[400px] object-cover rounded-lg hover:opacity-95 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <div className="cursor-pointer" onClick={toggleFullImage}>
                    <Slider ref={mainSlider} {...mainSettings}>
                      {images.map((image, index) => (
                        <div key={index}>
                          <div className="relative aspect-video">
                            <img 
                              src={image}
                              alt={`${flat?.title} - Image ${index + 1}`}
                              className="w-full h-[400px] object-cover hover:opacity-95 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                              {index + 1} / {images.length}
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
                
                {/* Thumbnails */}
                <div className="px-2">
                  <Slider ref={thumbnailSlider} {...thumbnailSettings}>
                    {images.map((image, index) => (
                      <div key={index} className="px-1">
                        <button 
                          onClick={() => handleThumbnailClick(index)}
                          className={`relative w-full aspect-video rounded-md overflow-hidden ${
                            currentSlide === index ? 'ring-2 ring-indigo-500' : ''
                          }`}
                        >
                          <img 
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                          />
                        </button>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            )
          ) : (
            <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">
              <p className="text-gray-400">No image available</p>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-4">
          {/* Status and Price Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xl font-semibold text-gray-900">
                NPR {flat?.price?.toLocaleString()}
                <span className="text-sm text-gray-500 font-normal">/month</span>
              </div>
              <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                flat?.status === 'available' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {flat?.status?.charAt(0).toUpperCase() + flat?.status?.slice(1)}
              </div>
            </div>
            
            {/* Property Details */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-gray-50 rounded-md">
                  <FaBed className="text-gray-600" size={14} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Beds</div>
                  <div className="text-sm font-medium">{flat?.details?.bedrooms || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-gray-50 rounded-md">
                  <FaBath className="text-gray-600" size={14} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Baths</div>
                  <div className="text-sm font-medium">{flat?.details?.bathrooms || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-gray-50 rounded-md">
                  <FaRuler className="text-gray-600" size={14} />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Area</div>
                  <div className="text-sm font-medium">{flat?.details?.totalArea || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Combined Amenities and Contact */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            {/* Amenities Section */}
            {flat?.amenities && flat.amenities.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold mb-2 text-gray-800">Amenities</h2>
                <div className="grid grid-cols-2 gap-2">
                  {flat.amenities.map((amenity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-md text-gray-600"
                    >
                      {getAmenityIcon(amenity)}
                      <span className="text-xs capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-gray-100 mb-4"></div>

            {/* Contact Information */}
            <div className="relative">
              <h2 className="text-sm font-semibold mb-2 text-gray-800">Contact Information</h2>
              <div className={`space-y-2 ${!user ? 'blur-sm' : ''}`}>
                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-xs text-gray-500">Owner</div>
                  <div className="text-sm font-medium text-gray-700">{flat?.owner?.name || 'Not Available'}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm font-medium text-gray-700">{flat?.owner?.contactEmail || 'Not Available'}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="text-sm font-medium text-gray-700">{flat?.owner?.contactPhone || 'Not Available'}</div>
                </div>
              </div>
              
              {/* Login/Signup Overlay */}
              {!user && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded-lg">
                  <div className="flex justify-center mb-2">
                    <FaLock className="text-indigo-500" size={24} />
                  </div>
                  <p className="text-sm text-indigo-700 mb-4 text-center px-4">
                    Sign up or login to view contact information
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to="/login"
                      state={{ from: location.pathname }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      state={{ from: location.pathname }}
                      className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-sm font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Description */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-sm font-semibold mb-2 text-gray-800">About this property</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{flat?.description}</p>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={toggleFullImage}
        >
          <div className="relative max-w-7xl w-full">
            <button 
              onClick={toggleFullImage}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Slider {...mainSettings} autoplay={false}>
              {images.map((image, index) => (
                <div key={index}>
                  <img 
                    src={image}
                    alt={`${flat?.title} - Image ${index + 1}`}
                    className="w-full h-auto max-h-[90vh] object-contain"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleFlat;

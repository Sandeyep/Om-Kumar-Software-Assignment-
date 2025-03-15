import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FlatCard from './FlatCard';
import { toast } from 'react-hot-toast';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SimilarProperties = ({ currentFlatId, location, priceRange }) => {
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.offsetWidth * 0.8; // Scroll 80% of container width
    const newScrollPosition = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    container.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      if (!currentFlatId || !location || !priceRange) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:4000/property');
        const allProperties = response.data;
        
        // Filter out the current property and find similar ones
        const filtered = allProperties
          .filter(prop => prop._id !== currentFlatId) // Handle MongoDB _id
          .filter(prop => {
            if (!prop.location || !prop.price) return false;
            
            const isSimilarLocation = prop.location.toLowerCase().includes(location.toLowerCase());
            const price = parseFloat(prop.price);
            const currentPrice = parseFloat(priceRange);
            const priceThreshold = currentPrice * 0.2; // 20% threshold
            const isSimilarPrice = Math.abs(price - currentPrice) <= priceThreshold;
            
            return isSimilarLocation || isSimilarPrice;
          })
          .slice(0, 8); // Show up to 8 similar properties

        setSimilarProperties(filtered);
      } catch (error) {
        console.error('Error fetching similar properties:', error);
        toast.error('Failed to load similar properties');
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [currentFlatId, location, priceRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="h-8 w-8 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!similarProperties.length) {
    return null;
  }

  return (
    <div className="py-8 relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Properties</h2>
      
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-indigo-600 p-2 rounded-full shadow-md transition-all"
        aria-label="Scroll left"
      >
        <FaChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-indigo-600 p-2 rounded-full shadow-md transition-all"
        aria-label="Scroll right"
      >
        <FaChevronRight className="w-5 h-5" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {similarProperties.map((property) => (
          <div key={property._id} className="min-w-[300px] snap-start">
            <FlatCard flat={property} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;

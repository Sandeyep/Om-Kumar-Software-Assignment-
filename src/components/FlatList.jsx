import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlatCard from './FlatCard';
import { toast } from 'react-hot-toast';

const FlatList = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await axios.get('http://localhost:4000/property');
        setFlats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flats:', error);
        toast.error('Failed to load properties');
        setLoading(false);
      }
    };

    fetchFlats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
          <div className="mt-4 text-gray-600 text-sm">Loading properties...</div>
        </div>
      </div>
    );
  }

  if (!flats || flats.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <div className="text-gray-500">No properties available at the moment.</div>
        <p className="text-gray-400 mt-2">Please check back later for new listings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {flats.map((flat) => (
        <FlatCard key={flat.id} flat={flat} />
      ))}
    </div>
  );
};

export default FlatList;

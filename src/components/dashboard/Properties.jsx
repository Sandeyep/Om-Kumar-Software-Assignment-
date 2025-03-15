import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath, FaSearch, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:4000/property');
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`http://localhost:4000/property/${id}`);
        toast.success('Property deleted successfully');
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/properties/edit/${id}`);
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const getPriceRange = (price) => {
    const numPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    if (numPrice < 10000) return 'low';
    if (numPrice < 50000) return 'medium';
    return 'high';
  };

  const filteredProperties = properties.filter(property => {
    // Search term filter
    const matchesSearch = 
      (property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description?.toLowerCase().includes(searchTerm.toLowerCase()));

    // Property type filter
    const matchesType = filterType === 'all' || property.type?.toLowerCase() === filterType.toLowerCase();

    // Price range filter
    const matchesPriceRange = priceRange === 'all' || getPriceRange(property.price) === priceRange;

    // Status filter
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;

    return matchesSearch && matchesType && matchesPriceRange && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
        <p className="text-gray-500 mt-2">Manage and monitor property listings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          {/* Search and Filter Section */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <Link
                to="/admin/properties/add"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 whitespace-nowrap"
              >
                Add Property
              </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-400" />
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="house">House</option>
                  <option value="flat">Flat</option>
                  <option value="room">Room</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <FaDollarSign className="text-gray-400" />
                <select 
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under NPR 10,000</option>
                  <option value="medium">NPR 10,000 - 50,000</option>
                  <option value="high">Over NPR 50,000</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <FaHome className="text-gray-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-20 w-20 flex-shrink-0">
                          <img
                            src={property.image || 'https://via.placeholder.com/150'}
                            alt={property.title}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">
                            <FaMapMarkerAlt className="inline mr-1" />
                            {property.location || 'No location specified'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-4">
                          <span><FaBed className="inline mr-1" />{property.details?.bedrooms || 0} Beds</span>
                          <span><FaBath className="inline mr-1" />{property.details?.bathrooms || 0} Baths</span>
                          <span><FaHome className="inline mr-1" />{property.details?.totalArea || '0 sq ft'}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Type: {property.type?.charAt(0).toUpperCase() + property.type?.slice(1) || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(property.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(property.status)}`}>
                        {property.status?.charAt(0).toUpperCase() + property.status?.slice(1) || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(property.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <FaHome className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {(searchTerm || filterType !== 'all' || priceRange !== 'all' || statusFilter !== 'all')
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding a new property'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;

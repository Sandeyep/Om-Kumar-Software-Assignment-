import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaHome, FaCheckCircle, FaTags } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    availableProperties: 0,
    propertyTypes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    data: []
  });
  const [propertyTypeData, setPropertyTypeData] = useState({
    labels: [],
    data: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch properties
      const propertiesResponse = await axios.get('http://localhost:4000/property');
      const properties = propertiesResponse.data;

      // Fetch users
      let users = [];
      try {
        const usersResponse = await axios.get('http://localhost:4000/users');
        users = usersResponse.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }

      // Calculate stats
      const availableProperties = properties.filter(p => p.status === 'available').length;
      const propertyTypes = [...new Set(properties.map(p => p.type).filter(Boolean))];

      setStats({
        totalUsers: users.length,
        totalProperties: properties.length,
        availableProperties,
        propertyTypes: propertyTypes.length,
      });

      // Set recent properties
      setRecentProperties(properties.slice(-5).reverse());

      // Calculate monthly data
      const monthlyStats = calculateMonthlyStats(properties);
      setMonthlyData({
        labels: monthlyStats.labels,
        datasets: [{
          label: 'New Properties',
          data: monthlyStats.data,
          borderColor: 'rgb(99, 102, 241)',
          tension: 0.1
        }]
      });

      // Calculate property type data
      const typeStats = calculatePropertyTypeStats(properties);
      setPropertyTypeData({
        labels: typeStats.labels,
        datasets: [{
          label: 'Properties by Type',
          data: typeStats.data,
          backgroundColor: [
            'rgba(99, 102, 241, 0.5)',
            'rgba(16, 185, 129, 0.5)',
            'rgba(245, 158, 11, 0.5)',
            'rgba(239, 68, 68, 0.5)'
          ]
        }]
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyStats = (properties) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = new Array(12).fill(0);

    properties.forEach(property => {
      const date = new Date(property.createdAt);
      monthCounts[date.getMonth()]++;
    });

    return {
      labels: months,
      data: monthCounts
    };
  };

  const calculatePropertyTypeStats = (properties) => {
    const typeCounts = {};
    properties.forEach(property => {
      typeCounts[property.type] = (typeCounts[property.type] || 0) + 1;
    });

    return {
      labels: Object.keys(typeCounts),
      data: Object.values(typeCounts)
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome to your dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FaUsers className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaHome className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Properties</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalProperties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available Properties</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.availableProperties}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaTags className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Property Types</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.propertyTypes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Property Listings</h3>
          <Line data={monthlyData} />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties by Type</h3>
          <Bar data={propertyTypeData} />
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Properties</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {property.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs. {property.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

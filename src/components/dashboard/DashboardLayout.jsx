import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaBuilding, FaTags, FaSignOutAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { path: '/admin/properties', icon: <FaBuilding />, label: 'Properties' },
    { path: '/admin/categories', icon: <FaTags />, label: 'Categories' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 shadow-lg flex flex-col">
        <div className="p-4 border-b border-indigo-800">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-indigo-500">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-indigo-600 shadow-sm">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-xl font-semibold text-white">
              Admin Dashboard
            </h1>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-indigo-100 hover:text-white transition-colors"
            >
              <span className="mr-2">Visit Site</span>
              <FaExternalLinkAlt />
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-lg">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

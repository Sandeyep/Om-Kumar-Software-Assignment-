import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';

  // If we're already on the login page, don't redirect again
  if (!isAuthenticated && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return children;
};

export default AdminRoute;

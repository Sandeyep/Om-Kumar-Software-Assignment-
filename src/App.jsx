import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Flats from './Pages/Flats';
import SingleFlat from './Pages/SingleFlat';
import AddProperties from './Pages/AddProperties';
import Users from './components/dashboard/Users';
import Properties from './components/dashboard/Properties';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Categories from './components/dashboard/Categories';
import AdminLogin from './components/dashboard/AdminLogin';
import AdminRoute from './components/dashboard/AdminRoute';
import Dashboard from './components/dashboard/Dashboard';
import EditProperty from './components/dashboard/EditProperty';
import './styles/slider.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            {/* Public Routes with Navbar */}
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/flats" element={<><Navbar /><Flats /></>} />
            <Route path="/login" element={<><Navbar /><Login /></>} />
            <Route path="/signup" element={<><Navbar /><Signup /></>} />
            <Route path="/flats/:id" element={<><Navbar /><SingleFlat /></>} />

            {/* Admin Routes without Navbar */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <DashboardLayout />
                </AdminRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="properties" element={<Properties />} />
              <Route path="properties/add" element={<AddProperties />} />
              <Route path="properties/edit/:id" element={<EditProperty />} />
              <Route path="categories" element={<Categories />} />
            </Route>
          </Routes>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
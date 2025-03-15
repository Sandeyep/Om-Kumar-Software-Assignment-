import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    // Store the previous path before login
    const previousPath = location.state?.from || '/';
    sessionStorage.setItem('previousPath', previousPath);
  }, [location]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.get('http://localhost:4000/users');
      const user = response.data.find(u => u.email === data.email && u.password === data.password);
      
      if (user) {
        // Use AuthContext login method
        login(user);
        
        // Dispatch a custom event for navbar update
        window.dispatchEvent(new Event('userLogin'));
        toast.success('Login successful');

        // Retrieve and navigate to the previous path
        const previousPath = sessionStorage.getItem('previousPath') || '/';
        sessionStorage.removeItem('previousPath');
        navigate(previousPath);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.log(error);
      toast.error('Login failed');
    }
  };

  return (
    <div className='h-[110vh] bg-slate-100 flex justify-center items-center'>
      <Toaster />
      <div className='border shadow-md rounded-xl p-10 max-w-lg w-full bg-white'>
        <h1 className='text-3xl text-center font-semibold text-indigo-500'>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
          <div className="space-y-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register('email', { 
                required: "Email is required*",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className='w-full p-2 border rounded'
            />
            <p>{errors.email && <span className='text-sm italic text-red-500'>{errors.email.message}</span>}</p>
          </div>
          <div className="space-y-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register('password', { 
                required: "Password is required*",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className='w-full p-2 border rounded'
            />
            <p>{errors.password && <span className='text-sm italic text-red-500'>{errors.password.message}</span>}</p>
          </div>
          <button
            className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition-colors'
            type='submit'
            disabled={isSubmitting}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

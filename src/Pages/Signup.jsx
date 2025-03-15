import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      // Correct the endpoint to match the structure in db.json
      const checkUser = await axios.get(`http://localhost:4000/users?email=${values.email}`);
      if (checkUser.data.length > 0) {
        toast.error("Email already registered");
        return;
      }

      const formData = {
        fullname: values.fullname,
        username: values.username,
        email: values.email,
        password: values.password,
      };

      await axios.post("http://localhost:4000/users", formData); // Ensure this endpoint matches db.json structure
      toast.success("Signed up successfully");
      reset();
      navigate('/login'); // Navigate to the login page after successful registration
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to sign up");
    }
  };

  return (
    <div className='h-[110vh] bg-slate-100 flex justify-center items-center'>
      <Toaster />
      <div className='border shadow-md rounded-xl p-10 max-w-lg w-full bg-white'>
        <h1 className='text-3xl text-center font-semibold text-indigo-500'>Sign Up</h1>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
          <div className="space-y-1">
            <label htmlFor='fullname'>Full Name</label>
            <input
              type="text"
              id="fullname"
              placeholder="Add your fullname"
              {...register('fullname', { required: "Full name is required*" })}
              className='w-full p-2 border rounded'
            />
            <p>{errors.fullname && <span className='text-sm italic text-red-500'>{errors.fullname.message}</span>}</p>
          </div>
          <div className="space-y-1">
            <label htmlFor='username'>Username</label>
            <input
              type="text"
              id="username"
              placeholder="Add your username"
              {...register('username', { required: "Username is required*" })}
              className='w-full p-2 border rounded'
            />
            <p>{errors.username && <span className='text-sm italic text-red-500'>{errors.username.message}</span>}</p>
          </div>
          <div className="space-y-1">
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id="email"
              placeholder="Add your email"
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
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id="password"
              placeholder="Add your password"
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
            className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
            type='submit'
            disabled={isSubmitting}>
            Sign Up
          </button>
          <p className='text-center'>
            Already have an account? 
            <Link to='/login' className='text-indigo-500'> Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className='border shadow-md p-4 fixed top-0 left-0 right-0 bg-white z-10'>
            <div className='grid grid-cols-3 items-center max-w-7xl mx-auto'>
                {/* Left */}
                <Link to='/'>
                    <div className='text-2xl font-bold'>KHOJA</div>
                </Link>

                {/* Middle */}
                <ul className='flex justify-center gap-4 font-md text-lg'>
                    <Link to='/'>
                        <li>Home</li>
                    </Link>
                    <Link to='/Flats'>
                        <li>Flats</li>
                    </Link>
                </ul>

                {/* Right */}
                <div className='flex justify-end gap-4 font-semibold text-md items-center'>
                    {user ? (
                        <>
                            <span className="text-gray-700">{user.name || 'User'}</span>
                            <button
                                onClick={handleLogout}
                                className='bg-red-500 border rounded-md h-10 px-6 text-white hover:bg-red-600 transition-colors'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to='/signup'>
                                <button className='bg-indigo-500 border rounded-md h-10 w-40 text-white p-2 hover:bg-indigo-600 transition-colors'>
                                    Sign Up
                                </button>
                            </Link>
                            <Link to='/login'>
                                <button className='bg-slate-500 border rounded-md h-10 w-40 text-white p-2 hover:bg-slate-600 transition-colors'>
                                    Login
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;

import React from 'react'
import { Link } from 'react-router-dom'

const HomeCard = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10 my-5'>
      <div className='border rounded-xl p-4 shadow-md bg-indigo-100 space-y-4'>
        <h1>For Customer</h1>
        <p>Find Your Dream Property!</p>
        <button className='bg-slate-500 border rounded-md h-10 w-40 text-white p-2'>
          <Link to='/Flats'>
          Search Property
          </Link>
          </button>
      </div>
      <div className='border rounded-xl p-4 shadow-md bg-indigo-100 space-y-4'>
        <h1>For Publisher</h1>
        <p>Publish Your Property!</p>
        <button className='bg-slate-500 border rounded-md h-10 w-40 text-white p-2'>
        <Link to='/AddFlat'>
          Sell Property
          </Link>
          </button>
      </div>
    </div>
    
  )
}

export default HomeCard

import React from 'react'
import FlatList from '../components/FlatList'

const Flats = () => {
  return (
    <div className='max-w-6xl mx-auto my-20'>
      <h1 className='text-xl font-bold'>FLATS</h1>
      <div>
        <label htmlFor="type"> FILLTER BY TYPE </label>
        <select name="type" id="type">
          <option value="ALL-Types">All Types</option>
          <option value="House">House</option>
          <option value="Flat">Flat</option>
          <option value="Room">Room</option>
        </select>
      </div>
      <div className=' border border-gray-100 my-2'>
      </div>
        <FlatList/>
    </div>
  )
}

export default Flats


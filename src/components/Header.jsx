import React, { useState } from 'react';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';


const Header = () => {
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);


  const handleSearch = () => {
    // Implement search functionality here
    console.log(`Searching for ${propertyType} in ${location}`);
  };
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <div className='h-[55vh] bg-indigo-500 rounded-xl shadow-md flex flex-col justify-center items-center' 
         style={{ backgroundImage: 'url(https://cdn.apartmenttherapy.info/image/upload/v1619013756/at/house%20tours/2021-04/Erin%20K/KERR-130-CLARKSON-2R-01-020577-EDIT-WEB.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className='text-center text-white space-y-4 bg-indigo-500 bg-opacity-70 p-9 rounded-xl'>
        <h1 className='text-4xl font-bold uppercase'>Find Your New Property!</h1>
        <div className='flex space-x-4 items-center bg-white p-4 rounded-xl shadow-md'>
          <div className='flex items-center space-x-2 relative'>
            <i className='fas fa-calendar-alt text-indigo-500'></i>
            <input
              type='text'
              readOnly
              placeholder='Select Dates'
              value={date.toDateString()}
              className='p-2 rounded border border-gray-300 text-black'
              onClick={toggleCalendar}
            />
            {showCalendar && (
              <div className='absolute top-12'>
                <Calendar
                  onChange={setDate}
                  value={date}
                  className='rounded border border-gray-300 text-black'
                />
              </div>
            )}
          </div>
           <div className='flex items-center space-x-2'>
            <i className='fas fa-users border-indigo-50'></i>
            <select
              id='property-type'
              className='p-2 rounded border text-black'
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value=''>Select Property</option>
              <option value='room'>Room</option>
              <option value='flat'>Flat</option>
              <option value='house'>House</option>
              <option value='land'>Land</option>
            </select>
          </div>
          <div className='flex items-center space-x-2'>
            <i className='fas fa-users border-indigo-50'></i>
            <select
              id='location'
              className='p-2 rounded border text-black'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option  value=''>Select Location</option>
              <option value='kathmandu'>Kathmandu</option>
              <option value='pokhara'>Pokhara</option>
              <option value='lalitpur'>Lalitpur</option>
              <option value='dhading'>Dhading</option>
              <option value='bhaktapur'>Bhaktapur</option>
            </select>
          </div>
          <button
            className='py-2 px-4 bg-indigo-500 text-white font-bold rounded'
            onClick={handleSearch}
          >
            Search Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;

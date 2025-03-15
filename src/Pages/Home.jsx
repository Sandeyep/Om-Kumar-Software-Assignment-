import React from 'react'
import Header from '../components/Header'
import HomeCard from '../components/HomeCard'
import FlatList from '../components/FlatList'

const Home = () => {
  return (
    <div className='max-w-6xl mx-auto p-4 my-20'>
      <Header/>
      <HomeCard/>
      <div>
        <h1 className='text-2xl font-bold text-slate-700 my-9'>Latest Properties</h1>
        <FlatList/>
      </div>
    </div>
  )
}

export default Home

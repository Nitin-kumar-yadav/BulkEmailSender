import React from 'react'
import { Link } from 'react-router-dom'
import Card from './Card'

const Dashboard = () => {
  return (
    <div className='h-screen w-full'>
      <div className='flex justify-between items-center mx-5'>
        <h1 className='text-2xl font-bold text-(--bg-secondary) font-comfortaa'>Dashboard</h1>
        <Link to="/compose" className='bg-blue-500 text-white px-4 py-2 rounded'>New Campaign</Link>
      </div>
      <div className='flex flex-wrap justify-center gap-5 mx-5 mt-2'>
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  )
}

export default Dashboard
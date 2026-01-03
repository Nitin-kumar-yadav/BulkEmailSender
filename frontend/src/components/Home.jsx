import React from 'react'
import Card from './Card'
import Footer from './Footer'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <div className='min-h-screen flex flex-col w-1/2 items-center justify-center text-center m-auto '>
        <div className='text-7xl font-bold font-space-grotesk leading-16 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-transparent bg-clip-text'>Free bulk email sender
          with zero investment <span className='text-blue-500'>🚀</span>
        </div>
        <div className='text-4xl font-medium font-space-grotesk pt-8'>Send bulk emails to your
          customers with zero investment
        </div>
        <Link to='/signup' className='bg-(--bg-tertiary) text-white px-4 py-3 rounded-full mt-4 font-medium font-space-grotesk hover:bg-(--bg-secondary) hover:cursor-pointer transition-all duration-300 w-[200px] h-[50px]'>Get Started</Link>
      </div>
      <div className='h-full w-1/2 m-auto flex flex-col items-center justify-center text-center'>
        <div className='w-full '>
          <h1 className='text-4xl font-bold font-comfortaa leading-16'>Free bulk email software -
            15,000 mass emails monthly
          </h1>
          <p className='text-2xl font-medium font-space-grotesk pt-8'>Send bulk emails to your
            customers with zero investment
          </p>
        </div>
        <Card />
      </div>
      <Footer />
    </>
  )
}

export default Home
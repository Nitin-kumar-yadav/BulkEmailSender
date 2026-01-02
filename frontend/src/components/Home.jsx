import React from 'react'

const Home = () => {
  return (
    <>
      <div className='min-h-screen flex flex-col w-1/2 items-center justify-center text-center m-auto '>
        <div className='text-5xl font-bold font-press-start leading-16'>Free bulk email sender
          with zero investment <span className='text-blue-500'>🚀</span>
        </div>
        <div className='text-4xl font-medium font-space-grotesk pt-8'>Send bulk emails to your
          customers with zero investment
        </div>
        <button className='bg-(--bg-tertiary) text-white px-4 py-2 rounded-full mt-4 font-medium font-space-grotesk hover:bg-(--bg-secondary) hover:cursor-pointer transition-all duration-300 w-[200px] h-[50px]'>Get Started</button>
      </div>
      <div className='w-1/2 m-auto flex flex-col items-center justify-center text-center'>
        <div className='w-full '>
          <h1 className='text-4xl font-bold font-comfortaa leading-16'>Free bulk email software -
            15,000 mass emails monthly
          </h1>
          <p className='text-2xl font-medium font-space-grotesk pt-8'>Send bulk emails to your
            customers with zero investment
          </p>
        </div>
      </div>
      <footer className='flex flex-row items-center justify-center gap-15 mt-10'>
        <div className='flex flex-col items-start gap-2'>
          <h3 className='text-2xl font-bold font-comfortaa text-(--bg-tertiary) leading-16'>Services</h3>
          <ul className='text-xl font-medium font-space-grotesk'>
            <li>bulk email sender</li>
            <li>Automated email</li>
            <li>Mass email sender</li>
            <li>Google Gemini Support</li>
          </ul>
        </div>
        <div className='flex flex-col items-start gap-2'>
          <h3 className='text-2xl font-bold font-comfortaa text-(--bg-tertiary) leading-16'>Features</h3>
          <ul className='text-xl font-medium font-space-grotesk'>
            <li>Use AI to write emails</li>
            <li>Use your own email</li>
            <li>Email Templates</li>
            <li>Uploat CSV file</li>
          </ul>
        </div>
      </footer>
    </>
  )
}

export default Home
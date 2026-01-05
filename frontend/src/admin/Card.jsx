import React from 'react'
import { LuSend } from "react-icons/lu";

const Card = () => {
    return (
        <div className='flex justify-between items-center p-4 rounded-lg border-secondary/20 shadow-md hover:bg-secondary/20 transition-all dark:bg-(--bg-primary) light:bg-(--bg-quaternary) w-64 h-35'>
            <div className='flex flex-col gap-2'>
                <h4 className='text-sm font-semibold font-comfortaa'>Total Sent Today</h4>
                <h2 className='text-3xl font-bold font-comfortaa'>120</h2>
                <p className='text-sm text-gray-500 font-comfortaa'>Across 10 Campaigns</p>
            </div>
            <div>
                <LuSend size={30} />
            </div>
        </div>
    )
}

export default Card
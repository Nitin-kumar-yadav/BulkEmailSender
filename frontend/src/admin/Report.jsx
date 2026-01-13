import React from 'react'

const Report = () => {
    return (
        <div className='flex flex-col justify-center items-center mx-5 w-full overflow-x-auto'>
            <h1 className='text-2xl font-bold'>Report</h1>
            <table className='w-[60%] border border-gray-200 mt-2'>
                <thead className='border border-gray-200 p-2'>
                    <tr className='border border-gray-200 p-2'>
                        <th className='border border-gray-200 p-2'>Sl No</th>
                        <th className='border border-gray-200 p-2'>Email</th>
                        <th className='border border-gray-200 p-2'>Subject</th>
                        <th className='border border-gray-200 p-2'>Body</th>
                        <th className='border border-gray-200 p-2'>Created At</th>
                        <th className='border border-gray-200 p-2'>Status</th>
                    </tr>
                </thead>
                <tbody className='border border-gray-200 p-2'>
                    <tr className='border border-gray-200 p-2'>
                        <td className='border border-gray-200 p-2'>1</td>
                        <td className='border border-gray-200 p-2'>nitin@gmail.com</td>
                        <td className='border border-gray-200 p-2'>Subject</td>
                        <td className='border border-gray-200 p-2'>Body</td>
                        <td className='border border-gray-200 p-2'>2026-01-13 21:23:43</td>
                        <td className='border border-gray-200 p-2'>Sent</td>
                    </tr>
                </tbody>

            </table>
        </div>
    )
}

export default Report
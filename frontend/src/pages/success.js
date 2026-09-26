import React from 'react'
import successImage from'../assest/success.gif'
import { Link } from 'react-router-dom'
const success = () => {
  return (
<div className='w-full h-screen flex justify-center items-center'>
        <div className='flex flex-col items-center p-2'>
            <img src={successImage} width={150} height={150} alt="Success" />
            <p className='text-green-500 font-medium text-md mt-3'>Payment Successfully</p>
            <Link to={'/account/order'} className='cursor-pointer p-2 px-3 mt-5 border-2 border-green-400 rounded font-semibold text-green-400 hover:bg-green-600 hover:text-white transition'>See order</Link>
        </div>
    </div>
  )
}

export default success

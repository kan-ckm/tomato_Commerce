import React from 'react'
import cancelImage from'../assest/cancel.gif'
import { Link } from 'react-router-dom'
const Cancel = () => {
  return (
   <div className='w-full h-screen flex justify-center items-center'>
           <div className='flex flex-col items-center p-2'>
               <img src={cancelImage} width={150} height={150} alt="Cancel" className='mix-blend-multiply' />
               <p className='text-red-500 font-medium text-md mt-3'>Payment Cancel</p>
               <Link to={'/cart'} className='cursor-pointer p-2 px-3 mt-5 border-2 border-red-400 rounded font-semibold text-red-400 hover:bg-red-600 hover:text-white transition'>Go To Cart</Link>
           </div>
       </div>
  )
}

export default Cancel

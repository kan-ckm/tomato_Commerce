import React from 'react'
import { Link } from 'react-router-dom'
import { Link as ScrollLink } from "react-scroll";


const NavigationBar = () => {
  return (
    <div className= 'w-full bg-slate-600 shadow-lg text-sm '>
     <nav className=''>
        <ul className='flex justify-start py-4 gap-5 px-32 text-white'>
            <Link to={"/"}><li className=' hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500'><a href="#">Home</a></li></Link>
            <li className=' hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500'><a href="#">Store</a></li>
            <ScrollLink smooth={true} duration={500} to='shop-list'>  <li className=' hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500'>Categories</li></ScrollLink>
            <li className=' hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500'><a href="#">Blogs</a></li>
            <li className=' hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500'><a href="#">Contact</a></li>
        </ul>
    </nav>
    </div>


  )
}

export default NavigationBar

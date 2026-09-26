import React from 'react'
import { FaFacebook, FaGithub } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";
import Logo from './Logo';
import { Link } from "react-router-dom";
import footer from '../styles/footer.css'
const Footer = () => {
  
  return (
    <footer className='relative text-white bg-black'>
      <div className='footer w-full overflow-hidden min-h-[500px] flex flex-col justify-start'>
        
        <div className="w-full overflow-hidden">
          <svg className="block w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,
            82.39-16.72,168.19-17.73,250.45-.39C823.78,31,
            906.67,72,985.66,92.83c70.05,18.48,
            146.53,26.09,214.34,3V0H0V27.35A600.21,
            600.21,0,0,0,321.39,56.44Z" className="fill-yellow-400"></path>
          </svg>
        </div>

        <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-14 px-6 py-10'>
          <div className='flex flex-col'>
            <div className='h-16 container mx-auto flex items-center px-4 justify-between'>
              <Link to={"/"}>
                <Logo w={120} h={80} />
              </Link>
            </div>
            <p>
              Tomato Shop is your trusted online store for high-quality products at fair prices.
              We prioritize customer satisfaction and exceptional service every step of the way.
            </p>
          </div>

          <div className='flex flex-col'>
            <ul>
              <li className='text-[22px] font-semibold text-yellow-400 py-2 uppercase'>About Us</li>
              <li className='my-4'><Link to="/about">Our Story</Link></li>
              <li className='my-4'><Link to="/contact">Contact</Link></li>
              <li className='my-4'><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li className='my-4'><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>

          <div className='flex flex-col'>
            <ul>
              <li className='text-[22px] font-semibold text-yellow-400 py-2 uppercase'>Support</li>
              <li className='my-4'><Link to="/faq">FAQs</Link></li>
              <li className='my-4'><Link to="/shipping">Shipping Info</Link></li>
              <li className='my-4'><Link to="/returns">Return Policy</Link></li>
              <li className='my-4'><Link to="/support">Help Center</Link></li>
            </ul>
          </div>

          <div className='flex flex-col'>
            <ul>
              <li className='text-[22px] font-semibold text-yellow-400 py-2 uppercase'>Contact</li>
              <li className='my-4'>Email: at2356116@gmail.com</li>
              <li className='my-4'>Phone: +84 086-926-1500</li>
              <li className='my-4'>Address: 123 ABC Street, District XYZ, Ho Chi Minh City</li>
            </ul>

            <div className='flex space-x-4 mt-2'>
              <a href='https://www.facebook.com/tomato.tomato.289738?mibextid=ZbWKwL' className='text-white hover:text-yellow-400 transition-transform duration-150 transform hover:scale-150'><FaFacebook /></a>
              <a href='#' className='text-white hover:text-yellow-400 transition-transform duration-150 transform hover:scale-150'><FaGithub /></a>
              <a href='#' className='text-white hover:text-yellow-400 transition-transform duration-150 transform hover:scale-150'><FaSquareXTwitter /></a>
              <a href='#' className='text-white hover:text-yellow-400 transition-transform duration-150 transform hover:scale-150'><SiZalo /></a>
            </div>
          </div>
        </div>

        <div className="text-center py-4 text-sm text-gray-400 border-t border-gray-600 mt-10">
          © 2025 Tomato Shop. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer

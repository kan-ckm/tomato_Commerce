import React, { useEffect } from 'react'
import AOS from 'aos';
import { Link, useNavigate, useLocation } from "react-router-dom";
import 'aos/dist/aos.css';
import scrollTop from'../../helpers/scrollTop'
const FeaturedBanner6 = ({data,category}) => {
  useEffect(() => {
    AOS.init({
      duration:1500,
      once: false,         
       
      offset: 150,
    });
  
    AOS.refresh();
  }, []);
  const clickScrollTop=() =>{
    scrollTop();
  }
  return (
    <div className='min-h-[500px] flex justify-center items-center py-12'>
      <div  className='container'>
        <div
           style={{ background: 'linear-gradient(#2a0845 , #0f2027)' }}

            className='grid grid-cols-1 md:grid-cols-3 gap-6 items-center rounded-3xl shadow-sm'
        >
                <div className='p-6 sm:p-8'>
          <p data-aos="slide-right" className='text-sm text-white'>{data.discount}</p>
          <h1 data-aos="zoom-out" className='uppercase text-4xl lg:text-7xl font-bold text-white '>{" "}{data.title}</h1>
          <p data-aos="fade-up" className='text-sm text-white'>{data.date}</p>
        </div>
                <div data-aos="zoom-in" className='h-full flex items-center'>
          <img src={data.image} alt="featured banner" className='scale-125  w-[250px] md:w-[340px] mx-auto drop-shadow-[0_12px_8px_rgba(0,0,0,0.7)] object-cover' />
        </div>
                <div data-aos="zoom-out" className='flex flex-col justify-center gap-4 p-6 sm:p-8'>
          <p data-aos="fade-up" className='font-bold text-xl text-white'>{data.title2}</p>
          <p data-aos="fade-up" className='text-3xl sm:text-5xl font-bold text-white'>{data.title3}</p>
          <p className='text-sm tracking-wide leading-5 text-white'>{data.title4}</p>
          <div data-aos="fade-up" data-aos-delay="0">
            <Link to={`/product-category/${category}`}>
            <button style={{color:data.bgColor}} className=' py-2 px-4 bg-black  hover:bg-[#111] transition  hover:scale-110 duration-500 rounded-full'  onClick={()=>clickScrollTop()}>
            Shop Now
              </button>
              </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedBanner6

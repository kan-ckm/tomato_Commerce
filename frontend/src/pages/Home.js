import React, { useState, useEffect } from 'react';

import GridMotion from './GridMotion';
import Categorylist from '../components/CategoryList';
import BanerProduct from '../components/Banner/BanerProduct';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import headphone from '../assest/banner/tai-nghe-chup-tai-sony-wh-1000xm5-3-removebg-preview.png'
import smartwatch from '../assest/banner/text_ng_n_25__1_9-removebg-preview.png'
import monitor from '../assest/banner/text_ng_n_60__1_7-removebg-preview.png'
import laptop from '../assest/banner/text_ng_n_13__5-removebg-preview.png'
import airpods from '../assest/banner/tai-nghe-khong-day-soundpeats-air-4-pro_4_-removebg-preview.png'
import tivi from '../assest/banner/smart-tivi-lg-nanocell-50nano8tsa-4k-50-inch-2024_7__1-removebg.png'
import ipad from '../assest/banner/ipad-air-6-m2-11-inch-512gb-5g_2_-removebg-preview.png'
import card from '../assest/banner/myiyvmrjgkjcmwri99cb-removebg-preview.png'
import pc from '../assest/banner/bo2kkzo55dubkp4cva0x.-removebg-preview.png'
import mouse from '../assest/banner/2020_9_28_637369024453531270_Zadez_G156M-1-removebg-preview.png'
import keyboard from '../assest/banner/Screenshot_2025-05-05_151626-removebg-preview.png'
import processor from '../assest/banner/a9eljhrhal6g7gl73hkn.png'
import FeaturedBanner from '../components/Banner/FeaturedBanner';
import FeaturedBanner2 from '../components/Banner/FeaturedBanner2';
import FeaturedBanner3 from '../components/Banner/FeaturedBanner3';
import FeaturedBanner4 from '../components/Banner/FeaturedBanner4';
import FeaturedBanner5 from '../components/Banner/FeaturedBanner5';
import FeaturedBanner6 from '../components/Banner/FeaturedBanner6';
import FeaturedBanner7 from '../components/Banner/FeaturedBanner7';
import scrollTop from '../helpers/scrollTop';
import FeaturedBanner8 from '../components/Banner/FeaturedBanner8';
import FeaturedBanner9 from '../components/Banner/FeaturedBanner9';
import { Keyboard } from 'swiper/modules';

const Home = () => {

const [showButton, setShowButton] = useState(false);
const BannerData = {
  discount: "30% OFF",
  title: "Bright Smile",
  date: "10 Jan to 28 Jan",
  image: headphone,
  title2: "Air Solo Bass Headphones",
  title3: "Winter Deals",
  title4: "Feel the immersive sound with 30% off premium audio gear!",
  bgColor: "#e5e7eb",
};

const BannerData2 = {
  discount: "30% OFF",
  title: "Happy Hour Deals",
  date: "14 Jan to 28 Jan",
  image: smartwatch,
  title2: "Smartwatch Solo",
  title3: "Crazy Discounts",
  title4: "Grab the smart life companion – limited-time offer only!",
  bgColor: "#2dcc6f",
};

const BannerData3 = {
  discount: "30% OFF",
  title: "Tech Time",
  date: "14 Jan to 28 Jan",
  image: monitor,
  title2: "HD Monitor Solo",
  title3: "Winter Price Drop",
  title4: "Upgrade your workspace with stunning clarity – now 30% off!",
  bgColor: "#FFFFFF",
};

const BannerData4 = {
  discount: "30% OFF",
  title: "Power Your Work",
  date: "14 Jan to 28 Jan",
  image: laptop,
  title2: "Ultraslim Laptop",
  title3: "Seasonal Sale",
  title4: "Unleash performance and portability at an unbeatable price!",
  bgColor: "#FFFFFF",
};

const BannerData5 = {
  discount: "30% OFF",
  title: "Pure Audio Bliss",
  date: "14 Jan to 28 Jan",
  image: airpods,
  title2: "Airpods Solo",
  title3: "Winter Price Cuts",
  title4: "Wireless freedom and great sound – now more affordable!",
  bgColor: "#FFFFFF",
};

const BannerData6 = {
  discount: "30% OFF",
  title: "Big Screen Vibes",
  date: "14 Jan to 28 Jan",
  image: tivi,
  title2: "Smart TV Solo",
  title3: "Holiday Discounts",
  title4: "Enjoy movies and gaming like never before – save big today!",
  bgColor: "#FFFFFF",
};

const BannerData7 = {
  discount: "30% OFF",
  title: "Unleash Your Creativity",
  date: "14 Jan to 28 Jan",
  image: ipad,
  title2: "iPad Solo Edition",
  title3: "New Year Deal",
  title4: "From sketching to streaming — your perfect companion now 30% off!",
  bgColor: "#FFFFFF",
};


const BannerData8 = {
  discount: "30% OFF",
  title: "Smart Spending",
  date: "14 Jan to 28 Jan",
  image: card,
  title2: "Shopping Card Solo",
  title3: "Bright Season Sale",
  title4: "Shop smarter with discounts on every swipe this winter!",
  bgColor: "bg-gradient-to-br from-[#0f172a] to-[#1e293b]",
};

const BannerData9 = {
  discount: "30% OFF",
  title: "Ultimate Setup",
  date: "14 Jan to 28 Jan",
  image: pc,
  title2: "PC Solo",
  title3: "Winter Tech Sale",
  title4: "Build your dream PC – powerful performance, better prices!",
  bgColor: "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]",
};

const BannerData10 = {
  discount: "30% OFF",
  title: "Precision Control",
  date: "14 Jan to 28 Jan",
  image: mouse,
  title2: "Gaming Mouse Solo",
  title3: "Winter Clearance",
  title4: "Dominate your games with pro-grade gear – for less!",
  bgColor: "bg-gradient-to-br from-[#1f1c2c] via-[#928dab] to-[#1f1c2c]",
};

const BannerData11 = {
  discount: "30% OFF",
  title: "Type in Style",
  date: "14 Jan to 28 Jan",
  image: keyboard,
  title2: "Keyboard Solo",
  title3: "Winter Sale",
  title4: "Elevate your typing or gaming experience with sleek designs!",
  bgColor: "bg-gradient-to-br from-[#3e2723] via-[#ff7043] to-[#bcaaa4]",
};

const BannerData12 = {
  discount: "30% OFF",
  title: "Processing Power",
  date: "14 Jan to 28 Jan",
  image: processor,
  title2: "Processor Solo",
  title3: "Tech Discount Week",
  title4: "Power up your PC with next-gen speed – save 30% now!",
  bgColor: "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#ff512f]",
};

const handleClickTop = () => {
  
    scrollTop(); 
  
};

useEffect(() => {
  const handleScroll = () => {
    setShowButton(window.scrollY > 300);
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

  return (
    <div>
    
      
      <BanerProduct/>
 
      <Categorylist/>
      <FeaturedBanner data={BannerData} category={"headphones"}/>

      <HorizontalCardProduct category={"headphones"} heading={"Headphones"}/>
      <FeaturedBanner4 data={BannerData4} category={"laptop"}/>
      <HorizontalCardProduct category={"laptop"} heading={"Top's Laptop"}/>

      <FeaturedBanner3 data={BannerData2}category={"smartwatch"}/>
      <HorizontalCardProduct category={"smartwatch"} heading={"Popular's Whatches"}/>
      <FeaturedBanner2 data={BannerData3}category={"monitor"}/>
      <HorizontalCardProduct category={"monitor"} heading={"Monitor"}/>
      <FeaturedBanner7 data={BannerData7} category={"ipad"}/>
      <HorizontalCardProduct category={"ipad"} heading={"Ipad"}/>
      <FeaturedBanner6 data={BannerData6} category={"tivi"}/>
      <HorizontalCardProduct category={"tivi"} heading={"Tivi"}/>
 
  

      <FeaturedBanner5 data={BannerData5} category={"airpods"}/>
      <HorizontalCardProduct category={"airpods"} heading={"Airpods"}/>
      <FeaturedBanner8 data={BannerData8} category={"card"}/>
      <HorizontalCardProduct category={"card"} heading={"Card"}/>
      <FeaturedBanner8 data={BannerData11} category={"keyboard"}/>
      <HorizontalCardProduct category={"keyboard"} heading={"Keyboard"}/>
      <FeaturedBanner9 data={BannerData9} category={"pc"}/>
      <HorizontalCardProduct category={"pc"} heading={"PC"}/>
      <FeaturedBanner8 data={BannerData10} category={"card"}/>
      <HorizontalCardProduct category={"mouse"} heading={"Mouse"}/>
      <FeaturedBanner9 data={BannerData12} category={"keyboard"}/>
      <HorizontalCardProduct category={"processor"} heading={"Processor"}/>
      


      
      
      {showButton && (
        <div className='text-xl cursor-pointer fixed bottom-5 right-5 z-50 h-5 w-5 p-5 rounded-full  flex items-center justify-center text-white  bg-gray-800 hover:bg-yellow-400 transition duration-500  hover:text-gray-900 ease-in-out '
         
  
    onClick={handleClickTop}
    aria-label="Scroll to top"
>
  
    ↑
  
  </div>
)}
    </div>
  )
}

export default Home;

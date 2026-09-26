import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from 'framer-motion';
import "../../styles/banner.css";

import img1 from "../../assest/images/main-banner-1.jpg";
import img2 from "../../assest/images/catbanner-01.jpg";
import img3 from "../../assest/images/catbanner-02.jpg";
import img4 from "../../assest/images/catbanner-03.jpg";
import img5 from "../../assest/images/catbanner-04.jpg";
import img6 from "../../assest/images/main-banner.jpg";
import { Link } from "react-router-dom";

const mainBanners = [
  {
    img: img1,
    title: "SUPERCHAGED FOR PROS.",
    subtitle: "iPad S13+ Pro.",
    desc: "From $999.00 or $41.62/mo.",
    link: "product/6817084e6dbdf02403370188",
    className: "main-banner-content",
  },
  {
    img: img6,
    title: "SUPERCHAGED FOR PROS",
    subtitle: "Special Sale",
    desc: "From $9990.00 or $41.62/mo.\nfor 24 mo. Footnote",
    link: "#",
    className: "main-banner-content2",
  }
];

const smallBanners = [
  { img: img2, title: "BEST SALE", subtitle: "Laptop Max", desc: "From $1699.00 or\n$64.62/mo." },
  { img: img3, title: "15% OFF", subtitle: "Smartwatch 7", desc: "Shop the latest band\nstyles and colors" },
  { img: img4, title: "NEW ARRIVAL", subtitle: "Buy iPad Air", desc: "From $599 or\n$49.91 for 12 months" },
  { img: img5, title: "FREE ENGRAVING", subtitle: "AirPods Max", desc: "High-fidelity playback &\nultra-low distortion" },
];

const BanerProduct = () => {
  return (
    <section className="py-10">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex flex-wrap mx-4">

          <motion.div
            className="w-1/2 px-4"
          >
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false
              }}
              grabCursor={true}
              navigation={false}
              pagination={{ clickable: true }}
              className="rounded-lg overflow-hidden"
            >
              {mainBanners.map((banner, index) => (
                <SwiperSlide key={index}>
                  <div className="relative">
                    <img
                      src={banner.img}
                      alt="Main Banner"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className={`${banner.className} absolute inset-0 flex flex-col justify-center p-6`}>
                      <h4 className="text-lg font-semibold">{banner.title}</h4>
                      <h5 className="text-2xl font-bold">{banner.subtitle}</h5>
                      <p className="text-sm mt-5 whitespace-pre-line">{banner.desc}</p>
                      <Link to={banner.link} className="button-banner rounded-full traisition duration-300 mt-8">
                        BUY NOW
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          <motion.div
            className="w-1/2 px-4"
          >
            <div className="flex flex-wrap gap-5 justify-between items-center">
              {smallBanners.map((item, index) => (
                <div className="small-banner relative w-1/2" key={index}>
                  <img src={item.img} alt="small banner" className="w-full h-full rounded-md" />
                  <div className="small-banner-content absolute">
                    <h4>{item.title}</h4>
                    <h5>{item.subtitle}</h5>
                    <p className="whitespace-pre-line">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BanerProduct;

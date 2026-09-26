import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode, Zoom } from 'swiper/modules';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'photoswipe/dist/photoswipe.css';
import '../styles/custom-thumbnail-details.css';

const ProductImageGallery = ({
  images = [],
  loading,
  mainSwiper,
  setMainSwiper,
  thumbsSwiperRef
}) => {
  if (loading) {
    return <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-md" />;
  }

  return (
    <>
      <Gallery>
        <Swiper
          onSwiper={setMainSwiper}
          spaceBetween={10}
          navigation
          zoom={true}
          thumbs={{
            swiper:
              thumbsSwiperRef.current && !thumbsSwiperRef.current.destroyed
                ? thumbsSwiperRef.current
                : null
          }}
          modules={[Navigation, Thumbs, Zoom]}
          className="rounded-md shadow-md custom-main-swiper"
        >
          {Array.isArray(images) &&
            images.map((imgURL, index) => (
              <SwiperSlide key={index} className="bg-white">
                <Item original={imgURL} thumbnail={imgURL} width="800" height="800">
                  {({ ref, open }) => (
                    <img
                      ref={ref}
                      onClick={open}
                      src={imgURL}
                      alt={`product-${index}`}
                      className="w-full h-[400px] object-contain cursor-zoom-in"
                    />
                  )}
                </Item>
              </SwiperSlide>
            ))}
        </Swiper>
      </Gallery>

      <div className="custom-main-swiper-wrapper">
        <Swiper
          onSwiper={(swiper) => (thumbsSwiperRef.current = swiper)}
          spaceBetween={2}
          slidesPerView={4}
          watchSlidesProgress
          freeMode
          modules={[FreeMode, Thumbs]}
          className="mt-1 custom-main-swiper-small"
        >
          {Array.isArray(images) &&
            images.map((imgURL, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-md h-[80px] shadow-md">
                  <img
                    src={imgURL}
                    alt={`thumb-${index}`}
                    className="w-full h-full object-contain cursor-pointer"
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  );
};

export default ProductImageGallery;

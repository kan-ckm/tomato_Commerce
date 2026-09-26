import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import fetchCateWisegoryProduct from '../helpers/fecthCategoryWiseProudct';
import displayVNDCurrency from '../helpers/displayINRCurrency';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import { motion } from 'framer-motion';
import { Rate } from 'antd';
import   '../styles/cartProduct.css';
import { FaCartPlus } from 'react-icons/fa';
import '../styles/HorizontalCardProduct.css';
import Context from '../context';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import SummaryApi from '../common';



const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [reviews, setReviews] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { fetchUserAddToCart } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const categoryProduct = await fetchCateWisegoryProduct(category);
      setData(categoryProduct?.data || []);
      setIsLoading(false);
    };
    fetchData();
  }, [category]);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    await addToCart(e, id);
    fetchUserAddToCart();
  };

useEffect(() => {
  const fetchProductReviews = async () => {
    const reviewsMap = {};
    await Promise.all(
      data.map(async (product) => {
        try {
          const res = await fetch(`${SummaryApi.reviewProduct.url}${product._id}`);
          const result = await res.json();
          const productReviews = result?.data || [];
          const total = productReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
          const avg = productReviews.length > 0
            ? Math.round((total / productReviews.length) * 2) / 2
            : 0;
          reviewsMap[product._id] = avg;
        } catch {
          reviewsMap[product._id] = 0;
        }
      })
    );
    setReviews(reviewsMap);
  };

  if (data.length > 0) fetchProductReviews();
}, [data]);


  const groupedData = [];
  for (let i = 0; i < (isLoading ? 10 : data.length); i += 2) {
    groupedData.push(isLoading ? [null, null] : data.slice(i, i + 2));
  }

  return (
    <div className="container mx-auto px-1 my-6">
      <h2 className="text-2xl font-semibold p-4">{heading}</h2>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={5}
        navigation
        loop={false}
        className="Horizontal-Card-Product px-4"
        grabCursor={true}
      >
        {groupedData.map((group, idx) => (
          <SwiperSlide key={idx}>
            <div className="grid grid-cols-1 grid-rows-2 p-1 gap-3">
              {group.map((product, subIdx) => (
                <motion.div
                  key={subIdx}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: subIdx * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="bg-white p-2 shadow-lg rounded-lg w-60 min-h-[500px]"
                >
                  {product ? (
                    <>
                      <Link to={`/product/${product._id}`}>
                        <div className="h-[200px]">
                          <img
                            src={product.productImage[0]}
                            className="object-scale-down h-full w-full transition-transform duration-300"
                            alt={product.productName}
                          />
                        </div>
                      </Link>

                      <div className="p-1">
                        <h2 className="font-medium text-base md:text-sm text-black text-ellipsis">
                          {product.productName}
                        </h2>
                        <p className="capitalize text-slate-500">{product.category}</p>

                        <div className="flex items-center gap-1 mt-2">
                          <Rate
                            allowHalf
                            disabled
                            value={Number((reviews[product._id] || 0).toFixed(1))}
                            style={{
                              color: (reviews[product._id] || 0) > 0 ? '#fadb14' : '#d9d9d9',
                              fontSize: '12px'
                            }}
                          />
                          <span className="text-sm text-slate-500">
                            {(reviews[product._id] || 0) > 0
                              ? `${(reviews[product._id] || 0).toFixed(1)} stars`
                              : 'No reviews yet'}
                          </span>
                        </div>

                        <div className="flex gap-3 mt-2">
                          <p className="text-red-600 font-bold">
                            {displayVNDCurrency(product.sellingPrice)}
                          </p>
                          <p className="text-slate-500 line-through text-xs mt-2">
                            {displayVNDCurrency(product.price)}
                          </p>
                        </div>

                        <p className="bg-slate-200 min-h-14 rounded-lg flex items-center text-[9px] font-medium p-2 mt-5">
                          No conversion when paying 0% installment via credit card for 3-6 months
                        </p>

                        {product.countInStock === 0 ? (
                          <button
                            className="bg-gray-400 text-white rounded-full w-full h-11 mt-5 cursor-not-allowed"
                            disabled
                          >
                            This product is out of stock
                          </button>
                        ) : (
                          <button
                            className="button-cartProduct flex items-center justify-center gap-2 rounded-full transition duration-300 w-full h-11 mt-5"
                            onClick={(e) => handleAddToCart(e, product._id)}
                          >
                            <FaCartPlus /> Add To Cart
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 h-full">
                      <Skeleton height={200} />
                      <Skeleton width="75%" height={20} />
                      <Skeleton width="50%" height={16} />
                      <Skeleton width="50%" height={16} />
                      <Skeleton width="100%" height={18} />
                      <Skeleton width="100%" height={44} style={{ borderRadius: 999 }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HorizontalCardProduct;

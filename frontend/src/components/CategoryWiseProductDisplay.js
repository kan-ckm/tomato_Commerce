import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rate } from 'antd';
import { FaCartPlus } from 'react-icons/fa';
import axios from 'axios';

import Context from '../context';
import addToCart from '../helpers/addToCart';
import displayVNDCurrency from '../helpers/displayINRCurrency';

const backendDomain = "http://localhost:8080";

const CategoryWiseProductDisplay = ({ heading, products = [] }) => {
  const [reviews, setReviews] = useState({});
  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  useEffect(() => {
    const fetchProductReviews = async () => {
      const reviewsMap = {};
      await Promise.all(
        products.map(async (product) => {
          try {
            const res = await axios.get(`${backendDomain}/api/review/${product._id}`);
            const productReviews = res.data?.data || [];
            const total = productReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
            const avg = productReviews.length > 0
              ? Math.round((total / productReviews.length) * 2) / 2
              : 0;
            reviewsMap[product._id] = avg;
          } catch (error) {
            console.error("Failed to fetch reviews for product", product._id, error);
            reviewsMap[product._id] = 0;
          }
        })
      );
      setReviews(reviewsMap);
    };

    if (products.length > 0) {
      fetchProductReviews();
    }
  }, [products]);

  return (
    <div className="container mx-auto px-2 my-8">
      <h2 className="text-2xl font-semibold mb-6">{heading}</h2>

      <div className="flex flex-wrap gap-6 justify-center">
        {products.map((product, idx) => (
          <motion.div
            key={product._id || idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white p-2 shadow-lg rounded-lg w-60 min-h-[500px] flex flex-col"
          >
            <Link to={`/product/${product._id}`}>
              <div className="h-[200px]">
                <img
                  src={product.productImage[0]}
                  className="object-scale-down h-full w-full transition-transform duration-300"
                  alt={product.productName}
                />
              </div>
            </Link>

            <div className="p-1 flex-1 flex flex-col justify-between">
              <div>
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
              </div>

              <button
                className="button-cartProduct flex items-center justify-center gap-2 rounded-full transition duration-300 w-full h-11 mt-5"
                onClick={(e) => handleAddToCart(e, product._id)}
              >
                <FaCartPlus /> Add To Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
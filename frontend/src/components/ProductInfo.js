import React from 'react';
import { FaCartPlus } from 'react-icons/fa';
import displayVNDCurrency from '../helpers/displayINRCurrency';
import ReactStars from 'react-rating-stars-component';
import { Rate } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProductInfo = ({ data, loading,averageRating,handleAddToCart }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex flex-col gap-1">
        <p className="bg-slate-200 animate-pulse h-4 w-32 rounded-full"></p>
        <h2 className="text-2xl lg:text-4xl font-medium h-6 bg-slate-200 animate-pulse"></h2>
        <p className="capitalize text-slate-400 bg-slate-200 animate-pulse h-6 w-40"></p>
        <div className="flex gap-2 font-semibold my-2 bg-slate-200 animate-pulse h-6 w-60"></div>
        <div className="flex items-center gap-4 my-2">
          <div className="h-10 w-32 bg-slate-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-slate-200 animate-pulse rounded"></div>
        </div>
        <div className="bg-slate-200 animate-pulse h-20 w-full rounded-md"></div>
      </div>
    );
  }
  const handleBuy = (e) => {
    handleAddToCart(e, data._id); 
    navigate('/cart');
  };

  return (
    <div className="flex flex-col gap-1">
      <p className="bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit">
        {data?.brandName}
      </p>
      <h2 className="text-2xl lg:text-4xl font-medium">{data?.productName}</h2>
      <p className="capitalize text-slate-400">{data.category}</p>
      <div className="flex items-center gap-2 mt-1">
  <Rate
    allowHalf
    disabled
    value={Number(averageRating?.toFixed(1)) || 0}
    style={{ color: averageRating > 0 ? '#fadb14' : '#d9d9d9' }}
  />
  <span className="text-sm text-slate-500">
    {averageRating > 0 ? `${averageRating.toFixed(1)} stars` : 'No reviews yet'}
  </span>
</div>
      <div className="flex gap-2 text-2xl font-semibold lg:text-3xl my-2">
        <p className="text-red-600">{displayVNDCurrency(data.sellingPrice)}</p>
        <p className="text-slate-400 line-through">{displayVNDCurrency(data.price)}</p>
      </div>

      {data.countInStock === 0 ? (
                      <button
                        className="bg-gray-400 text-white rounded-full w-full h-11 mt-5 cursor-not-allowed"
                        disabled
                      >
                               This product is out of stock
                      </button>
                    ) : (
                      <div className='flex items-center gap-4 my-2 font-medium'>
                  <button className="button rounded-full transition duration-300" onClick={handleBuy}>Buy</button>
                  <button className="button flex items-center justify-center gap-2 rounded-full transition duration-300"  onClick={(e) => handleAddToCart(e, data._id)} >
                    <FaCartPlus  /> Add To Cart
                  </button>
                  </div>
        )}
  
      <div>
        <p className="text-slate-600 font-medium my-1">Description:</p>
        <p>{data.description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;

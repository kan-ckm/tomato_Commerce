import React from 'react';
import { Rate } from 'antd';
import moment from 'moment';
import avatar from '../assest/5ee082781b8c41406a2a50a0f32d6aa6.jpg';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

const ProductReviewSection = ({ reviews, newRating, setNewRating, comment, setComment, submitReview }) => {
  return (
    <div className="mt-10 bg-white p-4 rounded-md  shadow-md">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
    {reviews.length> 0 ? (
      reviews.map((review, idx) => (
  <div key={idx} className=" border-gray-200 bg-slate-50 rounded-md p-4 ">
    <div className="flex items-start  gap-3">

      <img
        src={review?.userId?.profilePic || avatar} 
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
   
      <div>
        <div className='flex  items-center gap-2'>
        <span className=" font-semibold mb-1">{review?.userId?.name || 'Anonymous'}</span>
        <p className='text-[13px] font-medium'>{moment(review.createdAt).fromNow()}</p>
        </div>
          <Rate disabled value={review.rating} />
      </div>
    </div>

    <p className="   ml-12 ">{review.comment}</p>
 

  </div>
))
    ):(
      <div className='w-full h-32 rounded-md flex items-center justify-center bg-slate-50'>
      <p>No reviews available</p> 
      </div>
    )}
      <div className="mt-6 flex flex-col gap-4">
    
        <h4 className="text-lg font-semibold mb-2">Write a review</h4>
        <div className="flex items-center gap-2">
          <Rate
            tooltips={desc}
            onChange={(value) => setNewRating(value)}
            value={newRating} 
          />
          {newRating ? <span className="text-gray-500">{desc[newRating - 1]}</span> : null}
        </div>
     
        <div className='bg-slate-100 p-2 w-56 flex rounded-full transition duration-500 '>
          <input
            className="w-56 h-full outline-none bg-slate-200 bg-transparent"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
          />
        </div>
        <div>
        <button
          onClick={submitReview}
          className="rounded-full button  transition duration-500"
        >
          Submit Review
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewSection;

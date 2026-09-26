import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common';
import HorizontalCardProdut from '../components/HorizontalCardProduct';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductInfo from '../components/ProductInfo';
import ProductReviewSection from '../components/ProductReviewSection';
import addToCart from '../helpers/addToCart';
import { toast } from 'react-toastify';
import Context from '../context';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
const backendUrl = process.env.REACT_APP_URL_BACKEND;



const ProductDetails = () => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    productImage: [],
    description: '',
    price: '',
    sellingPrice: '',
  });

  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mainSwiper, setMainSwiper] = useState(null);
  const thumbsSwiperRef = useRef(null);
  const params = useParams();
  const {fetchUserAddToCart} =useContext(Context)

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id);
    fetchUserAddToCart()
  }

  const fetchProductDetails = async () => {
    if (!params?.id) return;
    
    setLoading(true);
    
      const response = await fetch(`${backendUrl}/api/product-details/${params.id}`, {
        method: "GET",
      });
      const dataResponse = await response.json();
      setData(dataResponse?.data || {});
      if(dataResponse){
            setLoading(false)
        toast.success(dataResponse.message)
      }
    
      if(dataResponse.error){
        toast.error(dataResponse.message)
      }
    
  };
  


  const fetchReviews = async () => {
    if (!params?.id || params.id === 'undefined') return;
    try {
      const response = await fetch(`${backendUrl}/api/review/${params.id}`);

      const resJson = await response.json();

      setReviews(resJson.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  const submitReview = async () => {
    try {
      const response = await fetch(SummaryApi.reviewProduct.url, {
        method: SummaryApi.reviewProduct.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: params.id, rating: newRating, comment }),
        credentials: 'include',
      });
      const resJson = await response.json();
      if (resJson.success) {
        toast.success("Review submitted!");
        setComment('');
        setNewRating(0);
        fetchReviews();
      } else {
        toast.error(resJson.message );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };


  useEffect(() => {
    if (params?.id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchProductDetails();
      fetchReviews();
    }
  }, [params?.id]);

  const averageRating = useMemo(() => {
    if (Array.isArray(reviews) && reviews.length > 0) {
      const total = reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0);
      const average = total / reviews.length;
      return Math.round(average * 2) / 2; 
    }
    return 0;
  }, [reviews]);
  



  return (
    <div className="container mx-auto p-4">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-4">
        <div className="w-full max-w-2xl">
          <ProductImageGallery
            images={data.productImage}
            loading={loading}
            mainSwiper={mainSwiper}
            setMainSwiper={setMainSwiper}
            thumbsSwiperRef={thumbsSwiperRef}
          />
        </div>
        <div className="bg-white p-4 rounded-md shadow-md w-full">
          <ProductInfo data={data} loading={loading} averageRating={averageRating} handleAddToCart={handleAddToCart}  />
        </div>
      </div>
      {data.category && (
        <HorizontalCardProduct category={data.category} heading={"Recommended Product"} />
      )}
      <ProductReviewSection
        reviews={reviews}
        newRating={newRating}
        setNewRating={setNewRating}
        comment={comment}
        setComment={setComment}
        submitReview={submitReview}
      />
    </div>
  );
};

export default ProductDetails;

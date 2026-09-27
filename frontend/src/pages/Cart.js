import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayVNDCurrency from '../helpers/displayINRCurrency'
import { MdDelete } from "react-icons/md";
import {loadStripe} from '@stripe/stripe-js';
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
const Cart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5
  const navigate = useNavigate()
    const context = useContext(Context)
    const loadingCart = new Array(context.cartProductCount).fill(null)

    const fetchData = async () => {
        setLoading(true)
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        setLoading(false)
        const responseData = await response.json()
      
        if (responseData.success) {
            setData(responseData.data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const increaseQty = async (id, currentQty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: id,
                quantity: currentQty + 1
            })
        });

        const responseData = await response.json();

        if (responseData.success) {
            setData(prevData =>
                prevData.map(item =>
                    item._id === id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        }
    }

    const decreaseQty = async (id, currentQty) => {
        if (currentQty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: currentQty - 1
                })
            });

            const responseData = await response.json();
            if (responseData.success) {
                setData(prevData =>
                    prevData.map(item =>
                        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
                    )
                );
            }
        }
    }

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: id,
            })
        });

        const responseData = await response.json();
        if (responseData.success) {
            setData(prev => prev.filter(item => item._id !== id))
            context.fetchUserAddToCart();
        }
    }

    const handlePayment=async()=>{
        const stripePromise=await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
        
        const res = await fetch(SummaryApi.payment.url,{
            method:SummaryApi.payment.method,
            credentials:'include',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify({
                cartItems:data
            })
        })
        const responseData = await res.json() 
        if(responseData?.id){
            stripePromise.redirectToCheckout({sessionId:responseData.id})
        } else if (responseData?.message) {
            toast.error(responseData.message)
        }
 
    }
    const totalQty = data.reduce((prev, curr) => prev + curr?.quantity, 0)
    const totalPrice = data.reduce((prev, curr) => prev + (curr?.quantity * curr?.productId?.sellingPrice), 0)

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)

    return (
        <div className='container mx-auto'>
            <div className='text-center text-lg my-3'>
                {
                    data.length === 0 && !loading && (
                        <p className='bg-white py-5 '>No data</p>
                    )
                }
            </div>

            <div className='flex flex-col gap-10 p-4 relative bg-white rounded-md shadow-md'>
                <div className='w-full'>
                    {
                        loading ? (
                            loadingCart.map((el, index) => (
                                <div key={index + "Add To Cart Loading"} className='w-full bg-slate-200 h-32 my-1 border border-slate-300 rounded-md grid grid-cols-[128px,1fr]'></div>
                            ))
                        ) : (
                            currentItems.map((product,index) => (
                                <div key={product?._id + "Add To Cart"} className='w-full drop-shadow-xl bg-white my-1 border border-slate-300 rounded-md grid grid-cols-[128px,1fr]'>
                                    <div className='w-28 h-28'>
                                        <img src={product?.productId?.productImage[0]} alt="product" className='w-full h-full object-scale-down mix-blend-multiply' />
                                    </div>
                                    <div className='px-4 py-2 relative'>
                                        <button className='absolute right-0 top-0 delete-button rounded-full p-2 duration-200' onClick={() => deleteCartProduct(product?._id)}>
                                            <MdDelete />
                                        </button>
                                        <h2 className='text-lg lg:text-2xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                        <p className='text-sm lg:text-lg text-stone-500 capitalize'>{product?.productId?.category}</p>
                                        <div className='flex justify-between items-center mt-2'>
                                            <p className='text-red-500 font-medium text-lg'>{displayVNDCurrency(product?.productId?.sellingPrice)}</p>
                                            <p className='text-stone-600 font-medium text-lg'>{displayVNDCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <button className='button-small w-6 h-6 rounded-sm duration-200 flex justify-center items-center' onClick={() => decreaseQty(product?._id, product?.quantity)}>-</button>
                                            <span>{product?.quantity}</span>
                                            <button className='button-small w-6 h-6 rounded-sm duration-200 flex justify-center items-center' onClick={() => increaseQty(product?._id, product?.quantity)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>

                {
                    !loading && data.length > itemsPerPage && (
                        <div className='flex justify-center items-center gap-4 my-4'>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {Math.ceil(data.length / itemsPerPage)}</span>
                            <button
                                onClick={() => setCurrentPage(prev => (prev * itemsPerPage < data.length ? prev + 1 : prev))}
                                className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
                                disabled={currentPage * itemsPerPage >= data.length}
                            >
                                Next
                            </button>
                        </div>
                    )
                }

                {
                    data[0]&&(
                <div className='w-full mt-4 bg-white rounded-md drop-shadow-xl'>
                    {
                        loading ? (
                            <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse rounded-md'></div>
                        ) : (
                            <div className='h-36'>
                                <h2 className='text-white bg-red-600 px-4 py-1 rounded-t-md'>Summary</h2>
                                <div className='flex justify-between items-center px-4 gap-2 font-medium text-lg'>
                                    <p>Quantity</p>
                                    <p>{totalQty}</p>
                                </div>
                                <div className='flex justify-between items-center px-4 gap-2 font-medium text-lg'>
                                    <p>Total Price</p>
                                    <p>{displayVNDCurrency(totalPrice)}</p>
                                </div>
                                <div className='flex justify-end px-2'>
                                    <button className='button w-full rounded-full transition duration-150 ' onClick={handlePayment}>Payment</button>
                                </div>
                            </div>
                        )
                    }
                </div>
                    )
                }
            </div>
        </div>
    )
}

export default Cart

import React, { use, useEffect, useState } from 'react'
import SumaryApi from '../common'
import { Link } from 'react-router-dom'
import scrollTop from '../helpers/scrollTop';


const Categorylist = () => {
  const [CategoryProduct,setCategoryProduct] = useState([])
  const [loading,setLoading] = useState(false)

  const categoryLoading = new Array(13).fill(null)

  const fetchCategoryProduct = async()=>{
  setLoading(true)
    const response = await fetch(SumaryApi.categoryProduct.url)
    const dataResponse = await response.json()
    setLoading(false)
    setCategoryProduct(dataResponse.data)
  }
  useEffect(()=>{
    fetchCategoryProduct()
  },[])

  return (
    <div id='shop-list' className='Container mx-auto'>
      <div className='flex items-center  gap-5 justify-center overflow-scroll scrollbar-none'>
      {
        loading?(
            categoryLoading.map((el,index)=>{
              return(
              <div className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse' key={"categoryLoading"+index}>

              </div>
              )
            })
          
        ):(
          CategoryProduct.map((product,index)=>{ 
            return(
              <Link onClick={scrollTop} to={"/product-category/"+product?.category} className='p-2 cursor-pointer' key={product?.category}>
                  <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-slate-200 flex items-center justify-center'>
                    <img src={product?.productImage[0]} alt={product.category} className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'/>
                  </div>
                  <p className='text-center text-sm md:text-base capitalize'>{product.category}</p>
              </Link>
            )
          })
        )

        }
      </div>
    </div>
  )
}

export default Categorylist

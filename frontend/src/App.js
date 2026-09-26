import logo from './logo.svg';
import './App.css';
import { data, Outlet } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import GridMotion from './pages/GridMotion';
import { ToastContainer, toast } from 'react-toastify'
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from "react-redux";
import { setUserDetails } from './stores/userSlice';
import "./i18n"; 


function App() {
     const dispatch = useDispatch()
    const [cartProductCount,setcartProductCount] = useState(0)
  

  const fetchUserDetails =async()=>{
    const dataResponse = await fetch(SummaryApi.Current_user.url,{
      method:SummaryApi.Current_user.method,
      credentials: 'include'
    })
    const dataApi = await dataResponse.json()
    if (dataApi.success){
      dispatch(setUserDetails(dataApi.data))
    }

  }
   const fetchUserAddToCart =async()=>{
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
      method:SummaryApi.addToCartProductCount.method,
      credentials: 'include'
    })
    const dataApi = await dataResponse.json()

    setcartProductCount(dataApi?.data?.count)
   }
  useEffect(()=>{
    fetchUserDetails();
    fetchUserAddToCart();
  },[])

  return (
    <> 
    <Context.Provider value={{
      fetchUserDetails,
      cartProductCount,
      fetchUserAddToCart, 
    }}>
    
    <ToastContainer />
  <Header className=''/>
    <main className='min-h-[calc(100vh-110px)] pt-[140px]'>
    <Outlet />
    </main>
    <Footer className=''/>
    </Context.Provider>
  
    </>
  );
}

export default App;
import React, { useState, useContext } from 'react'
import loginicon from '../assest/profile.gif'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Link, useNavigate } from 'react-router-dom'
import SummaryApi from '../common'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import Context from '../context'
import axios from 'axios'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handlSubmit = async (e) => {
    e.preventDefault();
  
    const response = await fetch(SummaryApi.signIn.url, {
      
      method: SummaryApi.signIn.method,
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
  console.log(SummaryApi.signIn);

    const dataApi = await response.json();
  
    if (response.ok) {

      toast.success(dataApi.message);
      localStorage.setItem('user', JSON.stringify(dataApi.user));
  
      if (dataApi.user?.role === 'ADMIN') {
        window.location.href = 'http://localhost:5173';
      } else {
        navigate('/');
        fetchUserDetails();
        fetchUserAddToCart();
      }
    } else {
      console.error("Login response error:", dataApi);
      toast.error(dataApi.message );
    }
  };

  return (
    <section id='login'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto rounded-lg shadow-md'>
          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
            <img src={loginicon} alt='Login icon' />
          </div>
          <form className='pt-6  flex flex-col gap-3' onSubmit={handlSubmit}>
            <div className='grid'>
              <label className='ml-2'>Email : </label>
              <div className='bg-slate-100 p-2 rounded-full transition duration-500'>
                <input
                  type='email'
                  placeholder='Enter email'
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>

            <div>
              <label className='ml-2'>Password : </label>
              <div className='bg-slate-100 p-2 flex rounded-full transition duration-500'>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter password'
                  name='password'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
                <div className='cursor-pointer text-lg' onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? (
                    <FaEyeSlash className='hover:scale-110 transition duration-700' />
                  ) : (
                    <FaEye className='hover:scale-110 transition duration-700' />
                  )}
                </div>
              </div>
              <Link to={"/forgot-password"} className='block w-fit ml-auto hover:no-underline hover:text-yellow-300'>
                Forgot password
              </Link>
            </div>
            <button className='bg-gray-800 hover:bg-yellow-400 hover:text-black text-white px-6 py-2 w-full max-w-[150px] rounded-full transition duration-500 mx-auto block mt-4'>Login</button>
          </form>
          <p className='my-4'>Don't have an account? <Link to={"/sign-up"} className='hover:no-underline hover:text-yellow-400'>Sign up</Link></p>
        </div>
      </div>
    </section>
  )
}

export default Login

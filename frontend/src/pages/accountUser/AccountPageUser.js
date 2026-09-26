
import React, { useEffect } from 'react'; 
import { useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosArrowDropright } from "react-icons/io";
const AccountPageUser = () => {
   const user = useSelector(state=>state?.user?.user)
    const navigate = useNavigate()
    useEffect(()=>{
      if (!user) return; 

    
  
    },[user])
  
  return (
    <div>
  <div className='min-h-[calc(100vh-120px)] flex'>
          <aside className='bg-white min-h-full w-full max-w-60 customShadow'>
                <div  className='h-32  flex justify-center items-center flex-col'> 
                         <div className='text-5xl cursor-pointer relative flex justify-center '>
                                       {
                                             user?.profilePic ?(
                                             <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name}/>
                                                                
                                                ):(
                                               <FaRegUserCircle/> 
                                                )
                                              }
                                                         
                                                           
                                        </div>
                                        <p className='text-lg font-semibold'>{user?.name}</p>
                                        <p className='text-sm'>{user?.role}</p>
                      </div>  
                        <nav className='grid py-4 '>
                    
                            <Link to={"profileUser"}  className='flex items-center gap-28 px-2 py-1 hover:bg-slate-100'>
                            <p>Profile </p>
                            <IoIosArrowDropright />
                            </Link>
                            <Link to={"ResetPassword"}  className='flex items-center gap-[52px] px-2 py-1 hover:bg-slate-100'>
                            <p>ResetPassword </p>
                            <IoIosArrowDropright />
                            </Link>
                             <Link to={"order"}  className='flex items-center gap-[115px] px-2 py-1 hover:bg-slate-100'>
                            <p>Order </p>
                            <IoIosArrowDropright />
                            </Link>
                       
                        </nav>
          </aside>
          
              <main className='w-full h-full p-2 '>
                      <Outlet/>
                    </main>
      
      </div>
  
    </div>
  )
}

export default AccountPageUser

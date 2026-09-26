import React, { useState, useEffect, useContext } from 'react';
import Logo from './Logo';
import { FaSearch, FaRegUserCircle } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../stores/userSlice';
import ROLE from '../common/role';
import { Link as ScrollLink, scroller } from "react-scroll";
import Context from '../context';
import SearchBar from './SreachProduct';
import scrollTop from'../helpers/scrollTop'

const Header = () => {
  const user = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [shouldScroll, setShouldScroll] = useState(false); 

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.userLog_out.url, {
      method: SummaryApi.userLog_out.method,
      credentials: 'include'
    });

    const data = await fetchData.json();
    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/")
    }
    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleClickCategories = () => {
    navigate('/', { state: { shouldScrollToShopList: true } });
  };
  const handleClickTop = () => {
   
      scrollTop(); 
    
  };

  useEffect(() => {
    if (location.state?.shouldScrollToShopList) {
      setShouldScroll(true);
    }
  }, [location.state]);

  return (
    <div className="fixed w-full z-40">
      <div className="bg-gray-600 border-b-2  text-white text-sm py-2 flex justify-between px-20">
        <span>Free Shipping Over $100 & Free Returns</span>
        <span>Hotline: (888) 4344 6000 - (888) 1338 8193</span>
      </div>

      <header className="bg-slate-800 ">
        <div className="h-16 container mx-auto flex items-center px-4 justify-between" >
          <Link to={"/"} onClick={()=>handleClickTop()} >
            <Logo w={90} h={50} />
          </Link>

          <SearchBar />

          <div className="flex items-center gap-7">
            <div className="relative flex justify-center">
              {user?._id && (
                <div className="text-3xl cursor-pointer relative flex justify-center hover:scale-110 transition duration-500" onClick={() => setMenuDisplay(prev => !prev)}>
                  {user?.profilePic ? (
                    <img src={user?.profilePic} className="w-10 h-10 rounded-full" alt={user?.name} />
                  ) : (
                    <FaRegUserCircle />
                  )}
                </div>
              )}

              {menuDisplay && (
                <div className="z-50 absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded">
                  <nav>
                    <Link
                      to={"/account/order"}
                      className="whitespace-nowrap hover:bg-slate-100 block px-3 py-1 rounded"
                      onClick={() => {
                        setMenuDisplay(false);
                        handleClickTop();
                      }}
                    >
                      My Account
                    </Link>
                  </nav>
                </div>
              )}
            </div>

            {user?._id && (
              <Link to={"/Cart"} className="text-3xl relative" onClick={()=>handleClickTop()}>
                <span><TiShoppingCart className="text-yellow-400" /></span>
                <div className="bg-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 left-4">
                  <p className="text-sm font-bold">{context?.cartProductCount}</p>
                </div>
              </Link>
            )}

            <div>
              {user?._id ? (
                <button onClick={handleLogout} className="px-3 py-1 rounded-full bg-yellow-300 hover:bg-yellow-400 transition duration-500">Logout</button>
              ) : (
                <Link to={"/login"} className="px-3 py-1 rounded-full bg-yellow-300 hover:bg-yellow-400 transition duration-500" onClick={()=>handleClickTop()}>Login</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="w-full bg-slate-600 shadow-lg text-sm">
        <nav>
          <ul className="flex justify-start py-1 gap-5 px-32 text-white cursor-pointer">
            <Link to={"/"}><li className="hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500" onClick={()=>handleClickTop()} >Home</li></Link>
            <li className="hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500">Store</li>
            <ScrollLink
              smooth={true}
              duration={500}
              to="shop-list"
              offset={-window.innerHeight / 2} 
              onClick={handleClickCategories}
            >
              <li className="hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500">Categories</li>
            </ScrollLink>
            <li className="hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500">Blogs</li>
            <li className="hover:bg-slate-800 px-4 py-2 rounded-lg transition duration-500">Contact</li>
          </ul>
        </nav>
      </div>
 
    </div>
  );
};

export default Header;

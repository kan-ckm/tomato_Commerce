import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import loginicon from '../../assest/profile.gif';
import imageTobase64 from '../../helpers/imageTobase64';
import SummaryApi from '../../common';
import { setUserDetails } from '../../stores/userSlice';
import { toast } from 'react-toastify';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
const ProfileTab = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    name: '',
    phone: '',
    address: '',
    profilePic: '',

  });

  useEffect(() => {
    if (user) {
      setData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        profilePic: user.profilePic || '',
 
      });
    }
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const image = await imageTobase64(file);
      setData((prev) => ({
        ...prev,
        profilePic: image,
      }));
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(SummaryApi.updateProfileUser.url, {
        method: SummaryApi.updateProfileUser.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        dispatch(setUserDetails(result.data));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <section className='py-10'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto rounded-lg shadow-md'>
        <div className="flex justify-center items-center space-x-2">
          <FaRegUser className="text-xl" />
          <h2 className="font-semibold text-lg ">Edit profile</h2>
       </div>
          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
            <img src={data.profilePic || loginicon} alt='avatar' />
            <form>
              <label>
                <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 text-center absolute bottom-0 w-full cursor-pointer'>
                 Edit avatar
                </div>
                <input type='file' className='hidden' onChange={handleUploadAvatar} />
              </label>
            </form>
          </div>
          <form className='pt-6 flex flex-col gap-3' onSubmit={handleSubmit}>
            <div className='grid'>
              <label className='ml-2'>Name:</label>
              <div className='bg-slate-100 p-2 rounded-full'>
                <input
                  type='text'
                  name='name'
                  placeholder='Enter name'
                  value={data.name}
                  onChange={handleOnChange}
             
                  className='w-full bg-transparent outline-none'
                />
              </div>
            </div>
            <div className='grid'>
              <label className='ml-2'>Phone:</label>
              <div className='bg-slate-100 p-2 rounded-full'>
                <input
                  type='text'
                  name='phone'
                  placeholder='Enter phone number'
                  value={data.phone}
                  onChange={handleOnChange}
             
                  className='w-full bg-transparent outline-none'
                />
              </div>
            </div>
        
            <button className='bg-gray-800 hover:bg-yellow-500 hover:text-black text-white px-6 py-2 w-full max-w-[150px] rounded-full transition duration-500 mx-auto mt-4'>
              Save changes
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProfileTab;

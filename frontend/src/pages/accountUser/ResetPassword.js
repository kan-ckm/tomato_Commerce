
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import SummaryApi from '../../common';
import { TbLockPassword } from "react-icons/tb";
const ResetPassword = () => {

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  

    try {
      const res = await fetch(SummaryApi.updatePasswordProfile.url, {
        method: SummaryApi.updatePasswordProfile.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || 'Lỗi khi đổi mật khẩu');
    }
  };

  return (
    <div className='bg-white p-5 w-full max-w-sm mx-auto mt-8 rounded-lg shadow-md'>
      <div className='flex justify-center items-center'>
        <TbLockPassword className='text-xl' />
      <h2 className='font-semibold text-lg'>Change password</h2>
      </div>
                <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div className='grid' key={field}>
                <label className='ml-2 capitalize'>{field.replace(/([A-Z])/g, ' $1')}:</label>
                <div className='bg-slate-100 p-2 rounded-full flex items-center'>
                <input
                    type={showPassword[field] ? 'text' : 'password'}
                    name={field}
                    value={formData[field]}
                    placeholder={`Enter ${field === 'currentPassword' ? 'current password' : field === 'newPassword' ? 'new password' : ' confirm password'}`}
                    onChange={handleChange}
                    className='w-full bg-transparent outline-none px-2'
                />
                <button type='button' onClick={() => toggleShowPassword(field)} className='text-lg px-2'>
                    {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                </button>
                </div>
            </div>
            ))}


        <button
          type='submit'
          className='bg-gray-800 hover:bg-yellow-500 hover:text-black text-white px-6 py-2 w-full max-w-[180px] rounded-full transition duration-500 mx-auto mt-4'
        >
        Change Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword

import { User } from "lucide-react";
import SettingSection from "./SettingSection";
import { useDispatch, useSelector } from 'react-redux';
import imageToBase64 from "../../helpers/imageTobase64";
import SummaryApi from "../../common";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import { Modal, Input, Select } from "antd";
import { setUserDetails } from '../../stores/userSlice'; 
import avataricon from '../../../public/5ee082781b8c41406a2a50a0f32d6aa6.jpg'
const Profile = () => {
  const user = useSelector(state => state?.user?.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const [data, setData] = useState({
    name: '',
	  password: '',
    profilePic: '',
  });

  useEffect(() => {

    if (user) {
      setData({
        name: user.name || '',
        password: user.password || '',
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
      const image = await imageToBase64(file);
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
      const res = await fetch("http://localhost:8080/api/update-prodfile-admin", {
        method: 'PUT',
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
        setIsModalOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };
  
  const handleEdit = () => {
    setIsModalOpen(true);
  };
  

  return (
    <SettingSection icon={User} title={"Profile"}>
      <div className='flex flex-col sm:flex-row items-center mb-6'>
        <img
          src={user?.profilePic}
          alt='Profile'
          className='rounded-full w-20 h-20 object-cover mr-4'
        />
        <div>
          <h3 className='text-lg font-semibold text-gray-100'>{user?.name}</h3>
          <p className='text-gray-400'>{user?.email}</p>
        </div>
      </div>

      <button
        className='bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto'
        onClick={handleEdit}
      >
        Edit Profile
      </button>

      <Modal className="ant-modal-header text-white"
     title={<span className="text-white">Edit Admin</span>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
        onOk={handleSubmit}
		closable={false} 
    okButtonProps={{ className: 'ok-button' }}
    cancelButtonProps={{ className: 'cancel-button' }}
      >
		  <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
						<div>
						<img src={data.profilePic||avataricon} alt='Login icons'/>
						</div>
					  <form>
						<label>
							<div className='text-xs bg-opacity-80 bg-slate-700/30 pb-4 pt-2 text-center absolute bottom-0 w-full'>
										Update avatar
							</div>
							<input type='file' className='hidden' onChange={handleUploadAvatar}/>
						</label>
					  </form>
					</div>
        <label className="block mb-1">Name</label>
        <Input
		
          value={data?.name}
          name="name"
          onChange={handleOnChange}
          className="mb-3 text-white !bg-gray-800 !placeholder-gray-400"
        />

        <label className="block mb-1">Email</label>
        <Input
          value={user?.email}
          disabled
          className="mb-3 !text-white"
        />

<label className="block mb-1">Passwword</label>
        <Input
          value={data?.password}
          name="password"
          onChange={handleOnChange}
          className="mb-3 text-white !bg-gray-800 !placeholder-gray-400"
		  type="password" 
        />

      
      </Modal>
    </SettingSection>
  );
};

export default Profile;

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useDispatch } from 'react-redux';
import { logoutUser, setUserDetails } from '../../stores/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserShield } from "react-icons/fa";
const DangerZone = () => {
	const dispatch = useDispatch();

	const handleLogoutadmin = async () => {
		const res = await fetch("http://localhost:8080/api/admin-logout", {
			method: "POST",
			credentials: "include"
		});
		const data = await res.json();
		if (data.success) {
			toast.success(data.message);
			dispatch(setUserDetails(null)); 
			dispatch(logoutUser());     
			window.location.href = "http://localhost:3000";
		}
		if (data.error) {
			toast.error(data.message);
		}
	};

	return (
		<motion.div
			className='bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='flex items-center mb-4'>
				<FaUserShield className='text-red-400 mr-3' size={24} />
				<h2 className='text-xl font-semibold text-gray-100'></h2>
			</div>
			<button
				onClick={handleLogoutadmin}
				className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200'
			>
				Log out
			</button>
		</motion.div>
	);
};

export default DangerZone;

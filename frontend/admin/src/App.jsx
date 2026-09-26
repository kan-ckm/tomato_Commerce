import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from './stores/userSlice';
import SummaryApi from './common';

import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import EditProduct from "./components/products/EditProduct";
import AddProduct from "./components/products/uploadProduct";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isLoadingUser, setIsLoadingUser] = useState(true);
	const user = useSelector((state) => state.user.user);

	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const res = await fetch(SummaryApi.Current_user.url, {
					method: SummaryApi.Current_user.method,
					credentials: 'include'
				});
				const data = await res.json();

				if (data.success) {
					const userData = data.user || data.data;

					if (userData.role !== "ADMIN") {
						dispatch(setUserDetails(null));
						window.location.href = "http://localhost:3000";
						return;
					}

					dispatch(setUserDetails(userData));
				} else {
					dispatch(setUserDetails(null)); 
					window.location.href = "http://localhost:3000";
				}
			} catch (error) {
				toast.error("Something went wrong");
				dispatch(setUserDetails(null)); 
				window.location.href = "http://localhost:3000";
			} finally {
				setIsLoadingUser(false);
			}
		};

		fetchUserDetails();
	}, [dispatch]);

	if (isLoadingUser) return null;

	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>

			<Sidebar />

			<div className="relative z-10 flex h-full w-full">
				<Routes>
					<Route path='/' element={<OverviewPage />} />
					<Route path='/products' element={<ProductsPage />} />
					<Route path='/users' element={<UsersPage />} />
					<Route path='/orders' element={<OrdersPage />} />
					<Route path='/settings' element={<SettingsPage />} />
					<Route path='/admin/edit-product/:id' element={<EditProduct />} />
					<Route path='/admin/add-product' element={<AddProduct />} />
				</Routes>
			</div>

			<ToastContainer
				position="top-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				pauseOnHover
				draggable
				theme="colored"
			/>
		</div>
	);
}

export default App;

import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import displayVNDCurrency from"../helpers/displayINRCurrency"
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OverviewPage = () => {
	const [totalProducts, setTotalProducts] = useState(0);
	const [newUserTotal,setnewUserTotal] =useState(0);
	const [getTotalSalesThisMonth,setGetTotalSalesThisMonth]=useState(0)
	const fetchTotalProducts = async () => {
		try {
			const res = await fetch("http://localhost:8080/api/get-product",{
				method:'GET',
				credentials:'include'
			})
			const data = await res.json();
			if (data.success) {
				setTotalProducts(data.data.length); 
			}
			
		
		} catch (err) {
			console.error("Failed to fetch total products:", err);
		}
	};
		const fetchNewUser = async ()=>{
			try{
					const res = await fetch("http://localhost:8080/api/get-user-month",{
						method:"GET",
						credentials:"include",
						
					})
					const data = await res.json()
					setnewUserTotal(data.newUsersToday||0)
			}
			catch(err){
				
				toast.error(err)
			}
		}
		const fetchTotalSalesThisMonth = async ()=>{
			try{
					const res = await fetch("http://localhost:8080/api/get-total-sales-this-month",{
						method:"GET",
						credentials:"include",
						
					})
					const data = await res.json()
					console.log(data)
					setGetTotalSalesThisMonth(data.orderCount||0)
			}
			catch(err){
				
				toast.error(err)
			}
		}
	useEffect(() => {
		fetchTotalProducts()
		fetchNewUser()
		fetchTotalSalesThisMonth()
	}, [])

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Overview' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Sales' icon={Zap} value={getTotalSalesThisMonth} color='#6366F1' />
					<StatCard name='New Users' icon={Users} value={newUserTotal} color='#8B5CF6' />
					<StatCard name='Total Products' icon={ShoppingBag} value={totalProducts} color='#EC4899' />
					<StatCard name='Conversion Rate' icon={BarChart2} value='12.5%' color='#10B981' />
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					<SalesOverviewChart />
					<CategoryDistributionChart />
					<SalesChannelChart />
				</div>
			</main>
		</div>
	);
};
export default OverviewPage;

import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const userStats = {

	newUsersToday: 243,

	churnRate: "2.4%",
};

const UsersPage = () => {
	const [totalUsers, setTotalUsers] = useState(0); 
	const [newUserTotal,setnewUserTotal] =useState(0);
	const [activeUsers,setActiveUsers] = useState(0)
	const [userChurnRate,setuserChurnRate] = useState(0)
	
	
	const fetchUsers = async () => {
		try {
			const res = await fetch("http://localhost:8080/api/all-user", {
				method: "GET",
				credentials: "include", 
				
			});
			const data = await res.json();
		
			setTotalUsers(data.data?.total || 0);
		}catch(err){
			
			toast.error(err)
		}
	}
	const fetchNewUser = async ()=>{
		try{
				const res = await fetch("http://localhost:8080/api/users-today",{
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
	const fetchActiveUsers= async ()=>{
		
		const res = await fetch("http://localhost:8080/api/active-users",{
			method:"GET",
			credentials:"include"

		})
		const data = await res.json()
		console.log(data.activeUsersCount)
		setActiveUsers(data.activeUsersCount||0)
	}
	const fetcUserChurnRate = async ()=>{
		const res = await fetch("http://localhost:8080/api/user-churnrate",{
			method:"GET",
			credentials:"include"
		})
		const data = await res.json()
		setuserChurnRate(data.churnRate||0)
		
	}
	useEffect(() => {
		fetcUserChurnRate();
		fetchActiveUsers();
		fetchNewUser();
	fetchUsers();
	},[])
	
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Users'
						icon={UsersIcon}
						value={totalUsers?.toLocaleString()}
						color='#6366F1'
					/>
					<StatCard name='New Users Today' icon={UserPlus} value={newUserTotal?.toLocaleString()} color='#10B981' />
					<StatCard
						name='Active Users'
						icon={UserCheck}
						value={activeUsers?.toLocaleString()}
						color='#F59E0B'
					/>
					<StatCard name='Churn Rate' icon={UserX}   value={`${userChurnRate?.toLocaleString()}%`} color='#EF4444' />
				</motion.div>

				<UsersTable />

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div>
			</main>
		</div>
	);
};

export default UsersPage;

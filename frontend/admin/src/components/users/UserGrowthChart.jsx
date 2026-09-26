import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const userGrowthData = [
	{ month: "Jan", users: 1000 },
	{ month: "Feb", users: 1500 },
	{ month: "Mar", users: 2000 },
	{ month: "Apr", users: 3000 },
	{ month: "May", users: 4000 },
	{ month: "Jun", users: 5000 },
];
const UserGrowthChart = () => {
	const [userGrowthChart,setUserGrowthChart] = useState([])
	const fetchUserGrowthChart = async () => {
		const res = await fetch('http://localhost:8080/api/get-user-growth',{
			method:"GET",
			credentials: "include"
		})
		const data = await res.json()
	
		setUserGrowthChart(data.data.length > 0 ? data.data : [
			{ month: "Jan", users: 0 },
			{ month: "Feb", users: 0 },
			{ month: "Mar", users: 0 },
			{ month: "Apr", users: 0 },
			{ month: "May", users: 0 },
			{ month: "Jun", users: 0 },
		]);
	}
	  useEffect(() => {
		fetchUserGrowthChart()
	},[])
return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>User Growth</h2>
			<div className='h-[320px]'>
				<ResponsiveContainer width='100%' height='100%'>
					<LineChart data={userGrowthChart}>	
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke="#9CA3AF" domain={[0, 1000]} />

						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Line
							type='monotone'
							dataKey='users'
							stroke='#8B5CF6'
							strokeWidth={2}
							dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default UserGrowthChart;

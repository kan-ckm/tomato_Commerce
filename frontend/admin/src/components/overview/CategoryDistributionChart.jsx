import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const categoryData = [
    { name: "Airpods", value: 4500 },
    { name: "Laptop", value: 3200 },
    { name: "Mouse", value: 2800 },
    { name: "Card", value: 2100 },
    { name: "Processor", value: 1900 },
    { name: "Keyboard", value: 1800 },
    { name: "Case Fan", value: 1700 },
    { name: "Monitor", value: 1600 },
    { name: "Headphones", value: 1500 },
    { name: "PC", value: 1400 },
    { name: "iPad", value: 1300 },
    { name: "Smartwatch", value: 1200 }
];

const COLORS = [
	"#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B",
	"#EF4444", "#14B8A6", "#A855F7", "#3B82F6", "#F97316",
	"#84CC16", "#E11D48"
  ];
  

const CategoryDistributionChart = () => {
	const [getCategoryDistribution,setGetCategoryDistribution] = useState([])
	const fetchCategoryDistributionChart = async ()=>{
				try{
						const res = await fetch("http://localhost:8080/api/get-category-distribution",{
							method:"GET",
							credentials:"include",
							
						})
						const data = await res.json()
					console.log(data)
						setGetCategoryDistribution(data.data||[])
				}
				catch(err){
					
					toast.error(err)
				}
			}
			useEffect(() => {
		fetchCategoryDistributionChart()
	}, []);

	const filteredData = getCategoryDistribution.filter(item => item.value > 0);

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Category Distribution</h2>
			<div className='h-80'>
				<ResponsiveContainer width={"100%"} height={"100%"}>
					<PieChart>
						<Pie
							data={filteredData}
							cx={"50%"}
							cy={"50%"}
							labelLine={false}
							outerRadius={80}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
						>
							{filteredData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default CategoryDistributionChart;

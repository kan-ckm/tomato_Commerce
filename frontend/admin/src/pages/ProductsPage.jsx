import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesTrendChart from "../components/products/SalesTrendChart";
import ProductsTable from "../components/products/ProductsTable";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import displayVNDCurrency from"../helpers/displayINRCurrency"
const ProductsPage = () => {
	const [totalProducts, setTotalProducts] = useState(0);
	const [lowStockCount, setLowStockCount] = useState(0);
const [getTotalRevenue,setGetTotalRevenue] = useState(0)
	const navigate = useNavigate(); 
	const fetchTotalProducts = async () => {
		try {
			const res = await fetch("http://localhost:8080/api/get-product",{
				method: "GET",
				credentials: "include",
			})
			const data = await res.json();
			if (data.success) {
				setTotalProducts(data.data.length); 
			}
			
			const lowStock = data.data.filter(p => p.countInStock <= 5);
			setLowStockCount(lowStock.length);
		} catch (err) {
			console.error("Failed to fetch total products:", err);
		}
	};
		const fetchTotalRevenue = async ()=>{
				try{
						const res = await fetch("http://localhost:8080/api/get-total-sales-this-month",{
							method:"GET",
							credentials:"include",
							
						})
						const data = await res.json()
						console.log(data)
						setGetTotalRevenue(data.totalSales||0)
				}
				catch(err){
					
					toast.error(err)
				}
			}
	useEffect(() => {
		fetchTotalProducts();
		fetchTotalRevenue()
	}, []);
	
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Products' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
			<StatCard name='Total Products' icon={Package} value={totalProducts} color='#6366F1' />

					<StatCard name='Top Selling' icon={TrendingUp} value={89} color='#10B981' />
					<StatCard name='Low Stock' icon={AlertTriangle} value={lowStockCount} color='#F59E0B' />
					<StatCard name='Total Revenue' icon={DollarSign} value={displayVNDCurrency(getTotalRevenue)} color='#EF4444' />
				</motion.div>
				<div className="flex justify-between items-center mb-4">
	<button
		className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
		onClick={() => navigate("/admin/add-product")}
	>
		Add Product
	</button>
</div>

				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					<SalesTrendChart />
					<CategoryDistributionChart />
				</div>
	<h2 className="text-xl font-semibold">All Products</h2>
				<ProductsTable />
			</main>
		</div>
	);
};
export default ProductsPage;

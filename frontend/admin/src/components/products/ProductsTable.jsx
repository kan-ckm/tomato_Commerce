import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import displayVNDCurrency from"../../helpers/displayINRCurrency"
const ProductsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [editingProduct, setEditingProduct] = useState(null);
	const navigate = useNavigate();

	const MySwal = withReactContent(Swal);
	
	const fetchProducts = async () => {
		try {
			const res = await fetch("http://localhost:8080/api/get-product",{
				method: "GET",
				credentials: "include",
			});
			const data = await res.json();
			if (data.success) {
				setProducts(data.data);
				setFilteredProducts(data.data); 
			}
		} catch (err) {
			console.error("Failed to fetch products:", err);
		}
	};
	const handleDelete = async (id) => {
		const result = await MySwal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		});
		
		if (!result.isConfirmed) return;
		
		try {
			const res = await fetch(`http://localhost:8080/api/product-delete/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			console.log("Delete response:", data);
			if (data.success) {
				fetchProducts();
				
				MySwal.fire("Deleted!", "Product has been deleted.", "success");
			} else {
				MySwal.fire("Failed!", "Could not delete product.", "error");
			}
		} catch (err) {
			console.error("Error deleting product:", err);
			MySwal.fire("Error", "Something went wrong.", "error");
		}
	};
	
	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = products.filter(
			(product) =>
				product.productName.toLowerCase().includes(term) ||
			product.category.toLowerCase().includes(term)
		);
		
		setFilteredProducts(filtered);
	};
	const handleEdit = (product) => {
		navigate(`/admin/edit-product/${product._id}`);
	};
	
	
	useEffect(() => {
		fetchProducts();
	}, []);
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Product List</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search products...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Category
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Price
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Stock
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Sales
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-gray-700'>
						{filteredProducts.map((product) => (
							<motion.tr
								key={product._id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center'>
								<img
									src={
										Array.isArray(product.productImage) && product.productImage.length > 0
										? product.productImage[0]
										: "https://via.placeholder.com/40"
									}
									alt='Product'
									className='size-10 rounded-full object-cover'
								/>
									{product.productName}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.category}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
								{displayVNDCurrency(product?.sellingPrice)}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.countInStock || 0}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.sales || 0}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
								<button
										className='text-indigo-400 hover:text-indigo-300 mr-2'
										onClick={() => handleEdit(product)}
									>
										<Edit size={18} />
									</button>

																		<button
										className='text-red-400 hover:text-red-300'
										onClick={() => handleDelete(product._id)}
									>
										<Trash2 size={18} />
									</button>

								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};

export default ProductsTable;

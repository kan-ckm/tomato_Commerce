import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Modal, Input, Select } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;

const UsersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
const [editingUser, setEditingUser] = useState(null);
	const MySwal = withReactContent(Swal);


	const fetchUsers = async () => {
		try {
			const res = await fetch("http://localhost:8080/api/all-user", {
				method: "GET",
				credentials: "include", 
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
	
			
			if (data.success) {
				setUsers(data.data.allUser)
				setFilteredUsers(data.data.allUser)
			} 
			
		} catch (err) {
			toast.error( err);
		}
	};
	const fetchDeleteUser = async(userId)=>{
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
		try{
			const res = await fetch(`http://localhost:8080/api/users/${userId}`,{
				method:"DELETE",
				credentials:"include"

			})
			const data = await res.json()

			if (data.success) {

				fetchUsers();
				toast.success("User has been deleted.")
			}
			
		}catch(err){
			toast.error("Error deleting user:", err);
		}
	}
	const handleSaveEdit = async () => {
		try {
			const res = await fetch("http://localhost:8080/api/update-user", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					userId: editingUser._id,
					name: editingUser.name,
					email: editingUser.email,
					role: editingUser.role,
				}),
			});
			const data = await res.json();
			if (data.success) {
				fetchUsers();
				MySwal.fire("Updated!", "User has been updated.", "success");
				setIsModalOpen(false);
			}
		} catch (err) {
			toast.error("Error updating user:", err);
		}
	};
	
	const handleEdit = (user) => {
		setEditingUser(user);
		setIsModalOpen(true);
	};
	
	useEffect(() => {
	fetchUsers();
	}, []);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = users.filter(
			(user) =>
				user.name?.toLowerCase().includes(term) ||
				user.email?.toLowerCase().includes(term)
		);
		setFilteredUsers(filtered);
	};

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Users</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search users...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							{["Name", "Email", "Role", "Status", "Actions"].map((title) => (
								<th
									key={title}
									className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'
								>
									{title}
								</th>
							))}
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-700'>
						{filteredUsers.map((user) =>  (
							
							<motion.tr
								key={user._id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
						

									{user.profilePic ? (
										
										<img
											src={user.profilePic}
											alt={user.name}
											className="h-10 w-10 rounded-full object-cover"
										/>
										) : (
										<div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
											{user.name?.charAt(0)}
										</div>
										)}
										<div className='ml-4 text-sm font-medium text-gray-100'>{user.name}</div>
									</div>
								</td>
								<td className='px-6 py-4 text-sm text-gray-300'>{user.email}</td>
								<td className='px-6 py-4'>
									<span className='px-2 inline-flex text-xs font-semibold rounded-full bg-blue-800 text-blue-100'>
										{user.role || "Customer"}
									</span>
								</td>
								<td className='px-6 py-4'>
									<span
										className={`px-2 inline-flex text-xs font-semibold rounded-full ${
											user.status === "Active"
												? "bg-green-800 text-green-100"
												: "bg-red-800 text-red-100"
										}`}
									>
										{user.status || "Inactive"}
									</span>
								</td>
								<td className='px-6 py-4 text-sm text-gray-300'>
								<button
							className='text-indigo-400 hover:text-indigo-300 mr-2'
							onClick={() => handleEdit(user)}
								>
									Edit
								</button>
									<button className='text-red-400 hover:text-red-300' onClick={() => fetchDeleteUser(user?._id)}>Delete</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
					<Modal
			     title={<span className="text-white">Edit Admin</span>}
					open={isModalOpen}
					onOk={handleSaveEdit}
					onCancel={() => setIsModalOpen(false)}
					okText="Save"
					cancelText="Cancel"
					className="!text-white"
					closable={false} 
					okButtonProps={{ className: 'ok-button' }}
    				cancelButtonProps={{ className: 'cancel-button' }}
				>
					<label className="block mb-1 text-white">Name</label>
					<Input
						value={editingUser?.name}disabled
						onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
						className="mb-3 !text-white"
					/>

					<label className="block mb-1">Email</label>
					<Input
						value={editingUser?.email} disabled
						onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
						className="mb-3 !text-white"
					/>

					<label className="block mb-1">Role</label>
					<Select
					value={editingUser?.role}
					onChange={(value) => setEditingUser({ ...editingUser, role: value })}
					className="custom-select w-full"
					  dropdownClassName="custom-select-dropdown"
				>
					<Option  value="ADMIN">Admin</Option>
					<Option  value="GENERAL">General</Option>
					</Select>
				</Modal>	
		</motion.div>
	);
};

export default UsersTable;

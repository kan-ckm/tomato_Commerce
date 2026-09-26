import React, { useState } from 'react';
import productCategory from '../../helpers/productCategory';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const UploadProductPage = () => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    productImage: [], 
    description: '',
    price: '',
    sellingPrice: '',
    countInStock: 99,
  });
  const [viewingImage, setViewingImage] = useState(null); 

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = (e) => {
    const files = Array.from(e.target.files);
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, ...files],
    }));
  };

  const handleDeleteImage = (index) => {
    const newImages = [...data.productImage];
    newImages.splice(index, 1);
    setData((prev) => ({ ...prev, productImage: newImages }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('productName', data.productName);
  formData.append('brandName', data.brandName);
  formData.append('category', data.category);
  formData.append('description', data.description);
  formData.append('price', data.price);
  formData.append('sellingPrice', data.sellingPrice);
  formData.append('countInStock', data.countInStock);

  data.productImage.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const res = await fetch('http://localhost:8080/api/upload-product', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    const result = await res.json();
    console.log(result);
    if (result.success) {
      toast.success(result.message);

     
      setData({
        productName: '',
        brandName: '',
        category: '',
        productImage: [], 
        description: '',
        price: '',
        sellingPrice: '',
        countInStock: 99,
      });
    } else {
      toast.error(result.message);
    }
  } catch (err) {
    toast.error('Failed to upload product');
  }
};


  return (
    <motion.div
      className="p-10 min-h-screen overflow-y-auto w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg max-w-screen-xl w-full mx-auto px-10 py-6 text-white"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-bold mb-6"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Upload Product
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            type="text"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            placeholder="Product Name"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
            required
          />
          <motion.input
            type="text"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            placeholder="Brand Name"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
            required
          />
          <motion.input
            type="number"
            name="countInStock"
            value={data.countInStock}
            onChange={handleOnChange}
            placeholder="Stock Count"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
            required
          />
          <motion.select
            name="category"
            value={data.category}
            onChange={handleOnChange}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white"
            required
          >
            <option value="">Select Category</option>
            {productCategory.map((item, idx) => (
              <option key={idx} value={item.value}>
                {item.label}
              </option>
            ))}
          </motion.select>

          <div className="space-y-3">
            <label className="block text-lg font-medium">Images</label>
            <div className="flex gap-3 flex-wrap">
              {(data.productImage || []).map((img, i) => (
                <motion.div
                  key={i}
                  className="relative group"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <img
                    src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                    alt=""
                    className="w-24 h-24 object-cover rounded border border-gray-600 cursor-pointer"
                    onClick={() => setViewingImage(typeof img === 'string' ? img : URL.createObjectURL(img))} 
                  />
                  <button
                    type="button"
                    className="absolute bottom-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteImage(i)}
                  >
                    <MdDelete />
                  </button>
                </motion.div>
              ))}
            </div>
            <motion.label
              className="block cursor-pointer bg-gray-700 border border-gray-600 hover:border-blue-500 transition-all rounded-lg p-4 text-center"
             
            >
              <FaCloudUploadAlt className="text-2xl mx-auto mb-2" />
              <p className="text-sm">Upload Images</p>
              <input type="file" className="hidden" multiple onChange={handleUploadImage} />
            </motion.label>
          </div>

          <motion.input
            type="number"
            name="price"
            value={data.price}
            onChange={handleOnChange}
            placeholder="Price"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
            required
          />
          <motion.input
            type="number"
            name="sellingPrice"
            value={data.sellingPrice}
            onChange={handleOnChange}
            placeholder="Selling Price"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
            required
          />
          <motion.textarea
            name="description"
            value={data.description}
            onChange={handleOnChange}
            placeholder="Description"
            rows={4}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
          />

          <motion.button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            whileTap={{ scale: 0.98 }}
          >
            Upload Product
          </motion.button>
        </form>
      </motion.div>

      {viewingImage && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setViewingImage(null)}
        >
          <motion.img
            src={viewingImage}
            alt="Full-screen preview"
            className="max-w-3xl max-h-3xl object-contain"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadProductPage;

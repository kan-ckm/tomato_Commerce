import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import productCategory from "../../helpers/productCategory";
import uploadImage from "../../helpers/uploadImage";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/product-details/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        setProduct(result.data);
      } else {
        toast.error(result.message || "Failed to load product");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };
const handleUploadImage = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const result = await uploadImage(file);
    if (result?.url) {
      setProduct((prev) => ({
        ...prev,
        productImage: [...(prev.productImage || []), result.url],
      }));
    } else {
      toast.error("Image upload failed");
    }
  }
};


  const handleDeleteImage = (index) => {
    const newImages = [...product.productImage];
    newImages.splice(index, 1);
    setProduct((prev) => ({ ...prev, productImage: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/update-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(product),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Product updated");
        navigate("/products");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">No product found.</div>;

  return (
    <motion.div
      className="p-10 min-h-screen overflow-y-auto w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg max-w-screen-xl w-full mx-auto px-10 py-6 text-white">
        <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="productName"
            value={product.productName || ""}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
          />
          <input
            type="text"
            name="brandName"
            value={product.brandName || ""}
            onChange={handleChange}
            placeholder="Brand Name"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
          />
          <input
            type="number"
            name="countInStock"
            value={product.countInStock || ""}
            onChange={handleChange}
            placeholder="Stock Count"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
          />
          <select
            name="category"
            value={product.category || ""}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white"
          >
            <option value="">Select Category</option>
            {productCategory.map((item, idx) => (
              <option key={idx} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <div className="space-y-3">
            <label className="block text-lg font-medium">Images</label>
            <div className="flex gap-3 flex-wrap">
              {(product.productImage || []).map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt=""
                    className="w-24 h-24 object-cover rounded border border-gray-600"
                  />
                  <button
                    type="button"
                    className="absolute bottom-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteImage(i)}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
            <label className="block cursor-pointer bg-gray-700 border border-gray-600 hover:border-blue-500 transition-all rounded-lg p-4 text-center">
              <FaCloudUploadAlt className="text-2xl mx-auto mb-2" />
              <p className="text-sm">Upload Image</p>
              <input type="file" className="hidden" onChange={handleUploadImage} />
            </label>
          </div>

          <input
            type="number"
            name="price"
            value={product.price || ""}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
          />
          <input
            type="number"
            name="sellingPrice"
            value={product.sellingPrice || ""}
            onChange={handleChange}
            placeholder="Selling Price"
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
          />
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
          >
            Update Product
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProduct;

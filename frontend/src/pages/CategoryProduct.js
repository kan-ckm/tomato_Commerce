import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import SummaryApi from '../common';

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectCategory, setSelectCategory] = useState({});
  const [sortBy, setSortBy] = useState("");

  const fetchData = async (categoriesToFetch) => {
    try {
      setLoading(true);
         const baseUrl = SummaryApi.filterProduct.url;
      const url = new URL(baseUrl, window.location.origin);

      if (categoriesToFetch.length > 0) {
        url.searchParams.append("category", categoriesToFetch.join(","));
      }
      if (sortBy) {
        url.searchParams.append("sortBy", sortBy);
      }

      console.log("Fetching:", url.toString());

   
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await res.json();
      setData(response?.data || []);
      
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;

    if (params.categoryName && params.categoryName !== "all") {
      navigate('/product-category/all');
    }

    setSelectCategory((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  const handleSortBy = (e) => {
    setSortBy(e.target.value);
  };

  useEffect(() => {
    if (params.categoryName && params.categoryName !== "all") {
      setSelectCategory({ [params.categoryName]: true });
    } else {
      setSelectCategory({});
    }
  }, [params.categoryName]);

  useEffect(() => {
    const selectedCategories = Object.keys(selectCategory).filter((key) => selectCategory[key]);
    
    if (params.categoryName && params.categoryName !== "all") {
      fetchData([params.categoryName]);
    } else {
      fetchData(selectedCategories);
    }
  }, [selectCategory, sortBy, params.categoryName]);

  return (
    <div className="container mx-auto p-4">
      <div className="hidden lg:grid grid-cols-[200px,1fr]">
        
        <div className="bg-white p-2 min-h-[calc(100vh-200px)] overflow-y-scroll">
          
          <div>
            <h3 className="p-1 text-[16px] uppercase font-medium text-yellow-400 border-b-2 border-yellow-200">
              Sort by
            </h3>
            <form className="text-sm flex flex-col gap-2 py-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="sortBy"
                  value="price-asc"
                  checked={sortBy === "price-asc"}
                  onChange={handleSortBy}
                />
                <label>Price - Low to High</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="sortBy"
                  value="price-desc"
                  checked={sortBy === "price-desc"}
                  onChange={handleSortBy}
                />
                <label>Price - High to Low</label>
              </div>
            </form>
          </div>

          <div className="mt-6">
            <h3 className="p-1 text-[16px] uppercase font-medium text-yellow-400 border-b-2 border-yellow-200">
              Category Product
            </h3>
            <form className="text-sm flex flex-col gap-2 py-2">
              {productCategory.map((categoryName, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="category"
                    checked={selectCategory[categoryName?.value] || false}
                    value={categoryName?.value}
                    id={categoryName?.value}
                    onChange={handleSelectCategory}
                  />
                  <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                </div>
              ))}
            </form>
          </div>

        </div>

        <div>
          <CategoryWiseProductDisplay
            heading={
              params?.categoryName && params.categoryName !== "all"
                ? `Recommended ${params.categoryName}`
                : `Sreach Results: ${data.length}`
            }
            products={data}
            loading={loading}
          />
        </div>

      </div>
    </div>
  );
};

export default CategoryProduct;

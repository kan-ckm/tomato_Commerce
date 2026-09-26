import { useState } from "react";
import SummaryApi from "../common";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import  displayVNDCurrency  from "../helpers/displayINRCurrency";
import { useNavigate } from "react-router-dom";


export default function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [noResult, setNoResult] = useState(false);

const navigate = useNavigate()

const [searchHistory, setSearchHistory] = useState(() => {
  const saved = localStorage.getItem("searchHistory");
  return saved ? JSON.parse(saved) : [];
});

  
const handleSearch = async (e) => {
  
    const value = e.target.value;
    setKeyword(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setNoResult(false);
      return;
    }
  
    try {
      const res = await axios.get(`${SummaryApi.searchProduct.url}?keyword=${value}`);
      if (res.data.success && res.data.data.length > 0) {
        setSuggestions(res.data.data);
        setNoResult(false);
      } else {
        setSuggestions([]);
        setNoResult(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSuggestions([]);
      setNoResult(true);
    }
  };

  const handleSelectSuggestion = (product) => {
    saveToHistory(keyword);
    setSuggestions([]);
    setIsFocused(false);
    navigate(`/product/${product._id}`);
    setTimeout(() => {
      setKeyword('');
    }, 100);
  };
  

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {

    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleOverlayClick = () => {
    setIsFocused(false);
    setSuggestions([]);
    setKeyword('');
  };
  const saveToHistory = (keyword) => {
    if (!keyword.trim()) return;
  
    let updatedHistory = [keyword, ...searchHistory.filter(item => item !== keyword)];
    updatedHistory = updatedHistory.slice(0, 10); 
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };
  

  return (
    <>

      {isFocused && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={handleOverlayClick}
        />
      )}

      <div className="relative w-full max-w-sm z-40 mx-auto">
        <div className="hidden lg:flex items-center justify-between w-full border rounded-full pl-2 bg-white peer-hover:shadow-lg transition duration-500">
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleSearch}
            value={keyword}
          />
          <div className="text-lg min-w-[50px] h-8 bg-yellow-300 flex items-center justify-center rounded-r-full">
            <FaSearch />
          </div>
        </div>
        {isFocused && (searchHistory.length > 0 || suggestions.length > 0) && (
  <ul className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-96 overflow-y-auto w-[450px] scrollbar-hide">
    {searchHistory.length > 0 && (
      <>
        <div className="bg-gray-200 py-1 mt-2  flex justify-between items-center sticky top-0 z-10">
          <span className="ml-2  text-slate-700 font-medium">Search History</span>
          <button
            className=" text-slate-700 font-medium"
            onMouseDown={() => {
              setSearchHistory([]);
              localStorage.removeItem("searchHistory");
            }}
          >
           Clear all
          </button>
        </div>
        {searchHistory.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center px-4 py-2 hover:bg-slate-100 cursor-pointer"
          >
            <span
              onMouseDown={() => {
                setKeyword(item);
                handleSearch({ target: { value: item } });
                saveToHistory(item);
              }}
            >
              {item}
            </span>
            <button
              className="text-gray-400 text-sm"
              onMouseDown={() => {
                const updated = searchHistory.filter((_, i) => i !== index);
                setSearchHistory(updated);
                localStorage.setItem("searchHistory", JSON.stringify(updated));
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </>
    )}

    {suggestions.length > 0 && (
      <>
        <div className="bg-gray-100 py-1 text-slate-700 font-medium sticky top-0 z-10">
          <span className="ml-2">Recommended Products</span>
        </div>
        {suggestions.map((item) => (
          <li
            key={item._id}
            className="flex items-start gap-3 px-4 py-2 hover:bg-slate-50 cursor-pointer"
            onMouseDown={() => handleSelectSuggestion(item)}
          >
            <img
              src={item?.productImage[0]}
              alt={item.productName}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold leading-4">{item.productName}</p>
              <div className="text-xs text-gray-600">
                {item.capacity} - {item.power}
              </div>
              <div className="text-sm">
                <span className="text-red-600 font-bold">
                  {displayVNDCurrency(item?.sellingPrice)}
                </span>
                <span className="line-through text-gray-400 ml-2 text-xs">
                  {displayVNDCurrency(item?.price)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </>
    )}
  </ul>
)}

        {noResult && (
  <ul className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
    <li className="px-4 py-2 text-gray-500">No products were found.</li>
  </ul>
)}
      </div>
    </>
  );
}

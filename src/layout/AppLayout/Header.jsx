import { NavLink, useNavigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import Loader from "../../pages/Loader";
import { CiUser } from "react-icons/ci";
import { UserContext } from "../../context/ContextApi";
import { getSearchProduct } from "../../api/Products";

export const Header = () => {
  const {
    cart,
    token,
    setProduct,
    isPending,
    searchLoading,
    setSearchLoading,
    setErrorDataProduct,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const Active = ({ isActive }) =>
    isActive ? "text-green-600 font-bold" : "text-gray-700";

  const handleOnchange = async (e) => {
    let { value } = e.target;
    setInputValue(value);

    if (value.trim() === "") {
      setSearchLoading(false);
      setErrorDataProduct("");
      return;
    }

    try {
      setSearchLoading(true);
      const getSearchPlant = await getSearchProduct(value);
      if (getSearchPlant.status === 200) {
        setProduct(getSearchPlant.data.data);
        navigate(`/products`);
      }
      if (getSearchPlant.status === 404) {
        setErrorDataProduct(getSearchPlant.response.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <>
      <header
        className={`w-full bg-white shadow-md fixed top-0 left-0 z-50 ${
          isPending ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo Section */}
          <NavLink
            className="text-2xl font-extrabold text-green-600 cursor-pointer"
            to={"/"}
          >
            Leafnity
          </NavLink>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={Active}>
              Home
            </NavLink>
            <NavLink to="/products" className={Active}>
              Products
            </NavLink>
            <NavLink to="/cart" className="relative">
              <ShoppingCart className="text-gray-700 hover:text-green-600 transition" />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cart.length}
                </span>
              )}
            </NavLink>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={inputValue}
                onChange={handleOnchange}
                disabled={isPending}
                className="bg-gray-100 px-4 py-2 rounded-full pl-10 w-48 focus:w-64 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <div className="absolute left-3">
                {searchLoading ? <Loader size={5} /> : <Search size={18} />}
              </div>
            </div>
            <NavLink to={token ? "/account" : "/login"} className={Active}>
              <CiUser size={24} />
            </NavLink>
          </nav>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center gap-4">
            <NavLink to="/cart" className="relative">
              <ShoppingCart className="text-gray-700 hover:text-green-600 transition" />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                  {cart.length}
                </span>
              )}
            </NavLink>
            <NavLink
              to={token ? "/account" : "/login"}
              className="text-gray-700 hover:text-green-600 transition"
            >
              <CiUser size={24} />
            </NavLink>
          </div>
        </div>
      </header>
    </>
  );
};

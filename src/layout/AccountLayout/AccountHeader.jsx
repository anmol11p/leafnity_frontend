import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/ContextApi";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTruck, FaUser, FaHeadset } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { RiLockPasswordLine, RiLogoutCircleRLine } from "react-icons/ri";
import Cookies from "js-cookie";

const AccountHeader = () => {
  const { token, user, setToken } = useContext(UserContext);
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleLogOut = () => {
    Cookies.remove("token");
    setToken("");
  };

  return (
    <div className=" p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex justify-center items-center text-xl font-bold">
          {user?.name
            ? user.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()
            : "U"}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
          <span className="text-sm text-gray-600">{time}</span>
        </div>
      </div>

      <div className="space-y-4">
        <NavLink
          to="/account/profile"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-3 text-lg text-blue-600 font-semibold"
              : "flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600"
          }
        >
          <FaUser className="text-xl" /> My Profile
        </NavLink>
        <NavLink
          to="/account/changePassword"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-3 text-lg text-blue-600 font-semibold"
              : "flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600"
          }
        >
          <RiLockPasswordLine className="text-xl" /> Change Password
        </NavLink>
        <NavLink
          to="/account/address"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-3 text-lg text-blue-600 font-semibold"
              : "flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600"
          }
        >
          <FaLocationDot className="text-xl" /> Delivery Address
        </NavLink>
        <NavLink
          to="/account/order"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-3 text-lg text-blue-600 font-semibold"
              : "flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600"
          }
        >
          <FaTruck className="text-xl" /> Orders
        </NavLink>
        <NavLink
          to="/account/customerCare"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-3 text-lg text-blue-600 font-semibold"
              : "flex items-center gap-3 text-lg text-gray-700 hover:text-blue-600"
          }
        >
          <FaHeadset className="text-xl" /> Customer Care
        </NavLink>
      </div>

      <div className="mt-6">
        <button
          onClick={handleLogOut}
          className="flex items-center gap-3 w-full p-3  cursor-pointer text-lg text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          <RiLogoutCircleRLine className="text-xl" /> Log Out
        </button>
      </div>
    </div>
  );
};

export default AccountHeader;

import { Outlet } from "react-router-dom";
import AccountHeader from "./AccountHeader";
import { memo, useContext } from "react";
import React from "react";
import { UserContext } from "../../context/ContextApi";
import Loader from "../../pages/Loader";

const AccountLayout = memo(() => {
  const { user, isPending } = useContext(UserContext);

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    if (hours >= 17 && hours < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <div className="p-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Left Side: Account Header */}
        <div className="md:col-span-1 flex flex-col items-start  p-6 rounded-lg  space-y-6">
          <AccountHeader />
        </div>

        {/* Right Side: User Greeting and Outlet */}
        <div className="md:col-span-3 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            {getGreeting()}! {user?.name?.split(" ")[0]}
          </h2>
          <Outlet />
        </div>
      </div>
    </div>
  );
});

export default AccountLayout;

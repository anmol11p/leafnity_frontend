import React, { useContext, useReducer, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { changePassword } from "../../Authentication/Authentication";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { UserContext } from "../../context/ContextApi";
import { reducer } from "../../api/imp.function";
import Loader from "../Loader";

const ChangePassword = () => {
  const { token, setToken, isPending } = useContext(UserContext);
  const [loadingState, dispatch] = useReducer(reducer, {
    changPassLoading: false,
  });

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleToggle = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const userInput = Object.fromEntries(formData);

      dispatch({ type: "LOADING", payload: "changPassLoading" });

      const resp = await changePassword(userInput, token);

      if (resp.status === 200) {
        const newToken = resp.data.token;
        Cookies.set("token", newToken, { expires: 2 });
        setToken(Cookies.get("token") || "");
        toast.success(resp?.data?.message);
        e.target.reset();
      } else {
        toast.error(resp?.response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while changing the password");
    } finally {
      dispatch({ type: "STOP_LOADING", payload: "changPassLoading" });
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg  max-w-md w-full">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {["password", "newPassword", "confirmPassword"].map((field) => (
            <div className="form-group" key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700"
              >
                {field === "password"
                  ? "Current Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm New Password"}
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword[field] ? "text" : "password"}
                  name={field}
                  id={field}
                  placeholder={`Enter ${field}`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleToggle(field)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {!showPassword[field] ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>
          ))}
          <div>
            <button
              className={`${
                loadingState.changPassLoading
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
              } w-full py-3 px-4 rounded-lg focus:outline-none transition duration-200 ease-in-out hover:bg-blue-600 flex items-center justify-center`}
              type="submit"
            >
              {loadingState.changPassLoading ? <Loader /> : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;

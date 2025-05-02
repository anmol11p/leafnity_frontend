import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaArrowRightLong } from "react-icons/fa6";
import { IoIosEye, IoMdMail } from "react-icons/io";
import { toast } from "react-toastify";
import { sendResetEmail, UserLogin } from "../Authentication/Authentication";
import Cookies from "js-cookie";
import Loader from "./Loader";
import { UserContext } from "../context/ContextApi";

const Login = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/account");
    }
  }, [token, navigate]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const userInput = Object.fromEntries(formData);
      setLoader(true);
      const resp = await UserLogin(userInput);

      if (resp.status === 200) {
        toast.success(resp.data.message);
        const token = resp.data.token;
        Cookies.set("token", token, { expires: 2 });
        setToken(token);
        navigate("/account");
      } else {
        toast.error(resp.response?.data?.message || "Login failed");
      }

      if (resp.message === "Network Error") {
        toast.error("Server is busy. Please try again later.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {!token &&
        (isEditingMode ? (
          <PasswordReset setIsEditingMode={setIsEditingMode} />
        ) : (
          <section className="min-h-screen flex items-center justify-center  p-4 mt-20">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Login</h2>
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <NavLink
                    to="/signup"
                    className="text-blue-600 hover:underline"
                  >
                    Create account
                  </NavLink>
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full border rounded-md p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute cursor-pointer top-3 right-3 text-gray-500"
                  >
                    {showPassword ? (
                      <IoIosEye size={20} />
                    ) : (
                      <FaEyeSlash size={20} />
                    )}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditingMode(true)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>

                <div className="space-y-4">
                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 flex justify-center items-center"
                  >
                    {loader ? <Loader /> : "Sign In"}
                  </button>

                  <NavLink
                    to="/products"
                    className="flex items-center justify-center text-blue-600 hover:underline"
                  >
                    Return to Store <FaArrowRightLong className="ml-2" />
                  </NavLink>
                </div>
              </form>
            </div>
          </section>
        ))}
    </>
  );
};

const PasswordReset = ({ setIsEditingMode }) => {
  const [loading, setLoading] = useState(false);

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const { email } = Object.fromEntries(formData);
      setLoading(true);
      const resp = await sendResetEmail(email);

      if (resp.status === 200) {
        toast.success(resp.data.message);
        event.target.reset();
        setIsEditingMode(false);
      } else {
        toast.error(resp.response?.data?.message || "Failed to send email");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handleResetSubmit} className="space-y-5">
          <div className="relative">
            <IoMdMail
              className="absolute top-3 left-3 text-gray-500"
              size={20}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full border rounded-md p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 flex justify-center items-center"
          >
            {loading ? <Loader /> : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;

import React, { useContext, useEffect, useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosEye } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserRegisteration } from "../Authentication/Authentication";
import Cookies from "js-cookie";
import Loader from "./Loader";
import { UserContext } from "../context/ContextApi";

const SignUp = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(UserContext);
  const [Toggle, setToggle] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/account");
    }
  }, [token, navigate]);

  const handleToggle = () => setToggle((prev) => !prev);

  const handle_form_submit = async (event) => {
    event.preventDefault();
    try {
      const formdata = new FormData(event.target);
      const userInput = Object.fromEntries(formdata);
      setLoader(true);
      const resp = await UserRegisteration(userInput);

      switch (resp.status) {
        case 400:
          toast.error(resp.response.data.message);
          break;
        case 201:
          event.target.reset();
          toast.success(resp.data.message);
          const token = resp.data.token;
          Cookies.set("token", token, { expires: 2 });
          setToken(token);
          navigate("/");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {!token && (
        <section className="flex items-center justify-center min-h-screen mt-20  p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Create Account
            </h2>

            <form onSubmit={handle_form_submit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                className="w-full p-3 border border-gray-300 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full p-3 border border-gray-300 rounded"
              />
              <div className="relative">
                <input
                  type={!Toggle ? "password" : "text"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full p-3 border border-gray-300 rounded"
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer text-gray-500"
                  onClick={handleToggle}
                >
                  {Toggle ? <IoIosEye /> : <FaEyeSlash />}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
                >
                  {loader ? <Loader /> : "Create"}
                </button>

                <NavLink
                  to="/"
                  className="flex items-center justify-center gap-2 text-blue-600 hover:underline"
                >
                  Return to Store <FaArrowRightLong />
                </NavLink>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default SignUp;

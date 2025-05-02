import React, { useEffect, useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkTokenValidity,
  updatePassword,
} from "../Authentication/Authentication";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import Loader from "./Loader";

const ResetPassword = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const resp = await checkTokenValidity(token);
        switch (resp.status) {
          case 400:
            setIsValidToken(false);
            toast.error("Invalid or expired token");
            navigate("/login");
            break;
          case 200:
            setIsValidToken(true);
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    };
    validateToken();
  }, [token, navigate]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formdata = new FormData(event.target);
    const { newPassword } = Object.fromEntries(formdata);

    try {
      setLoading(true);
      const resp = await updatePassword(token, newPassword);

      switch (resp.status) {
        case 200:
          toast.success(resp?.data?.message);
          event.target.reset();
          navigate("/login");
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center text-green-700">
          Reset Your Password
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <label className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 bg-white">
            <RiLockPasswordFill className="text-xl text-gray-600 mr-2" />
            <input
              type={show ? "text" : "password"}
              name="newPassword"
              required
              className="flex-grow outline-none bg-transparent"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="text-gray-500 hover:text-gray-700"
            >
              {show ? <FaEye /> : <FaEyeSlash />}
            </button>
          </label>
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white font-semibold transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading ? <Loader /> : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;

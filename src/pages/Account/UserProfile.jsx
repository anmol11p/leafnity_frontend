import React, { useContext, useEffect, useReducer, useState } from "react";
import { updateUser } from "../../Authentication/Authentication";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Loader from "../../pages/Loader";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/ContextApi";
import { reducer } from "../../api/imp.function";

const UserProfile = () => {
  const [userdata, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { token, user, setToken, isPending } = useContext(UserContext);
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const [loadingState, dispatch] = useReducer(reducer, {
    profileLoading: false,
  });

  useEffect(() => {
    if (!token) navigate("/login");
    if (user) setUserData({ name: user.name || "", email: user.email || "" });
  }, [token, user]);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "LOADING", payload: "profileLoading" });
      const resp = await updateUser(token, userdata);
      switch (resp.status) {
        case 400:
          toast.error(resp.response.data.message);
          break;
        case 200:
          const token = await resp.data.token;
          Cookies.set("token", token, { expires: 2 });
          setToken(Cookies.get("token") || "");
          toast.success(resp.data.message);
        default:
          console.log(resp.status);
          break;
      }
    } catch (error) {
      dispatch({ type: "STOP_LOADING", payload: "profileLoading" });
      console.error(error);
    } finally {
      dispatch({ type: "STOP_LOADING", payload: "profileLoading" });
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg  max-w-md w-full">
        <form className="space-y-6" onSubmit={handleFormSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="name"
              id="username"
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={userdata.name}
              onChange={handleOnchange}
              placeholder="Enter New Username"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-2 p-3 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={userdata.email}
              onChange={handleOnchange}
              placeholder="Enter New Email"
            />
          </div>

          <div className="flex justify-center mt-6">
            <button
              className={`${
                loadingState.profileLoading
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
              } w-full py-3 px-4 rounded-lg focus:outline-none transition duration-200 ease-in-out hover:bg-blue-600 flex items-center justify-center`}
              type="submit"
            >
              {loadingState.profileLoading ? <Loader /> : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;

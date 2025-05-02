import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
});
const UserRegisteration = async (userinput) => {
  try {
    const resp = await api.post("/signup", userinput);
    return resp;
  } catch (error) {
    return error;
  }
};
const UserLogin = async (userinput) => {
  try {
    const resp = await api.post("/login", userinput);
    return resp;
  } catch (error) {
    return error;
  }
};

const getLoginUser = async (token) => {
  try {
    const resp = await api.get("/LoginUser", {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const updateUser = async (token, userInput) => {
  try {
    const resp = await api.patch("/updateUser", userInput, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
const changePassword = async (userInput, token) => {
  try {
    const resp = await api.patch("/changePassword", userInput, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const sendResetEmail = async (email) => {
  try {
    const resp = await api.post("/forgotPassword", { email });
    return resp;
  } catch (error) {
    return error;
  }
};
const updatePassword = async (token, newPassword) => {
  try {
    const resp = await api.post(`/resetPassword/${token}`, { newPassword });
    return resp;
  } catch (error) {
    return error;
  }
};
const checkTokenValidity = async (token) => {
  try {
    const resp = await api.post(`/tokenValidity/${token}`);
    return resp;
  } catch (error) {
    return error;
  }
};
export {
  updatePassword, //reset
  checkTokenValidity, //reset page
  getLoginUser,
  sendResetEmail,
  updateUser,
  UserLogin,
  UserRegisteration,
  changePassword,
};

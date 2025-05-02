import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URI}address`,
});

const getAddress = async (token) => {
  try {
    const resp = await api.get("/getAddress", {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const getPincodeDetails = async (postalCode) => {
  try {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${postalCode}`
    );
    return response;
  } catch (error) {
    return error;
  }
};
const createAddress = async (token, userInput) => {
  try {
    const resp = await api.post("/create", userInput, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const DeleteAddress = async (token, id) => {
  try {
    const resp = await api.delete(`/delete/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const getSingleAddress = async (token, id) => {
  try {
    const resp = await api.get(`/getAddress/${id}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const updateAddress = async (token, id, userInput) => {
  try {
    const resp = await api.patch(`/update/${id}`, userInput, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const restoreDeletedAddress = async (token, data) => {
  try {
    const resp = await api.post("/restoreDeletedAddress", data, {
      headers: { token: `Bearer ${token}` },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
export {
  restoreDeletedAddress,
  getAddress,
  DeleteAddress,
  getPincodeDetails,
  createAddress,
  getSingleAddress,
  updateAddress,
};

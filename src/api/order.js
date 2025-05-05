import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URI}/order`,
});

const createPayment = async (token, amount) => {
  try {
    const resp = await api.post(
      "/create",
      { amount },
      {
        headers: {
          token: `Bearer ${token}`,
        },
      }
    );
    return resp;
  } catch (error) {
    return error;
  }
};

const verifyPayment = async (token, response) => {
  try {
    const resp = await api.post("/verify-payment", response, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const saveOrderToDB = async (token, userInput) => {
  try {
    const resp = await api.post("/save", userInput, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const getAllOrderItem = async (token) => {
  try {
    const resp = await api.get("/getAllorder", {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
const orderItemDetails = async (token, itemId) => {
  try {
    const resp = await api.get(`/getOrderItem/${itemId}`, {
      headers: { token: `Bearer ${token}` },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const CancelOrder = async (token, data) => {
  try {
    const resp = await api.post("/cancel", data, {
      headers: { token: `Bearer ${token}` },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
export {
  createPayment,
  verifyPayment,
  saveOrderToDB,
  getAllOrderItem,
  orderItemDetails,
  CancelOrder,
};

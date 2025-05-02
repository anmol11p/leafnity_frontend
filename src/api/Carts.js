import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URI}cart`,
});

const addToCart = async (userInput, token) => {
  try {
    const resp = await api.post("/add", userInput, {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const getAllCartItems = async (token) => {
  try {
    const resp = await api.get("/getCartInfo", {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};
const removePlant = async (plantId, token) => {
  try {
    const resp = await api.delete(`/deleteCartItemByplantId/${plantId}`, {
      headers: {
        token: `Bearer ${token}`,
      },
    });

    return resp;
  } catch (error) {
    return error;
  }
};
const AllItemsClear = async (token) => {
  try {
    const resp = await api.delete("/clearCart", {
      headers: {
        token: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    return error;
  }
};

const handleClearAll = async (token, setCart, dispatch) => {
  try {
    dispatch({ payload: "clearLoad", type: "LOADING" });
    const resp = await AllItemsClear(token);
    switch (resp.status) {
      case 200:
        const updatedCart = await getAllCartItems(token);
        if (updatedCart.status === 200) {
          setCart(updatedCart.data.cart);
          toast.success(resp.data.message);
        }
        break;
      case 404:
        toast.error(resp.response.data.message);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
    dispatch({ payload: "clearLoad", type: "STOP_LOADING" });
  } finally {
    dispatch({ payload: "clearLoad", type: "STOP_LOADING" });
  }
};

export {
  addToCart,
  getAllCartItems,
  removePlant,
  AllItemsClear,
  handleClearAll,
};

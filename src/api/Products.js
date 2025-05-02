import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
});
const getAllProducts = async () => {
  try {
    const resp = await api.get("/products");

    return resp;
  } catch (error) {
    return error;
  }
};

const getSinglePlantInfo = async (plantName, plantId) => {
  try {
    const resp = await api.get(
      `/products?plantName=${plantName}&plantId=${plantId}`
    );
    return resp;
  } catch (error) {
    return error;
  }
};

const getSearchProduct = async (data) => {
  try {
    const resp = await api.post(`/products?plantName=${data}`);

    return resp;
  } catch (error) {
    return error;
  }
};
export { getAllProducts, getSinglePlantInfo, getSearchProduct };

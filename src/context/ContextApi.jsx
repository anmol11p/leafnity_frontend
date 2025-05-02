import React, {
  createContext,
  useState,
  useEffect,
  useTransition,
} from "react";
import Cookies from "js-cookie";
import { getLoginUser } from "../Authentication/Authentication";
import { getAllCartItems } from "../api/Carts";
import { getAddress } from "../api/Adress";
import { getAllOrderItem } from "../api/order";
import { getAllProducts } from "../api/Products";

const UserContext = createContext();

const ContextApi = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [product, setProduct] = useState([]);
  const [user, setUser] = useState({});
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState(null);
  const [order, setOrder] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [searchLoading, setSearchLoading] = useState(false);
  const [ErrorDataProduct, setErrorDataProduct] = useState("");

  useEffect(() => {
    if (token) {
      startTransition(() => {
        const fetchData = async () => {
          try {
            const [userResp, cartResp, addressResp, orderResp] =
              await Promise.all([
                getLoginUser(token),
                getAllCartItems(token),
                getAddress(token),
                getAllOrderItem(token),
              ]);

            if (userResp.status === 200) setUser(userResp.data.user);
            if (cartResp.status === 200) setCart(cartResp.data.cart);
            if (addressResp.status === 200)
              setAddress(addressResp.data.address);
            if (orderResp.status === 200) setOrder(orderResp.data.details);
            // if (productsResp.status === 200) setProduct(productsResp.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };

        fetchData();
      });
    }

    const fetchProducts = async () => {
      try {
        const productsResp = await getAllProducts();
        if (productsResp.status === 200) {
          setProduct(productsResp.data);
        } else {
          setErrorDataProduct("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorDataProduct("Error fetching products");
      }
    };

    fetchProducts();
  }, [token]);

  // console.log(cart);
  return (
    <UserContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        cart,
        setCart,
        address,
        setAddress,
        order,
        setOrder,
        product,
        setProduct,
        isPending,
        searchLoading,
        setSearchLoading,
        ErrorDataProduct,
        setErrorDataProduct,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
export default ContextApi;

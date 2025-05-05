import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
  useTransition,
} from "react";
import { getSinglePlantInfo } from "../api/Products";
import { IoMdAdd } from "react-icons/io";

import { FaStar } from "react-icons/fa";
import { addToCart, getAllCartItems } from "../api/Carts";
import { UserContext } from "../context/ContextApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Accordion from "./Accordion";
import { PaymentForm } from "./cartComponent/CheckOut";
import {
  createPayment,
  getAllOrderItem,
  saveOrderToDB,
  verifyPayment,
} from "../api/order";
import Loader from "./Loader";
import { reducer } from "../api/imp.function";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";

const SingleProductInfo = ({ plantName, plantId }) => {
  const [data, setData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { token, setCart, setOrder, user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isEditingMode, SetIsEditingMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [totalMoney, setTotalMoney] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [loadingState, dispatch] = useReducer(reducer, {
    addToCart: false,
    buyNow: false,
  });

  useEffect(() => {
    startTransition(() => {
      const fetchData = async () => {
        try {
          const resp = await getSinglePlantInfo(plantName, plantId);
          if (resp.status === 200) setData(resp.data.plantInfo);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    });
  }, [plantId, plantName]);

  const updateQuantity = (type) => {
    setQuantity((prev) => (type === "inc" ? prev + 1 : Math.max(1, prev - 1)));
  };

  const handleBuyButton = async () => {
    try {
      if (!token) {
        navigate("/login");
        toast.error("Login first to buy the product");
      }
      if (!data) return;
      dispatch({ type: "LOADING", payload: "buyNow" });
      const totalAmount = data.selling_price * quantity;
      setTotalMoney(totalAmount);
      SetIsEditingMode(true);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "STOP_LOADING", payload: "buyNow" });
    }
  };

  const handleAddToCart = async () => {
    try {
      dispatch({ type: "LOADING", payload: "addToCart" });
      const resp = await addToCart({ plantId, quantity }, token);
      if (resp.status === 200) {
        toast.success(resp.data.message);
        const updatedCart = await getAllCartItems(token);
        if (updatedCart.status === 200) setCart(updatedCart.data.cart);
        navigate("/cart");
      }
      if (
        resp.status === 400 &&
        resp.response.data.message === "jwt must be provided"
      ) {
        toast.error("Login first to add the product to your cart!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "STOP_LOADING", payload: "addToCart" });
    }
  };

  const handleCheckOut = async (amount) => {
    try {
      if (!selectedAddress) {
        toast.error("Please select an address to purchase the item");
        return;
      }
      dispatch({ type: "LOADING", payload: "buyNow" });

      const response = await createPayment(token, amount);
      const { data: paymentData } = response;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: paymentData?.order?.amount,
        currency: "INR",
        name: "Leafnity",
        description: "Purchase plants",
        order_id: paymentData?.order?.id,
        handler: async (response) => {
          try {
            const verify = await verifyPayment(token, response);
            if (verify?.data?.success && verify?.status === 200) {
              const items = [
                { plantId: plantId, quantity, totalAmount: totalMoney },
              ];
              const resp = await saveOrderToDB(token, {
                items,
                razorpayOrderId: paymentData?.order?.id,
                totalAmount: totalMoney,
                addressId: selectedAddress,
              });
              if (resp.status === 200) {
                const updateOrder = await getAllOrderItem(token);
                if (updateOrder?.status === 200) {
                  setOrder(updateOrder?.data?.details);
                  SetIsEditingMode(false);
                  toast.success(resp?.data?.message);
                }
              }
            } else {
              toast.error("Payment Verification Failed!");
            }
          } catch (error) {
            console.error("Payment Verification Error:", error);
          }
        },
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "guest@example.com",
          contact: user?.phone || "0000000000",
        },
        theme: { color: "#2E7D32" },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ type: "STOP_LOADING", payload: "buyNow" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      {isPending ? (
        <div className="flex h-96 items-center justify-center">
          <Loader className="h-12 w-12 text-green-600" />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Image Section */}
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all hover:shadow-2xl">
              <img
                className="h-full w-full object-cover"
                src={data?.image_src}
                alt={data?.plant_name}
                loading="lazy"
              />
              {data?.percent_off && (
                <div className="absolute top-4 right-4 rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white">
                  {data.percent_off}% OFF
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  {data?.plant_name}
                </h1>

                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: data?.rating }, (_, i) => (
                      <FaStar key={i} className="h-5 w-5" />
                    ))}
                  </div>
                  <span className="text-gray-500">
                    ({data?.rating} ratings)
                  </span>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{data?.selling_price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{data?.total_price}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-lg font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity("dec")}
                      className="text-2xl  text-red-500 cursor-pointer hover:text-red-300"
                    >
                      {/* - */}
                      <IoRemoveCircle />
                    </button>
                    <span className="w-8 text-center text-xl font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity("inc")}
                      className="text-2xl text-green-500 cursor-pointer hover:text-green-300"
                    >
                      <IoAddCircle />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditingMode ? (
                  <PaymentForm
                    SetIsEditingMode={SetIsEditingMode}
                    handleCheckOut={handleCheckOut}
                    totalMoney={totalMoney}
                    loadingState={loadingState}
                    setSelectedAddress={setSelectedAddress}
                  />
                ) : (
                  <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                    <button
                      onClick={handleBuyButton}
                      disabled={loadingState.buyNow}
                      className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-medium text-white transition-all hover:bg-green-700 disabled:bg-green-400"
                    >
                      {loadingState.buyNow && <Loader className="h-6 w-6" />}
                      Buy Now • ₹{(data?.selling_price * quantity).toFixed(2)}
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={loadingState.addToCart}
                      className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-xl border-2 border-green-600 px-6 py-4 font-medium text-green-600 transition-all hover:bg-green-50 disabled:opacity-50"
                    >
                      {loadingState.addToCart && <Loader className="h-6 w-6" />}
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Accordion Section */}
              <div className="rounded-xl border border-gray-200 bg-white">
                <Accordion />
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-12 rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              About the Product
            </h2>

            <p className="text-gray-600 leading-relaxed">{data?.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProductInfo;

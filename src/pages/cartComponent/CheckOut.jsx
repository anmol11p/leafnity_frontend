import React, { useContext, useReducer, useState } from "react";
import { UserContext } from "../../context/ContextApi";
import {
  createPayment,
  getAllOrderItem,
  saveOrderToDB,
  verifyPayment,
} from "../../api/order";
import { toast } from "react-toastify";
import {
  AllItemsClear,
  getAllCartItems,
  handleClearAll,
} from "../../api/Carts";
import { NavLink } from "react-router-dom";
import Loader from "../Loader";
import { reducer } from "../../api/imp.function";

const CheckOut = () => {
  const { cart, user, token, setCart, setOrder } = useContext(UserContext);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditingMode, SetIsEditingMode] = useState(false);

  const totalMoney = cart?.reduce(
    (accum, item) => accum + Number(item.totalPrice),
    0
  );

  const [loadingState, dispatch] = useReducer(reducer, { buyNow: false });

  const handleCheckOut = async (amount) => {
    try {
      if (!selectedAddress) {
        toast.error("Please select an address to proceed.");
        return;
      }
      dispatch({ payload: "buyNow", type: "LOADING" });
      const response = await createPayment(token, amount);
      const { data } = response;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount,
        currency: "INR",
        name: "Leafnity",
        description: "Purchase plants",
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verify = await verifyPayment(token, response);
            if (verify.data.success && verify.status === 200) {
              const items = cart?.map(({ plant, quantity, plantId }) => ({
                plantId,
                quantity,
                totalAmount: plant.selling_price * quantity,
              }));

              const resp = await saveOrderToDB(token, {
                items,
                razorpayOrderId: data.order.id,
                totalAmount: amount,
                addressId: selectedAddress,
              });
              console.log(resp);
              if (resp.status === 200) {
                const cart = await AllItemsClear(token);
                if (cart.status === 200) {
                  const updatedCart = await getAllCartItems(token);
                  setCart(updatedCart.data.cart);
                  toast.success(cart.data.message);
                }
                toast.success(resp.data.message);
                const updateOrder = await getAllOrderItem(token);
                if (updateOrder.status === 200) {
                  setOrder(updateOrder.data.details);
                  SetIsEditingMode(false);
                }
              }
            } else {
              toast.error("Payment Verification Failed!");
            }
          } catch (error) {
            console.error("Payment Verification Error:", error);
          } finally {
            dispatch({ payload: "buyNow", type: "STOP_LOADING" });
          }
        },
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "guest@example.com",
          contact: user?.phone || "0000000000",
        },
        theme: { color: "#2E7D32" },
        modal: {
          escape: false,
          ondismiss: () => {
            dispatch({ payload: "buyNow", type: "STOP_LOADING" });
          },
        },
      };
      const paymentWindow = new window.Razorpay(options);
      paymentWindow.open();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch({ payload: "buyNow", type: "STOP_LOADING" });
    }
  };

  const handleOpenForm = () => {
    SetIsEditingMode(true);
  };

  return (
    <>
      {isEditingMode ? (
        <PaymentForm
          SetIsEditingMode={SetIsEditingMode}
          handleCheckOut={handleCheckOut}
          totalMoney={totalMoney}
          setSelectedAddress={setSelectedAddress}
          loadingState={loadingState}
        />
      ) : (
        <button
          onClick={() => handleOpenForm(totalMoney)}
          className="px-6 py-3  bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 cursor-pointer"
        >
          Checkout - ₹{totalMoney}
        </button>
      )}
    </>
  );
};

export const PaymentForm = ({
  SetIsEditingMode,
  handleCheckOut,
  totalMoney,
  setSelectedAddress,
  loadingState,
}) => {
  const { address, isPending } = useContext(UserContext);

  const handleSelectChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      {isPending ? (
        <Loader />
      ) : (
        <>
          {address?.length === 0 ? (
            <div className="text-center">
              <NavLink
                to={"/account/address"}
                className="text-blue-600 underline hover:text-blue-800"
              >
                Create Address First
              </NavLink>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Select Address
                </label>
                <select
                  onChange={handleSelectChange}
                  className="w-full max-w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 overflow-hidden truncate"
                >
                  <option value="">-- Select Address --</option>
                  {address?.map((item) => {
                    const {
                      fullName,
                      street,
                      city,
                      postalCode,
                      state,
                      country,
                      id,
                    } = item;
                    return (
                      <option value={id} key={id}>
                        {fullName}, {street}, {city}, {postalCode}, {state},{" "}
                        {country}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleCheckOut(totalMoney)}
                  className={`px-6 py-2 font-semibold rounded-md transition duration-300 ${
                    loadingState.buyNow
                      ? " cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loadingState.buyNow ? (
                    <Loader />
                  ) : (
                    `Proceed - ₹${totalMoney}`
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => SetIsEditingMode(false)}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default CheckOut;

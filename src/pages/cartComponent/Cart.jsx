import React, { useContext, useReducer } from "react";
import { UserContext } from "../../context/ContextApi";
import CartCard from "./CartCard";
import MessageBox from "./MessageBox";
import { handleClearAll } from "../../api/Carts";
import CheckOut from "./CheckOut";
import { NavLink } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import Loader from "../Loader";
import { reducer } from "../../api/imp.function";

const Cart = () => {
  const { cart, token, setCart, isPending } = useContext(UserContext);
  const [loadingState, dispatch] = useReducer(reducer, {
    clearLoad: false,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {token ? (
        <section className="py-8 px-4 md:px-8   my-20">
          {cart?.length !== 0 || cart === null ? (
            <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3">
              {/* Left side: Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart?.map((item) => (
                  <div key={item.id}>
                    <CartCard item={item} />
                  </div>
                ))}

                {/* Clear All Button */}
                <div className="flex justify-center">
                  <button
                    className={`w-full max-w-sm py-3 rounded-md font-semibold transition-all ${
                      loadingState.clearLoad
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-red-500 cursor-pointer hover:bg-red-600 text-white"
                    }`}
                    onClick={() => handleClearAll(token, setCart, dispatch)}
                    disabled={loadingState.clearLoad}
                  >
                    {loadingState.clearLoad ? (
                      <Loader size="1.5rem" />
                    ) : (
                      "Clear All Items"
                    )}
                  </button>
                </div>
              </div>

              {/* Right side: Checkout Summary */}
              <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
                <h2 className="text-xl font-bold mb-6 text-center text-green-700">
                  Checkout Summary
                </h2>
                <CheckOut />
              </div>
            </div>
          ) : (
            // When cart is empty
            <div className="flex flex-col items-center gap-4 pt-10">
              <MessageBox
                message="No items left in your cart!"
                link="/products"
                linkname="Go to Products"
              />
              <NavLink
                to="/account/order"
                className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
              >
                Go to order section
                <FaLongArrowAltRight className="text-lg" />
              </NavLink>
            </div>
          )}
        </section>
      ) : (
        <MessageBox
          message="Login to get Cart Info!"
          link="/login"
          linkname="Go to login"
        />
      )}
    </>
  );
};

export default Cart;

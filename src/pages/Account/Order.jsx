import React, { useContext } from "react";
import { UserContext } from "../../context/ContextApi";
import { NavLink } from "react-router-dom";
import Loader from "../Loader";

const Order = () => {
  const { order, isPending } = useContext(UserContext);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {order.length === 0 ? (
        <p className="flex justify-between items-center">
          <span className="text-lg font-medium">
            You've Not Ordered Anything Yet
          </span>
          <NavLink to="/cart" className="text-blue-600 hover:underline">
            Order Here..
          </NavLink>
        </p>
      ) : (
        <>
          <NavLink
            to="/orders"
            className="block text-blue-600 hover:underline my-4"
          >
            Go to All Orders
          </NavLink>

          <ul className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Orders:</h2>
            {order
              .slice(-2)
              .reverse()
              .map((item, index) => {
                if (!item) return null;
                const { totalAmount, items } = item;

                return (
                  <li key={index} className="bg-white p-4 rounded-md shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">
                        Total Amount: ₹{totalAmount}
                      </span>
                    </div>

                    {items.map((singleItem) => {
                      if (!singleItem) return null;
                      const { status, id, quantity, plant, createdAt } =
                        singleItem;
                      const { plant_name } = plant;

                      return (
                        <div
                          key={id}
                          className="flex justify-between items-center py-2 border-b"
                        >
                          <span className="font-medium">{plant_name}</span>
                          <div className="flex flex-col items-end">
                            <span>Quantity: {quantity}</span>
                            <span
                              className={`text-sm ${
                                status === "Ordered"
                                  ? "text-green-500"
                                  : "text-black"
                              }`}
                            >
                              Status: {status}
                            </span>
                            <span className="text-xs text-gray-500">
                              Order Date:{" "}
                              {new Date(createdAt).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </li>
                );
              })}
          </ul>
        </>
      )}
    </div>
  );
};

export default Order;

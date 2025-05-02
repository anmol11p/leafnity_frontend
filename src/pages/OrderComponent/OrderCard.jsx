import React from "react";
import Loader from "../Loader";

const OrderCard = ({ item, handleToggle, loadingState, handleCancelOrder }) => {
  const { razorpayOrderId, items } = item;

  return (
    <li className="bg-white p-4 rounded-lg shadow-md space-y-6">
      {items.map((singleItem) => {
        const { id, plant, quantity, status, createdAt, totalAmount } =
          singleItem;
        const { plant_name, image_src } = plant;

        const isCancelling = loadingState[id];

        return (
          <div
            className="flex flex-col md:flex-row items-center gap-6 border-b pb-4 last:border-none"
            key={id}
          >
            <img
              src={`/${image_src}`}
              alt={plant_name}
              className="w-32 h-32 object-cover rounded-md border"
            />
            <div className="flex flex-col md:flex-1">
              <h2 className="text-lg font-semibold">{plant_name}</h2>
              <p className="text-sm text-gray-500">
                Total Amount: ₹{totalAmount}
              </p>
              <p className="text-sm text-gray-500">Quantity: {quantity}</p>
              <p className="text-sm text-gray-500">Status: {status}</p>
              <p className="text-sm text-gray-500">
                Order Date:{" "}
                {new Date(createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                })}
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleToggle(id)}
                  className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Details
                </button>
                {status === "Ordered" && (
                  <button
                    onClick={() =>
                      handleCancelOrder({ razorpayOrderId, id, totalAmount })
                    }
                    className={`px-4 py-2 rounded-md ${
                      isCancelling
                        ? " cursor-not-allowed"
                        : "bg-red-500 cursor-pointer hover:bg-red-600 text-white"
                    } transition`}
                    disabled={isCancelling}
                  >
                    {isCancelling ? <Loader /> : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </li>
  );
};

export default OrderCard;

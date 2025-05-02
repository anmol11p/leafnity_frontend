import React, { useReducer, useEffect, useState, useContext } from "react";
import { UserContext } from "../../context/ContextApi";
import { orderItemDetails } from "../../api/order";
import { reducer } from "../../api/imp.function";
import Loader from "../Loader";

const SingleOrderDetails = ({ setIsInfoClick, selectedItem }) => {
  const { token } = useContext(UserContext);
  const [orderData, setOrderData] = useState(null);
  const [loadingState, dispatch] = useReducer(reducer, {
    detailsLoad: false,
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        dispatch({ type: "LOADING", payload: "detailsLoad" });
        const details = await orderItemDetails(token, selectedItem);
        if (details.status === 200) {
          setOrderData(details.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch({ type: "STOP_LOADING", payload: "detailsLoad" });
      }
    };

    if (selectedItem) {
      fetchOrderDetails();
    }
  }, [selectedItem, token]);

  if (loadingState.detailsLoad) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!orderData) return null;

  const { address = {}, orderDetails = {} } = orderData;
  const { fullName, phone, street, city, postalCode, state, country } = address;
  const { plant = {}, quantity, status, totalAmount } = orderDetails;
  const { plant_name, image_src } = plant;

  return (
    <section className="container mx-auto p-4 sm:p-8 md:p-12 my-10">
      <article className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 max-w-2xl mx-auto transition-all duration-300">
        <img
          src={`/${image_src}`}
          alt={plant_name || "Plant"}
          className="w-52 h-52 object-cover rounded-xl shadow-md"
        />

        <div className="flex flex-col items-center  w-full text-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">{plant_name}</h2>

          <div
            // className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600"
            className="flex flex-col gap-2 text-start"
          >
            <p>
              <span className="font-semibold">Total Amount:</span> ₹
              {totalAmount}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {quantity}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {status}
            </p>
            <p>
              <span className="font-semibold">Phone:</span> {phone}
            </p>
            {/* <p className="font-semibold mb-1">Address:</p> */}
            <p>
              <span className="font-semibold">Address:</span> {fullName},{" "}
              {street}, {city}, {state}, {country} - {postalCode}
            </p>
          </div>

          <button
            onClick={() => setIsInfoClick(false)}
            className="mt-6 py-2 cursor-pointer px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md"
          >
            Back
          </button>
        </div>
      </article>
    </section>
  );
};

export default SingleOrderDetails;

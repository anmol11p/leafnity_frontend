import React, { useContext, useReducer, useState } from "react";
import { UserContext } from "../context/ContextApi";
import OrderCard from "./OrderComponent/OrderCard";
import SingleOrderDetails from "./OrderComponent/SingleOrderDetails";
import { NavLink, useNavigate } from "react-router-dom";
import { CancelOrder, getAllOrderItem } from "../api/order";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { reducer } from "../api/imp.function";

const AllOrders = () => {
  const { order, setOrder, token, isPending } = useContext(UserContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isInfoClick, setIsInfoClick] = useState(false);
  const [loadingState, setLoadingState] = useState({}); // key: itemId, value: boolean

  const handleToggle = (id) => {
    setSelectedItem(id);
    setIsInfoClick(true);
  };

  const handleCancelOrder = async ({ razorpayOrderId, id, totalAmount }) => {
    try {
      setLoadingState((prev) => ({ ...prev, [id]: true }));

      const response = await CancelOrder(token, {
        razorpayOrderId,
        id,
        totalAmount,
      });

      if (response.status === 200) {
        const updateOrder = await getAllOrderItem(token);
        if (updateOrder.status === 200) {
          setOrder(updateOrder.data.details);
          toast.success(response.data.message);
        }
      } else {
        toast.error(
          response?.response?.data?.description || "Something went wrong!"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Order cancellation failed!");
    } finally {
      setLoadingState((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (isInfoClick) {
    return (
      <SingleOrderDetails
        setIsInfoClick={setIsInfoClick}
        selectedItem={selectedItem}
      />
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }
  // console.log(order);
  return (
    <section className="py-8 my-40">
      <div className="container mx-auto px-4">
        {order && order?.length === 0 ? (
          <h2 className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
            You haven't made any orders yet.
            <NavLink
              to={"/products"}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Make an order
            </NavLink>
          </h2>
        ) : (
          <>
            <h2 className="text-3xl font-semibold text-center mb-6">
              All Orders
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {order?.map((item) => (
                <OrderCard
                  item={item}
                  key={item.id}
                  handleToggle={handleToggle}
                  handleCancelOrder={handleCancelOrder}
                  loadingState={loadingState}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default AllOrders;

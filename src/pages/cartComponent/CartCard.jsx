import React, { useContext } from "react";
import { UserContext } from "../../context/ContextApi";
import { addToCart, getAllCartItems, removePlant } from "../../api/Carts";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";

const CartCard = ({ item }) => {
  const { cart, token, setCart } = useContext(UserContext);

  const updateQuantity = async (id, type) => {
    try {
      const cartItem = cart.find((i) => i.plantId === id);
      if (!cartItem) return;
      const quantity = type === "inc" ? 1 : -1;
      const resp = await addToCart({ plantId: id, quantity }, token);
      if (resp.status === 200) {
        const updatedCart = await getAllCartItems(token);
        if (updatedCart.status === 200) {
          setCart(updatedCart.data.cart);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (plantId) => {
    try {
      const resp = await removePlant(plantId, token);
      if (resp.status === 200) {
        toast.success(resp.data.message);
        const updatedCart = await getAllCartItems(token);
        if (updatedCart.status === 200) {
          setCart(updatedCart.data.cart);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group">
      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.plantId)}
        className="absolute top-2 right-2 text-red-500 hover:text-white bg-red-100 hover:bg-red-500 p-1 rounded-full transition-all duration-300 cursor-pointer "
      >
        <RxCross2 className="text-sm" />
      </button>

      {/* Image */}
      <img
        src={item.plant.image_src}
        alt={item.plant.plant_name}
        className="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"
      />

      {/* Content */}
      <div className="flex flex-col flex-1 justify-between w-full">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {item.plant.plant_name}
          </h2>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQuantity(item.plantId, "dec")}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full flex items-center justify-center transition duration-300 text-lg cursor-pointer"
            >
              -
            </button>
            <span className="text-lg font-semibold">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.plantId, "inc")}
              className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-full flex items-center justify-center transition duration-300 text-lg cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Price */}
          <span className="text-green-600 font-semibold text-lg">
            ₹{item.plant.selling_price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartCard;

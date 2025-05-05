import React, { useContext, useState, useEffect, useReducer } from "react";
import { UserContext } from "../../context/ContextApi";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { createAddress, getAddress, getPincodeDetails } from "../../api/Adress";
import { reducer } from "../../api/imp.function";
import Loader from "../Loader";

const Address = () => {
  const { address, token, setAddress, isPending } = useContext(UserContext);
  const [loadingState, dispatch] = useReducer(reducer, {
    addressLoading: false,
  });
  const [addressData, setAddressData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    state: "",
    country: "",
  });

  const [shouldSaveAddress, setShouldSaveAddress] = useState(false);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const { postalCode } = addressData;
      dispatch({ type: "LOADING", payload: "addressLoading" });
      const response = await getPincodeDetails(postalCode);

      if (response.status === 200) {
        const responseData = response.data[0];

        if (responseData.Status === "Error" || responseData.Status === "404") {
          toast.error("Invalid PinCode");
          dispatch({ type: "STOP_LOADING", payload: "addressLoading" });

          return;
        }

        if (responseData.Status === "Success") {
          const { Country, State, District } = responseData.PostOffice[0];
          setAddressData((prev) => ({
            ...prev,
            country: Country,
            state: State,
            city: District,
          }));

          setShouldSaveAddress(true);
        }
      }
    } catch (error) {
      dispatch({ type: "STOP_LOADING", payload: "addressLoading" });

      console.error("Error submitting form:", error);
    } finally {
      dispatch({ type: "STOP_LOADING", payload: "addressLoading" });
    }
  };

  useEffect(() => {
    if (shouldSaveAddress) {
      const saveAddress = async () => {
        const saveAddressInDb = await createAddress(token, addressData);
        console.log(saveAddressInDb);
        if (saveAddressInDb.status === 400) {
          toast.error(saveAddressInDb.response.data.message);
        } else if (saveAddressInDb.status === 200) {
          const address = await getAddress(token);
          if (address.status === 200) {
            setAddress(address.data.address);
          }
          toast.success(saveAddressInDb.data.message);
        }
      };

      saveAddress();
      setShouldSaveAddress(false); // Reset flag
    }
  }, [addressData, shouldSaveAddress]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="p-8  rounded-md">
      {address?.length === 0 ? (
        <h2 className="text-center text-lg text-gray-700">
          You're not fill any address
        </h2>
      ) : (
        <div className="flex justify-between items-center mb-4">
          <NavLink
            to="/addresses"
            className="text-blue-500 hover:underline text-sm"
          >
            Saved Addresses
          </NavLink>
        </div>
      )}
      <div className="border-t-2 pt-4">
        <h2 className="text-2xl font-semibold mb-4">Create New Address:</h2>
        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex flex-col">
            <label htmlFor="fullName" className="text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={addressData.fullName}
              onChange={handleOnchange}
              className="p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={addressData.phone}
              onChange={handleOnchange}
              className="p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="street" className="text-sm font-medium mb-2">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={addressData.street}
              onChange={handleOnchange}
              className="p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="city" className="text-sm font-medium mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={addressData.city}
              onChange={handleOnchange}
              className="p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="postalCode" className="text-sm font-medium mb-2">
              Pin Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={addressData.postalCode}
              onChange={handleOnchange}
              className="p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="state" className="text-sm font-medium mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              value={addressData.state}
              onChange={handleOnchange}
              className="p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="country" className="text-sm font-medium mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={addressData.country}
              onChange={handleOnchange}
              className="p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            className={`${
              loadingState.addressLoading
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
            } p-3 rounded-md mt-4 flex justify-center items-center cursor-pointer`}
            type="submit"
          >
            {loadingState.addressLoading ? <Loader /> : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Address;

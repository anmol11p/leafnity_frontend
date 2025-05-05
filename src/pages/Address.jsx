import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/ContextApi";
import { MdDelete, MdModeEdit } from "react-icons/md";
import {
  DeleteAddress,
  getAddress,
  getPincodeDetails,
  getSingleAddress,
  updateAddress,
} from "../api/Adress";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

const Address = () => {
  const { address, setAddress, token } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const navigate = useNavigate();

  // console.log(address);
  const handleDeleteAddress = async (id) => {
    try {
      const deleAddress = await DeleteAddress(token, id);
      console.log(deleAddress);
      if (deleAddress.status === 200) {
        const updatedAddress = await getAddress(token);
        if (updatedAddress.status === 200) {
          setAddress(updatedAddress.data.address);
          toast.success(deleAddress.data.message);
        }
      } else if (deleAddress.status === 401) {
        toast.error(deleAddress.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const addressResponse = await getSingleAddress(token, id);
      if (addressResponse.status === 200) {
        setSelectedAddress(addressResponse.data.Address);
      }
      setIsEditing(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  if (address?.length === 0 || address === null) {
    return (
      <div className="flex justify-center items-center h-screen mt-10">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            You're Not Filling Any Address
          </h2>
          <NavLink
            to={"/account/address"}
            className="mt-4 inline-block text-blue-500 hover:text-blue-700"
          >
            Fill Address
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6  my-20">
      <div className="container">
        {isEditing ? (
          <EditAddressForm
            setIsEditing={setIsEditing}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {address?.map((item) => {
              const { city, country, postalCode, fullName, state, street, id } =
                item;
              return (
                <li
                  key={id}
                  className="p-4 border rounded-lg shadow-lg bg-white flex justify-between items-center "
                >
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">
                      {fullName}, {street}, {city}, {postalCode}, {state},{" "}
                      {country}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      onClick={() => handleDeleteAddress(id)}
                    >
                      <MdDelete className="text-xl" />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                      onClick={() => handleUpdate(id)}
                    >
                      <MdModeEdit className="text-xl" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
const EditAddressForm = ({ setIsEditing, selectedAddress }) => {
  const { token, setAddress } = useContext(UserContext);
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

  const handleOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    if (selectedAddress) {
      const { fullName, phone, street, city, postalCode, state, country } =
        selectedAddress;
      setAddressData({
        fullName,
        phone,
        street,
        city,
        postalCode,
        state,
        country,
      });
    }
  }, [selectedAddress]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { postalCode } = addressData;

    if (!postalCode) {
      toast.error("Please enter a valid postal code.");
      return;
    }

    try {
      const response = await getPincodeDetails(postalCode);
      if (response.status === 200) {
        const responseData = response.data[0];

        if (responseData.Status === "Error" || responseData.Status === "404") {
          toast.error("Invalid PinCode");
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
      console.error(error);
      toast.error("Error fetching pin code details.");
    }
  };

  useEffect(() => {
    if (shouldSaveAddress) {
      const saveAddress = async () => {
        const { id } = selectedAddress;
        try {
          const updateResponse = await updateAddress(token, id, addressData);
          if (updateResponse.status === 200) {
            const address = await getAddress(token);
            if (address.status === 200) {
              setAddress(address.data.address);
            }
            toast.success(updateResponse.data.message);
            setIsEditing(false);
          }
        } catch (error) {
          console.error(error);
          toast.error("Error saving address.");
        } finally {
          setShouldSaveAddress(false);
        }
      };
      saveAddress();
    }
  }, [
    addressData,
    shouldSaveAddress,
    setAddress,
    selectedAddress,
    token,
    setIsEditing,
  ]);

  return (
    <div className="container p-6 bg-white rounded-lg shadow-xl">
      <form
        onSubmit={handleFormSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {[
          { label: "Full Name", name: "fullName", type: "text" },
          { label: "Phone Number", name: "phone", type: "text" },
          { label: "Street", name: "street", type: "text" },
          { label: "City", name: "city", type: "text" },
          { label: "Pin Code", name: "postalCode", type: "text" },
          { label: "State", name: "state", type: "text" },
          { label: "Country", name: "country", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name} className="space-y-2">
            <label htmlFor={name} className="block font-semibold text-lg">
              {label}
            </label>
            <input
              id={name}
              type={type}
              name={name}
              value={addressData[name]}
              onChange={handleOnChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Address;

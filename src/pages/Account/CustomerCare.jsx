import React, { useContext, useState } from "react";
import { UserContext } from "../../context/ContextApi";
import { aiResponse, errorMessages } from "../../gemini/geminiAI";
import Loader from "../Loader";
import { toast } from "react-toastify";

const CustomerCare = () => {
  const [loading, setLoading] = useState(false);
  const { isPending, user, cart, address, order } = useContext(UserContext);
  const [answer, setAnswer] = useState("");

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const userInput = Object.fromEntries(formData);

      const { customerQuestion } = userInput;
      if (!customerQuestion) {
        const randomMsg =
          errorMessages[Math.floor(Math.random() * errorMessages.length)];
        toast.error(randomMsg);
      }
      setLoading(true);
      const customerAnswer = await aiResponse(customerQuestion, {
        user,
        cart,
        address,
        order,
      });
      // console.log(customerAnswer);
      setAnswer(customerAnswer);
      event.target.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <label
          htmlFor="customerQuestion"
          className="block text-lg font-semibold"
        >
          Ask Your Question
        </label>
        <textarea
          name="customerQuestion"
          rows="4"
          className="w-full px-4 py-3 pr-16 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl 
 focus:border-transparent resize-none transition-all"
          // className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white  focus:border-transparent ${
              loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? <Loader /> : "Submit"}
          </button>
        </div>
      </form>

      <div
        className={`mt-4 p-4 rounded-md border ${
          answer ? "bg-gray-100" : "bg-white"
        }`}
      >
        {answer ? answer : "Ask Your Query?"}
      </div>
    </div>
  );
};

export default CustomerCare;

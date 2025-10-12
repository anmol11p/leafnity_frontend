import React, { useContext, useState } from "react";
import { UserContext } from "../../context/ContextApi";
import { aiResponse, errorMessages } from "../../gemini/geminiAI";
import Loader from "../Loader";
import { toast } from "react-toastify";

const CustomerCare = () => {
  const [loading, setLoading] = useState(false);
  const { isPending, user, cart, address, order } = useContext(UserContext);
  const [customerQuery, setCustomerQuery] = useState("");
  const [answers, setAnswers] = useState([]);

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
      if (!customerQuery.trim()) {
        const randomMsg =
          errorMessages[Math.floor(Math.random() * errorMessages.length)];
        toast.error(randomMsg);
        return;
      }

      setLoading(true);
      const customerAnswer = await aiResponse(customerQuery, {
        user,
        cart,
        address,
        order,
      });

      setAnswers((prev) => [
        ...prev,
        { question: customerQuery, answer: customerAnswer },
      ]);

      setCustomerQuery(""); // clear input after submit
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
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
          value={customerQuery}
          onChange={(e) => setCustomerQuery(e.target.value)}
          placeholder="Type your question here..."
          className="w-full px-4 py-3 pr-16 text-gray-900 placeholder-gray-400 border border-gray-200 rounded-xl 
            focus:outline-none resize-none transition-all"
        />
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white focus:outline-none ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? <Loader /> : "Submit"}
          </button>
        </div>
      </form>

      <div
        className={`mt-4 p-4 rounded-md border ${
          answers.length !== 0 ? "bg-gray-100" : "bg-white"
        }`}
      >
        {answers.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold text-blue-600">Q: {item.question}</p>
            <p className="text-gray-800 mt-1">A: {item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerCare;

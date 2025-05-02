import React from "react";
import { NavLink } from "react-router-dom";

const MessageBox = ({ message, link, linkname }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-4 text-center">{message}</h1>
      <NavLink
        to={link}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition-all"
      >
        {linkname}
      </NavLink>
    </div>
  );
};

export default MessageBox;

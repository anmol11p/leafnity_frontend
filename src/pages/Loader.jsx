import React from "react";

const Loader = ({ size }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-${size} h-${size} border-2 border-green-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;

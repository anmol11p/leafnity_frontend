import React from "react";

const Loader = ({ w = 10, h = 10 }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-${w} h-${h} border-2 border-green-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;

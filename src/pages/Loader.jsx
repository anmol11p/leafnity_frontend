import React from "react";

const Loader = ({ size }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-${5} h-${5} border-2 border-green-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;

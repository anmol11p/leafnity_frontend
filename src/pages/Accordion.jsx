import React, { useState } from "react";
import AccordionData from "../api/accordion.json";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const Accordion = () => {
  const [isActive, setIsActive] = useState(null);

  const handleToggle = (id) => {
    setIsActive((prev) => (prev === id ? null : id));
  };

  return (
    <section className="Accordion-section mt-6">
      <ul className="space-y-4">
        {AccordionData.map((data) => (
          <li key={data.id} className="border-b border-gray-300">
            <div
              className="accordionHeading flex justify-between items-center p-4 cursor-pointer"
              onClick={() => handleToggle(data.id)}
            >
              <div className="flex items-center space-x-2">
                <img className="w-6 h-6" src={data.icon} alt={data.title} />
                <span className="text-lg font-medium">{data.title}</span>
              </div>
              <button className="text-xl">
                {isActive === data.id ? <FaAngleDown /> : <FaAngleUp />}
              </button>
            </div>
            {isActive === data.id && (
              <p className="accordionContent px-4 py-2 text-gray-700">
                {data.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Accordion;

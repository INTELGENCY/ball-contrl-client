import React from "react";

const FitnessCards = ({ coachData }) => {
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center w-full gap-5 mt-10">
        {/* ---------------- Fitness Goals Card ------------------ */}
        {/* Fitness Goals */}
        <div className="w-full bg-white p-6 rounded-md shadow-md hover:shadow-none border-4 hover:border-main-dark group hover:bg-main-dark hover:text-white transition-all duration-600 cursor-pointer">
          <h2 className="text-xl font-bold text-main-dark group-hover:text-white">
            Fitness Goals
          </h2>
          <ul className="list-disc pl-5 mt-4">
            {coachData?.fitnessGoals?.map((goal, index) => (
              <li
                key={index}
                className="text-gray-700 group-hover:text-white"
              >
                {goal}
              </li>
            ))}
          </ul>
        </div>

        {/* Events Card */}
        <div className="w-full bg-white p-6 rounded-md shadow-md border-4 hover:border-main-dark group hover:bg-main-dark hover:text-white transition-all duration-300">
          <h2 className="text-xl font-bold text-main-dark group-hover:text-white">
            Events
          </h2>
          <ul className="list-disc pl-5 mt-4">
            {coachData?.events?.map((event, index) => (
              <li
                key={index}
                className="text-gray-700 group-hover:text-white"
              >
                {event}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default FitnessCards;

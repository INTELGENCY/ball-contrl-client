import React from "react";
import { Link } from "react-router-dom";

const SessionCard = ({ data }) => {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  
  return (
    <div
      key={data._id}
      className="flex flex-col justify-between gap-3 p-0 border border-main-primary rounded-lg shadow-md h-full"
    >
      {/* Image Section with Hover Effect */}
      <div className="relative group">
        {/* Image */}
        <img
          src={data.image}
          alt=""
          className="rounded-t-lg bg-cover w-full h-56 object-cover"
        />
        {/* Hidden Button */}
        
      </div>

      <div className="px-4 mt-1">
        {/* Title Section */}
        <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">
          {data.title}
        </h1>
        <hr className="w-1/2 h-2 dark:bg-white" />

        {/* Description */}
        <p className="text-sm text-gray-700 dark:text-gray-400 mt-0">
          {data.description}
        </p>

        <div className="mt-5 pb-5">
          {/* Book Now Button */}
          <Link
            onClick={scrollToTop}
            to={`/booking/${data.coachId}?sessionId=${data._id}&price=${data.price}`}
            state={data.coachId}
            className="w-full text-center border border-main-dark py-2 px-5 rounded text-sm bg-main-dark duration-200 text-white"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SessionCard;

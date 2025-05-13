import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaUser, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa"; // Import icons from react-icons

const Card = ({ cardData }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleQuickLook = () => {
    if (currentUser) {
      navigate(`/coachProfile/${cardData._id}`, { state: cardData });
    } else {
      toast.error("Please log in to view the coach");
    }
  };

  const truncateDescription = (description) => {
    if (description) {
      return description.length > 80
        ? `${description.slice(0, 80)}...`
        : description;
    }
    return "";
  };

  return (
    <div className="flex flex-col justify-between items-center w-[300px] h-[500px] gap-4 shadow-lg rounded-lg bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <img
        src={cardData.profilePic}
        alt={cardData.username}
        className="h-[40%] w-full object-cover rounded-t-lg"
      />

      {/* Content Section */}
      <div className="flex flex-col justify-between flex-1 w-full px-4 py-2 gap-3">
        {/* Title */}
        <h1 className="text-[22px] text-main-dark font-bold">
          {cardData.username}
        </h1>

        {/* Description */}
        <p className="text-[14px] text-gray-600">
          {truncateDescription(cardData.description)}
        </p>

        {/* Age Group with Icon */}
        <div className="flex items-center gap-2 text-gray-600">
          <FaCalendarAlt className="text-main-accent" /> {/* Icon */}
          <span>Age Group:</span>
          <span className="font-medium">{cardData?.agegroup}</span>
        </div>

        {/* Location with Icon */}
        <div className="flex items-center gap-2 text-gray-600">
          <FaMapMarkerAlt className="text-main-accent" /> {/* Icon */}
          <span>Location:</span>
          <span className="font-medium">{cardData?.address_line_1}</span>
        </div>

        {/* Button */}
        <div className="w-full flex justify-center items-center mt-auto">
          <button
            onClick={() => {
              handleQuickLook();
              scroll(0, 0);
            }}
            className="uppercase text-white border bg-main-accent border-main-dark px-4 py-2 w-full text-sm hover:bg-main-darker duration-200 rounded-lg flex items-center justify-center gap-2"
          >
            <FaUser /> {/* Icon */}
            <span>Quick Look</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;

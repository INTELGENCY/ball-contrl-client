import React from "react";
import PinkBadge from "../../assets/coaches/PinkBadge.png";
import { FaStopwatch, FaCheck } from "react-icons/fa";
import Swal from "sweetalert2";

const benefits = [
  "DBS Certified",
  "FA/UEFA Qualified",
  "High Quality Coaches with Verified Reviews",
  "Personalised Coaching Sessions",
  "First Aid/Emergency Aid Trained",
  "24/7 Support & Helpful Player Advice",
  "Easy & Secure Payment",
];

const CoachProfileCard = ({ coachData, onRequestToBook, user }) => {
  const handleMessageCoach = () => {
    if (user.userType === "Coach") {
      Swal.fire({
        title: "Message Coach",
        text: "You are already a coach. Login as player to chat with coach?",
        icon: "error",
      });
      return;
    }
    // Navigate to the specified path
    window.location.href = "http://localhost:5173/player-dashboard?tab=chatbox";
  };

  return (
    <>
      <div className="flex justify-center items-center border-2 border-t-main-dark">
        <div className="w-full max-w-sm bg-gray-50/15 shadow-lg p-6">
          <h2 className="text-center text-lg font-semibold text-gray-900 mb-4">
            Have a question for {coachData.username}?
          </h2>
          <div className="flex mb-6">
            <FaStopwatch className="text-main-primary mt-[2px]" />
            <p className="text-center text-sm text-gray-800">
              {coachData.username} Typically Has A{" "}
              <span className="font-medium text-main-dark">Average</span>{" "}
              Response Time
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <button
              className="w-full border-2 border-main-dark text-gray-900 py-3 rounded-sm font-semibold hover:bg-main-dark hover:text-white transition-all duration-300"
              onClick={handleMessageCoach}
            >
              Message Coach
            </button>
            <button
              className="w-full bg-main-dark border-2 border-main-dark hover:border-2 hover:border-main-dark text-white py-3 rounded-sm font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300"
              onClick={onRequestToBook}
            >
              Request To Book Session
            </button>
          </div>

          <div className="flex flex-col justify-center items-center mb-6">
            <img src={PinkBadge} alt="" className="h-16" />
            <h3 className="text-main-darker text-lg font-semibold mt-4">
              Simple, Safe & Secure
            </h3>
          </div>

          <ul className="text-gray-900 text-sm space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="bg-main-primary h-5 w-5 rounded-full flex justify-center items-center">
                  <FaCheck className="text-xs text-white" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CoachProfileCard;

import React from "react";
import { useNavigate } from "react-router-dom";
const FindCoach = () => {
  const navigate = useNavigate();
  const handleDirect = () => {
    navigate("/coaches");
  };
  return (
    <div className="text-center">
      <button className="rotate-button bg-main-dark hover:bg-main-accent  text-white text-xl py-2 px-6 rounded-lg" onClick={handleDirect}>
        Find a Coach
      </button>
    </div>
  );
};

export default FindCoach;

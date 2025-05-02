import React from "react";
import { useNavigate } from "react-router-dom";

const BecomeCoach = () => {
  const navigate = useNavigate();
    const handleDirect = () => {
      navigate("/register");
  };
  return (
    <div className="text-center mt-[2rem]">
      <button className="rotate-button bg-main-dark hover:bg-main-accent  text-white text-xl py-2 px-6 rounded-lg" onClick={handleDirect}>
        Become a Coach
      </button>
    </div>
  );
};

export default BecomeCoach;

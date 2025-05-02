import React from "react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();
  const handleDirect = () => {
    navigate("/how-it-works");
    scroll(0, 0)
  };
  return (
    <div className="text-center mt-10">
      <button
        className="rotate-button bg-main-dark hover:bg-main-accent  text-white text-xl py-2 px-6 rounded-lg"
        onClick={handleDirect}
      >
        How it works
      </button>
    </div>
  );
};

export default HowItWorks;

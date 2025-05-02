import React from "react";
import fail_icon from "../../assets/png/fail.png";
import { Link } from "react-router-dom";

const CheckoutFailure = () => {
  return (
    <div className="w-full">
      <div style={{ boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.3)" }} className="w-[40%] flex flex-col justify-center items-center my-[190px] h-[400px] mx-auto">
        <img src={fail_icon} alt="" />
        <h1 className="uppercase text-[#FF1A1A] mt-3 font-semibold text-[32px]">Error!</h1>
        <h2 className="text-[20px]">Thank you for your request</h2>
        <h2 className="text-[20px]">we are unable to continue process</h2>
        <p className="text-[14px] mt-2">Please try again to complete the process</p>
        <Link to="/basket" className="w-[60%] mx-auto rounded-lg text-white text-center pt-2 mt-8 h-[40px] bg-[#FF1A1A] ">Try again</Link>
      </div>
    </div>
  );
};

export default CheckoutFailure;

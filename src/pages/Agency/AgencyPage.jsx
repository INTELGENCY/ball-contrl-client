import React from "react";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper";
import { FiAlertCircle, FiAward, FiDollarSign, FiStar } from "react-icons/fi";

const AgencyPage = () => {
  return (
    <SectionWrapper
      justifyContent={"center"}
      alignItems={"center"}
      direction={"col"}
      gap={"3rem"}
      margin={"mt-[2rem] lg:mt-[6rem]"}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-bold mb-4 text-center">Coming Soon</h1>
          <p className="text-lg  mb-4">
            Our agency page is currently under construction. We're working hard to bring you innovative solutions and services for your football needs. Stay tuned for updates on:
          </p>
          <ul className="text-lg text-left">
            <li className="flex items-center mb-2"><FiAward className="mr-2  text-main-darker text-[25px]" /> Sponsorship opportunities</li>
            <li className="flex items-center mb-2"><FiDollarSign className="mr-2 text-main-darker text-[25px]" /> Product placement</li>
            <li className="flex items-center mb-2"><FiStar className="mr-2 text-main-darker text-[25px]" /> Becoming a football brand ambassador</li>
          </ul>
        
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AgencyPage;

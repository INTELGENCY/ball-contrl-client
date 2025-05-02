import React from "react";
import SectionWrapper from "../Wrapper/SectionWrapper";
import footballImage from '../../assets/images/stats-b-img.jpg'
import { BsCheckCircle } from 'react-icons/bs';

const Promo = () => {
  return (
    <SectionWrapper
      justifyContent={"center"}
      alignItems={"center"}
      direction={"col"}
      gap={"3rem"}
      margin={"mt-[2rem] lg:mt-[5rem]"}
    >
      <div className=" bg-white w-[95%]  rounded-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] flex flex-col md:flex-row">
        {/* Text Content */}
        <div className="md:w-1/2 flex flex-col items-center justify-center text-black text-center px-8 py-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl  font-bold mb-6 max-w-lg lg:max-w-xl">
            Discover Premium Football Coaches & Clubs
          </h2>
          <ul className="text-lg md:text-xl lg:text-[16px] max-w-lg lg:max-w-xl mb-8 list-disc list-inside">
            <li className="flex items-center mb-2"><BsCheckCircle className="mr-2 text-main-darker" />Find the perfect coach or club for women's and girls' football</li>
            <li className="flex items-center mb-2"><BsCheckCircle className=" mr-2 text-main-darker" />Certified coaches and high-quality facilities</li>
            <li className="flex items-center"><BsCheckCircle className=" mr-2 text-main-darker" />User-friendly interface for easy booking and joining</li>
          </ul>
          <p className="text-lg md:text-xl lg:text-[16px] max-w-lg lg:max-w-xl">
            Experience the joy of playing football with Ball Contrl!
          </p>
        </div>
        {/* Image */}
        <div className="md:w-1/2">
          <img
            src={footballImage}
            alt="Football"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Promo;

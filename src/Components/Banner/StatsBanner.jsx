import React from "react";
import SectionWrapper from "../Wrapper/SectionWrapper";
import { GiSoccerBall } from "react-icons/gi";
import { BsPeople } from "react-icons/bs";
import { FaUsers, FaRegChartBar } from "react-icons/fa";
import { AiFillEye } from "react-icons/ai";
import pitch from "../../assets/png/pitchfifa.png";
import fifa_source from "../../assets/png/source-fifa.png";

const StatsBanner = () => {
  return (
    <SectionWrapper
      justifyContent={"center"}
      alignItems={"center"}
      direction={"col"}
      gap={"3rem"}
      margin={"mt-[2rem] lg:mt-[6rem]"}
    >
      {/* Stats section */}
      <div className="py-5 px-10   overflow-hidden w-full relative">
        <img
          src={pitch}
          alt="stats background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Stats cards */}
        <div className="flex flex-wrap gap-20 items-center justify-center">
          {/* Stat card 1 */}
          <div
            className="glass-effect bg-white shadow-2xl w-full md:w-[20%] py-3 px-10 
          text-center transition duration-300 ease-in-out transform hover:scale-150 cursor-pointer  flex flex-col items-center justify-center z-10 gap-2 "
          >
            <p className="flex items-center justify-center rounded-full bg-main-ligther text-main-dark p-1 ">
              <GiSoccerBall className="text-main-darker text-3xl" />
            </p>
            <p className="font-bold text-white">29M</p>
            <p className="text-white text-[10px]">
              Women & girls playing football Worldwide
            </p>
          </div>
          {/* Stat card 2 */}
          <div
            className="glass-effect bg-white shadow-sm w-full md:w-[30%] flex flex-col gap-3 
          justify-center items-center py-6 px-10  text-center transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer "
          >
            <p className="flex items-center justify-center rounded-full bg-main-ligther text-main-dark p-3 ">
              <BsPeople className="text-5xl md:text-6xl text-main-darker" />
            </p>
            <p className="text-3xl md:text-4xl font-bold text-white">60M</p>
            <p className="text-lg md:text-xl text-white">
              Female players goal by 2026
            </p>
          </div>
          {/* Stat card 3 */}
          <div
            className="glass-effect bg-white shadow-2xl w-full md:w-[18%] py-5 px-6
          text-center transition duration-300 ease-in-out transform hover:scale-150 cursor-pointer mb-6 flex flex-col items-center justify-center gap-1"
          >
            <p className="flex items-center justify-center rounded-full bg-main-ligther text-main-dark p-2">
              <FaUsers className="text-main-darker text-2xl" />
            </p>
            <p className="font-bold text-white">1 in 20</p>
            <p className="text-white text-[10px]">
              UK women take up football as adults
            </p>
          </div>
          {/* Stat card 4 */}
          <div
            className="glass-effect bg-white shadow-2xl w-full md:w-[40%] flex flex-col justify-center
           items-center py-5 px-10  text-center transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer mb-8 gap-3"
          >
            <p className="flex items-center justify-center rounded-full bg-main-ligther text-main-dark p-4">
              <FaRegChartBar className="text-5xl md:text-6xl text-main-darker" />
            </p>
            <p className="text-3xl md:text-4xl font-bold mb-4 text-white">
              200%
            </p>
            <p className="text-lg md:text-xl text-white">
              Increase in Women's Super League attendances
            </p>
          </div>
          {/* Stat card 5 */}
          <div
            className="glass-effect bg-white shadow-2xl flex flex-col justify-center items-center 
          gap-2 w-full md:w-[25%] py-8 px-6  text-center transition duration-300 ease-in-out transform hover:scale-125 cursor-pointer md:mb-10"
          >
            <p className="flex items-center justify-center rounded-full bg-main-ligther text-main-dark p-2">
              <AiFillEye className="text-main-darker text-3xl" />
            </p>
            <p className="font-bold text-white">14.46M</p>
            <p className="text-white text-[12px]">
              UK viewers for women's final (England vs Spain)
            </p>
          </div>
          {/* ---reference  */}
        </div>
        <div className="glass-effect flex items-center justify-center w-[180px] gap-[8px] mx-auto h-[40px]">
          <p className="text-white">Source By </p>
          <span>
            <img src={fifa_source} alt="" />
          </span>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default StatsBanner;

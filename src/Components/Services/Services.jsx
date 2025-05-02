import React, { useState } from "react";
import SectionWrapper from "../Wrapper/SectionWrapper";
import { BiSolidDownArrow } from "react-icons/bi";
// import { Fa1 } from "react-icons/fa6";
import { servicesData } from "../../data/Home";
import profile from "../../assets/images/jeffrey.jpg";

export const Services = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prevOpenSections) => ({
      ...prevOpenSections,
      [index]: !prevOpenSections[index],
    }));
  };

  return (
    <SectionWrapper justifyContent={"center"} alignItems={"center"} margin={"lg:mt-[5rem]"} width={"85%"}>
      <div className="w-full pb-[40px] lg:pb-[80px] flex flex-wrap items-center justify-center gap-8 lg:gap-16 xl:flex-row xl:flex-nowrap">
        <img src={profile} alt="ourservcies" className="w-[100%] xl:h-[550px] xl:w-[620px] object-cover"/>
        <div className=" flex flex-col gap-1 w-full">
          <div className="">
            <p className="text-main-dark text-[20px] uppercase text-center lg:text-start ">How it Works</p>
            <h1 className="text-[24px] font-medium lg:text-mianheading">COACHING SERVICE, CLUB OR SESSIONS</h1>
            <p className="text-[20px]">
              You can find coaches for women's & girl's football. Premium coaches, high standard and certified to teach you. It is absolutely free for a quote
              for your book onto any coaching session or group.
            </p>
          </div>
          <div className="flex pt-7  flex-col gap-3 w-full ">
            {servicesData.map((item, index) => (
              <div
                className="flex justify-center items-start flex-col shadow-inner border w-full cursor-pointer"
                key={index}
                onClick={() => toggleSection(index)}
              >
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between px-2 py-1">
                    <div className="flex justify-center items-center gap-3">
                      <div className={`bg-main-ligther rounded-full p-2 flex justify-center items-center `}>
                        <item.num className="text-[18px] text-main-darker" />
                      </div>
                      <div className={`font-semibold text-[17px] `}>{item.title}</div>
                    </div>
                    <div className="bg-main-ligther p-2 rounded-full flex justify-center items-center">
                      <BiSolidDownArrow
                        className={`cursor-pointer text-main-darker text-[17px] ${openSections[index] ? "rotate-180" : ""} transition-transform duration-500`}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`w-full bg-[#f1efef] transition-height duration-700 ease-in-out overflow-hidden ${
                    openSections[index] ? "max-h-[200px]" : "max-h-0"
                  }`}
                >
                  <p className={`ml-6 pb-6 pt-4 w-[70%] transition duration-700 ease-in-out ${openSections[index] ? "opacity-100" : "opacity-0"}`}>
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

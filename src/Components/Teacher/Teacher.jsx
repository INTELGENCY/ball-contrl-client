import React, { useEffect, useState } from "react";
import SectionWrapper from "../Wrapper/SectionWrapper";
import bgimg from "../../assets/images/Jeffery1.jpg";
import icon from "../../assets/images/ticon.png";
import { input } from "@material-tailwind/react";

const Teacher = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <SectionWrapper justifyContent={"center"} alignItems={"center"} margin={"mt-[4rem] lg:mt-[6rem]"} width={"85%"}>
      <div className="w-full mb-[3rem] lg:h-[630px] bg-cover bg-center" style={{ backgroundImage: `url(${bgimg})`}}>
        <div className="    w-[60%]  lg:w-[50%] ml-6 lg:ml-[6rem] mt-[5rem] flex flex-col gap-16  h-[80%]">
          <div>
            <h1 className="lg:block font-semibold md:text-mianheading text-xl md:text-3xl text-white">
              You can become a super <br className="hidden md:block" />
              teacher!
            </h1>
            <div className="border border-white w-[55%]"></div>
          </div>
          <div className=" md:flex  justify-start gap-2  md:ml-4">
            <img src={icon} alt="" className="w-[20px] h-[20px] " />
            <p className=" text-white hidden lg:block ">Pass on your knowledge and help grow women's and girl's football.</p>
            <p className="text-white block lg:hidden">
              Pass on your knowledge and  help grow women's  and girl's football.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Teacher;

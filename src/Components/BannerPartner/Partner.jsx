import React from "react";
import kick_it from "../../assets/png/kict-it-out.png";
import the_fa from "../../assets/png/the-fa.png";
import strive from "../../assets/png/striver.png";
import all_partner from "../../assets/png/all-partner.png";
import strive_logo from "../../assets/png/strivelogo.png"
import { Link } from "react-router-dom";

const Partner = () => {
  return (
    <div className="w-full mt-[2rem] xl:my-[6rem]">
      <h1 className="text-center text-gray-900 uppercase pb-8 md:pb-10 text-[24px] md:text-[43px] font-semibold">Our Partners</h1>
      <div className="xl:w-[85%] mx-auto flex items-center justify-center  gap-[15px] md:gap-[45px] xl:gap-[110px] ">
        <Link to="https://www.kickitout.org/" target="_blank">
          <img src={kick_it} className="w-[60px] md:w-[70px]" alt="partner_banner" />
        </Link>
        <Link to="https://www.thefa.com/womens-girls-football" target="_blank">
          <img src={the_fa} className="w-[60px]  md:w-[50px]" alt="partner_banner" />
        </Link>
        <Link to="https://striver.co.uk/" target="_blank">
          <img src={strive_logo} className="w-[60px]  md:w-[100px]" alt="partner_banner" />
        </Link>
        <Link to="/about-us">
          <img src={all_partner} className="w-[60px]  md:w-[70px]" alt="partner_banner" />
        </Link>
      </div>
    </div>
  );
};

export default Partner;

import React from "react";
import { Link } from "react-router-dom";
import coahimg from "../../assets/images/session_coach.png";

const BlogsCard = ({ data, index }) => {
  return (
    <div
      className="flex flex-col justify-between gap-5 p-3 border border-main-dark
    rounded-lg shadow-md md:w-[330px] h-[410px] w-full"
    >
      <img src={data.bannerImage} alt="" className=" h-[180px]" />
      <div className="bg-[#f2f3f6] py-1 px-1 w-[25%]  rounded">
        <p className="text-[12px]   text-[#4B6BFB]  ">{data.tag}</p>
      </div>
      <h1 className="text-[17px] font-semibold">{data.title}</h1>
      <div className="flex justify-between items-center w-full">
        <p className="text-sm w-[60%] text-[#97989F]">{data.date}</p>

        <Link
          to={`/blogdetail/${data._id}`}
          className="w- text-center text-main-dark border border-main-dark py-[0.4rem] px-1 sm:px-2 
      rounded text-sm hover:bg-main-dark  duration-200 hover:text-white"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
};

export default BlogsCard;

import React from "react";
import session_header from "../../assets/images/football-play (1).jpg";
import { Session_Data } from "../../data/Sessions";
import { Link } from "react-router-dom";

const SessionHead = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div>
      {/* Header */}
      <div className="relative w-full">
        <img
          src={session_header}
          alt="headerimage"
          className="md:h-[600px] w-full h-[280px]"
        />
        <p className="absolute bottom-10 left-11 text-white md:text-mianheading font-bold text-[25px]">
          Sessions
        </p>
      </div>

      {/* Cards Container */}
      <div className="w-[90%] mx-auto mt-[6rem]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Session_Data.map((data, index) => (
            <Link
              to={`/sessiondetails/?category=${data?.category}`}
              state={{ heading: data.heading }}
              key={index}
              className="w-full flex flex-col mb-6 rounded-lg shadow-md border border-main-primary"
            >
              <div className="flex flex-col w-full">
                <div className="">
                  <img
                    src={data.image}
                    width="100%"
                    className="h-56 bg-cover"
                    alt="data_image"
                  />
                </div>
                <div className="px-4 pb-5 pt-2">
                  <h1 className="text-[20px] font-bold text-gray-900 dark:text-white">
                    {data.heading}
                  </h1>

                  {/* Description */}
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    {data.paragraph}
                  </p>
                  <button
                    onClick={scrollToTop}
                    className="text-center w-full border border-main-dark py-[0.4rem] mt-3  px-1  sm:px-2 
                  rounded bg-main-dark duration-200 text-white"
                  >
                    {data.buttonText}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SessionHead;

import React, { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import ball_control_video from "../../assets/videos/ball-control-header.mp4";
import ball_video from "../../assets/videos/Ball Contr cleancut v2.mp4";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    agegroup: "",
    location: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/session/searched/sessions?${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("No sessions found");
      }

      const data = await response.json();
      const filteredData = data.filter(
        (session) =>
          (searchParams.location
            ? session.location
                .toLowerCase()
                .includes(searchParams.location.toLowerCase())
            : true) &&
          (searchParams.agegroup
            ? session.agegroup
                .toLowerCase()
                .includes(searchParams.agegroup.toLowerCase())
            : true) &&
          (searchParams.category
            ? session.category
                .toLowerCase()
                .includes(searchParams.category.toLowerCase())
            : true)
      );
      navigate("/searchedsession", { state: { Data: filteredData } });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="">
      <div className="relative w-full h-[211px] md:h-[39vh] lg:h-[42vh] xl:h-[100vh] overflow-hidden ">
        <video autoPlay loop muted className="absolute z-0  ">
          <source src={ball_video} />
          Your browser does not support the video tag.
        </video>

        <div className="absolute z-10 w-full h-full bg-black opacity-50"></div>

        <div className="relative z-20 w-full h-[235px]  md:h-[45vh] xl:h-full flex justify-center items-center overflow-hidden">
          <div className="flex justify-center items-center flex-col gap-2 sm:gap-4 ">
            <p className="uppercase text-white text-[16px]  lg:text-[20px] ">
              IT'S TIME TO PLAY FOOTBALL!
            </p>
            <h1 className="text-4xl font-bold text-white text-[20px] md:text-[30px] lg:text-[55px] text-center">
              WOMEN'S & GIRLS FOOTBALL
            </h1>
            <p className="text-white text-[14px] text-center lg:text-[20px] text-wrap">
              Find a coach, club, a game of football or find out more about
              Women's and Girls football.
            </p>

            <form
              onSubmit={handleSearch}
              className=" hidden md:flex  flex-wrap gap-4 md:flex-row items-center justify-center lg:gap-4 mt-4  rounded  "
            >
              <select
                name="category"
                className="leading-tight w-[170px] md:w-[170px] border-2 lg:w-[210px] px-2 py-2 rounded md:h-[50px]"
                style={{ outline: "none" }}
                value={searchParams.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="1 to 1">1 to 1</option>
                <option value="out field">Out Field</option>
                <option value="football clubs">Football Clubs</option>
                <option value="small group">Small Group</option>
              </select>

              {/* <input
                name="agegroup"
                className="leading-tight focus:outline-none w-[170px]  md:w-[170px] lg:w-[210px] px-2 md:h-[50px] py-3 rounded"
                type="text"
                placeholder="Enter Age Group"
                value={searchParams.agegroup}
                onChange={handleChange}
              /> */}
              <select
                name="agegroup"
                className="leading-tight w-[170px] md:w-[170px] border-2 lg:w-[210px] px-2 py-2 rounded md:h-[50px]"
                style={{ outline: "none" }}
                value={searchParams.agegroup}
                onChange={handleChange}
              >
                <option value="">Select Age group</option>
                <option value="U9-U12">U9-U12</option>
                <option value="U13-U16">U13-U16</option>
                <option value="U16+">U16+</option>
              </select>
              <input
                name="location"
                className="leading-tight focus:outline-none w-[170px]  md:w-[170px] lg:w-[210px] px-2 py-3 md:h-[50px] rounded"
                type="text"
                placeholder="Enter Location"
                value={searchParams.location}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="flex-shrink-0 w-[170px]  md:w-[170px] lg:w-[210px] md:h-[50px] bg-main-dark text-white font-medium py-3 px-4 focus:outline-none focus:ring-0 rounded"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;

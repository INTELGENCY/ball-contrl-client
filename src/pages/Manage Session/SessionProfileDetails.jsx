import { useEffect, useState } from "react";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper";
import session_header from "../../assets/images/football-play (1).jpg";
import { FaRegClock } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaShareFromSquare } from "react-icons/fa6";
import { FaCheck, FaStar } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { IoStar, IoPeople } from "react-icons/io5";
import { GoTrophy } from "react-icons/go";
import { RiMedalFill } from "react-icons/ri";
import { useSelector } from "react-redux";

const SessionProfileDetails = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { coachId } = useParams();
  const [coachData, setCoachData] = useState([]);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/coach/profile/${coachId}`
        );
        const data = await response.json();
        console.log(data);
        setCoachData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCoachProfile();
  }, [coachId]);

  return (
    <>
      <div>
        {/* Header */}
        <div className="relative w-full">
          <img
            src={session_header}
            alt="header-image"
            className="md:h-[600px] w-full h-[280px]"
          />
          <p className="absolute bottom-10 left-11 text-white md:text-mianheading font-bold text-[25px]">
            Coach Sessions
          </p>
        </div>
      </div>
      <SectionWrapper
        justifyContent={"center"}
        // alignItems={"center"}
        margin={"mt-[2rem]"}
        direction={"col"}
        gap={"gap-3"}
        width={"85%"}
      >
        <div className="w-full flex flex-col justify-between gap-5 bg-gray-50 py-10 shadow-[rgba(0,0,15,0.2)_2px_2px_24px_0px] rounded-md px-14">
          <div className="">
            <div>
              <div className="bg-white mb-6">
                <div className="grid gap-4 gap-y-6 text-sm grid-cols-1 lg:grid-cols-3">
                  <div className="lg:col-span-12 w-full">
                    <div className="grid gap-4 gap-y-6 text-sm grid-cols-1 md:grid-cols-6 mx-auto">
                      <div className="md:col-span-2">
                        <label htmlFor="address">Session Date</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          placeholder=""
                          className="h-11 border border-gray-600 focus:border-main-dark focus:ring-main-dark mt-1 rounded px-4 w-full bg-gray-50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="city">Session Type</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          placeholder=""
                          className="h-11 border border-gray-600 focus:border-main-dark focus:ring-main-dark mt-1 rounded px-4 w-full bg-gray-50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="country">Postal Code</label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          placeholder="Country"
                          className="h-11 border border-gray-600 focus:border-main-dark focus:ring-main-dark mt-1 rounded px-4 w-full bg-gray-50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="state">State / Province</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          placeholder="State"
                          className="h-11 border border-gray-600 focus:border-main-dark focus:ring-main-dark mt-1 rounded px-4 w-full bg-gray-50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="zipcode">Start Time</label>
                        <input
                          type="text"
                          id="zipcode"
                          name="zipcode"
                          placeholder=""
                          className="h-11 border border-gray-600 focus:border-main-dark focus:ring-main-dark mt-1 rounded px-4 w-full bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            {/* Availability Notice */}
            <div className="border border-gray-500 rounded p-2 bg-gray-50 text-gray-800 flex items-center justify-center text-center gap-2">
              <div>
                <p className="font-semibold flex items-center justify-center gap-2">
                  <FaRegClock className="text-md text-gray-800" /> Limited
                  Availability
                </p>
                <p className="text-sm">
                  Times not available:{" "}
                  <span className="font-medium">4:00 PM - 6:00 PM</span>
                </p>
              </div>
            </div>

            {/* Total Price Section */}
            <div className="mt-10">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="font-semibold text-lg">Total Price</p>
                <p className="font-bold text-lg">£20</p>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Includes VAT, protection fee, and £26 travel charge.
              </p>
            </div>

            {/* Generate Quote Button */}
            <div className="mt-6">
              <button className="border border-red-500 text-red-500 py-2 px-6 rounded-full hover:bg-red-100 transition">
                Generate Quote
              </button>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------- */}

        {/* Meet your coach */}
        <div className="w-full justify-between gap-5 bg-gray-50 py-10 border-2 rounded-md px-4">
          <div className="w-full flex lg:flex-row flex-col justify-between items-start">
            <h3 className="font-semibold text">Meet Your Coach</h3>
            <div className="lg:w-[60%] w-full  flex lg:flex-row flex-col lg:items-center items-start gap-5">
              <div className="lg:w-[40%] w-full lg:mt-0 ">
                <img
                  src={coachData.profilePic}
                  alt={coachData.username}
                  className="w-[100px] h-[100px] rounded-full object-cover"
                />
              </div>
              <div className="lg:w-[60%] w-full flex flex-col gap-3">
                <h1 className="font-semibold lg:text-2xl text-lg">
                  {coachData.username}
                </h1>
                <p className="text-main-dark font-semibold">Reviews</p>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-800" />
                  <FaStar className="text-yellow-800" />
                  <FaStar className="text-yellow-800" />
                  <FaStar className="text-gray-400" />
                  <FaStar className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-[50%] w-full flex-wrap mt-8 flex lg:flex-row flex-col items-start gap-2">
            <div className="flex flex-col gap-3">
              <h1 className="font-semibold">OverView</h1>
              <p className="flex items-center gap-1 text-sm">
                <span>
                  <IoStar className="text-lg" />
                </span>
                Top Five Start
              </p>
              <p className="flex items-center gap-1 text-sm">
                <span>
                  <GoTrophy className="text-lg" />
                </span>
                Hired 92 times
              </p>
              <p className="flex items-center gap-1 text-sm">
                <span>
                  <CiLocationOn className="text-lg" />
                </span>
                London
                {coachData.location} {/* Display coach's location */}
              </p>
              <p className="flex items-center gap-1 text-sm">
                <span>
                  <RiMedalFill className="text-lg" />
                </span>
                {coachData.experience} years of experience{" "}
                {/* Display coach's experience */}
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
};

export default SessionProfileDetails;

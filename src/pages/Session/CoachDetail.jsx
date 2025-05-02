import React, { useEffect, useState } from "react";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper";
import { CiLocationOn } from "react-icons/ci";
import { FaCheck, FaStar } from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaShareFromSquare } from "react-icons/fa6";
import { IoStar, IoPeople } from "react-icons/io5";
import { GoTrophy } from "react-icons/go";
import { RiMedalFill } from "react-icons/ri";
import { IoMdTimer } from "react-icons/io";
import { SiMastercard, SiVisa } from "react-icons/si";
import Reviews from "./Reviews/Reviews";
import { useSelector } from "react-redux";
import CoachSessions from "../../Components/CoachSessions/CoachSessions";

const CoachDetail = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { coachId } = useParams();
  const [coachData, setCoachData] = useState([]);

  const location = useLocation();
  // const coachData = location.state;

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

  const navigate = useNavigate();

  // Dummy payment methods data
  const paymentMethods = [
    {
      name: "Visa",
      icon: <SiVisa className="text-blue-500 text-4xl" />,
      description: "Pay securely with Visa.",
    },
    {
      name: "Mastercard",
      icon: <SiMastercard className="text-red-500 text-4xl" />,
      description: "Pay securely with Mastercard.",
    },
  ];

  const handleBook = () => {
    if (currentUser) {
      navigate(`/booking/${coachId}`);
    } else {
      alert("Please first login then book coach");
      navigate("/registration");
    }
  };

  return (
    <>
      <SectionWrapper
        justifyContent={"center"}
        alignItems={"center"}
        margin={"mt-[4rem]"}
        direction={"col"}
        gap={"gap-3"}
        width={"85%"}
      >
        <div className="w-full ">
          <div className="w-full flex lg:flex-row flex-col justify-between items-start">
            <div className="lg:w-[60%] w-full  flex lg:flex-row flex-col lg:items-center items-start gap-5">
              <div className="lg:w-[40%] w-full lg:mt-0 ">
                <img
                  src={coachData.profilePic}
                  alt={coachData.username}
                  className="w-full h-[250px] rounded-lg object-cover"
                />
              </div>
              <div className="lg:w-[60%] w-full flex flex-col gap-3">
                <h1 className="font-semibold lg:text-2xl text-lg">
                  {coachData.username}
                </h1>
                <p className="text-main-dark font-semibold">Exceptional 5.0</p>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-800" />
                  <FaStar className="text-yellow-800" />
                  <FaStar className="text-yellow-800" />
                  <FaStar className="text-gray-400" />
                  <FaStar className="text-gray-400" />
                </div>

                <div className="flex items-start">
                  <Link
                    to={"/"}
                    className="flex items-center gap-2 py-2 px-6 rounded-lg hover:bg-main-darker 
                  duration-200  border border-main-dark hover:pr-8 hover:text-white"
                  >
                    <FaShareFromSquare />
                    Share
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:w-[30%] w-full lg:mt-0 mt-8 flex flex-col items-start gap-5">
              <div className="w-full border-2 border-main-darker"></div>
              <p className="font-semibold text-main-dark text-2xl flex items-center gap-1">
                Message Coach & Book Now
              </p>
              <p className="text-gray-800 text-sm">
                <span className="font-semibold text-gray-700">
                  {coachData.username}:
                </span>{" "}
                Typically Has A Average Response Time
              </p>

              <div className="w-full flex items-center gap-4">
                <button
                  onClick={handleBook}
                  className="bg-main-dark px-10 rounded-md lg:py-3 py-2 border-2 border-main-dark text-white
                 hover:bg-main-darker duration-200"
                >
                  Book Now
                </button>
                <button
                  className="bg-white text-main-dark px-10 rounded-md lg:py-3 py-2 border-2 border-main-dark
                duration-200"
                >
                  Message
                </button>
              </div>
            </div>
          </div>
          <div className="lg:w-[60%] w-full mt-8 text-sm text-gray-600">
            <p>{coachData.description}</p>{" "}
            {/* Use the description from coachData */}
          </div>
          <div className="lg:w-[50%] w-full flex-wrap mt-8 flex lg:flex-row flex-col justify-between items-start gap-2">
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

            <div className="flex flex-col gap-3">
              <h1 className="font-semibold">Sessions Detail</h1>
              <p className="flex items-center gap-1 text-sm">
                <span>
                  <IoPeople className="text-lg" />
                </span>
                {coachData.sessions} sessions
                {coachData.sessions} {/* Display coach's sessions */}
              </p>
              <p className="flex items-center gap-1 text-sm">
                <span>
                  <IoMdTimer className="text-lg" />
                </span>
                60 Minutes
              </p>
            </div>
          </div>
          <div className="lg:w-[50%] w-full mt-8 flex flex-col">
            <h1 className="text-xl font-bold mb-4">Payment Methods</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg flex flex-col justify-center items-center p-4 hover:shadow-lg duration-200"
                >
                  {method.icon}
                  <h2 className="font-semibold mt-2">{method.name}</h2>
                  <p className="text-gray-500">{method.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mt-8 flex flex-col gap-6">
            <h1 className="text-xl font-bold">Reviews</h1>
            <Reviews coachId={coachData?._id} />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
};

export default CoachDetail;

import React, { useEffect, useRef, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper";
import Reviews from "../Session/Reviews/Reviews";
import SessionCard from "../../Components/Sessions/Cards/sessionCard";
import CoachProfileCard from "../../Components/Coaches/CoachProfileCard";
import FitnessCards from "../../Components/Coaches/FitnessCards";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
const CoachProfile = () => {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const { coachId } = useParams();
  const [coachData, setCoachData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleSessions, setVisibleSessions] = useState(8);
  const sessionCardsRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/coach/profile/${coachId}`
        );
        const data = await response.json();
        setCoachData(data);
      } catch (error) {
        console.error("Failed to fetch coach profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoachProfile();
  }, [coachId]);

  const handleShowMore = () => {
    setVisibleSessions((prev) => prev + 8);
  };

  const handleScrollToSessions = () => {
    if (currentUser.userType === "Coach") {
      Swal.fire({
        title: "Message Coach",
        text: "You are already a coach. Login as player to chat with coach?",
        icon: "error",
      });
      return;
    }
    sessionCardsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />;
      </div>
    );
  }

  const filteredSessions = coachData?.sessions?.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* coach cover-profile image */}
      <div>
        <div className="w-full" style={{ height: "348px" }}>
          <div className="flex flex-col">
            <div
              className="relative w-full bg-gradient-to-r from-pink-500 to-pink-300 bg-cover bg-center"
              style={{ height: "300px" }}
            >
              {/* Coach Name */}
              <div className="absolute inset-0 flex items-center justify-center ">
                <h1 className="font-semibold text-5xl text-white text-center tracking-wider">
                  {coachData.username}
                </h1>
              </div>

              {/* Profile Photo */}
              <div className="absolute bottom-[-60px] left-1/2 md:left-[330px] transform -translate-x-1/2">
                <img
                  src={coachData.profilePic}
                  alt={coachData.username}
                  className="rounded-full border-2 border-white w-44 h-44 object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --------------------------------- */}
      <div className="flex flex-col md:flex-row w-[70%] mx-auto gap-5 justify-between">
        {/* profile sub-data */}
        <div className="w-full md:w-[60%] mt-8">
          <div className="relative rounded-lg flex flex-col lg:flex-row items-center gap-8">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full">
              <h1 className="text-3xl font-semibold text-gray-900">
                {coachData.username}
              </h1>
              <p className="text-lg font-medium text-gray-600 mt-1">
                {coachData.experience} years of experience
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-1 mt-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar key={index} className="text-main-accent text-lg" />
                ))}
              </div>
              <p className="text-main-primary font-medium flex items-center gap-2 mt-2">
                <CiLocationOn className="text-main-dark" />
                {coachData.address_line_1}
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-500">
                {coachData.description}
              </p>

              <button className="mt-6 px-6 py-3 rounded-lg bg-main-accent text-white flex items-center gap-2 shadow-md hover:shadow-lg hover:bg-main-darker transition">
                Share <FaShareFromSquare />
              </button>
            </div>
          </div>
          <FitnessCards coachData={coachData} />
        </div>

        <CoachProfileCard
          coachData={coachData}
          user={currentUser}
          onRequestToBook={handleScrollToSessions}
        />
      </div>

      <SectionWrapper
        justifyContent="center"
        alignItems="center"
        margin="mt-[2rem]"
        direction="col"
        gap="gap-6"
        width="70%"
      >
        {/* <FitnessCards coachData={coachData} /> */}
        {/* Sessions */}
        <hr className="w-full" ref={sessionCardsRef} />
        <div className="w-full bg-white py-6">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-main-dark">Sessions</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="py-2 px-4 w-full md:w-1/3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-accent"
            />
          </div>
          {filteredSessions?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full h-full mt-5">
                {filteredSessions
                  .slice(0, visibleSessions)
                  .map((session, index) => (
                    <SessionCard key={index} data={session} />
                  ))}
              </div>
              {visibleSessions < filteredSessions?.length && (
                <div className="mt-5 flex justify-center">
                  <button
                    onClick={handleShowMore}
                    className="px-6 py-2 rounded-lg bg-main-accent text-white shadow-md hover:shadow-lg hover:bg-main-darker transition-all duration-200"
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600 mt-2">No sessions found...</p>
          )}
        </div>

        {/* Reviews */}
        <div className="w-full bg-white p-6 rounded-md shadow-md mt-5">
          <h1 className="text-xl font-bold text-gray-900 underline mb-6">
            Reviews
          </h1>
          <Reviews coachId={coachData?._id} />
        </div>
      </SectionWrapper>
    </>
  );
};

export default CoachProfile;

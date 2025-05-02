import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import sessionhead from "../../assets/images/football-play (1).jpg";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper";
import SessionCard from "../../Components/Sessions/Cards/sessionCard";
import { useLocation, useSearchParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const SessionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const category = searchParams.get("category");
  const location = useLocation();
  const { heading } = location.state;
  useEffect(() => {
    const fetchSessionsByCategory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/session/getByCategory/${category}`
        );
        if (response.data) {
          setSessions(response.data);
          setFilteredSessions(response.data);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessionsByCategory();
  }, [category]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = sessions.filter(
      (session) =>
        session.title?.toLowerCase().includes(query) ||
        session.coachName?.toLowerCase().includes(query) ||
        session.description?.toLowerCase().includes(query)
    );
    setFilteredSessions(filtered);
  }, [searchQuery, sessions]);

  return (
    <>
      {/* Header */}
      <div className="relative w-full">
        <img
          src={sessionhead}
          alt="headerimage"
          className="md:h-[600px] w-full h-[280px] bg-cover"
        />
        <p className="absolute bottom-10 left-11 text-white md:text-mainheading font-bold text-[25px]">
          Sessions / {heading}
        </p>
      </div>

      {loading ? (
        <div className="w-full h-40 flex justify-center  items-center">
          <SyncLoader color="#FEB7DC" />;
        </div>
      ) : (
        <SectionWrapper
          justifyContent={"center"}
          alignItems={"center"}
          margin={"mt-[4rem]"}
          direction={"col"}
          gap={"gap-3"}
        >
          {/* Search Bar */}
          <div className="flex justify-center items-center w-[100%] gap-2 md:flex-row flex-col">
            <div className="flex items-center md:basis-3/12 relative w-full">
              <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:bg-[#E6E6E6]"
              />
            </div>
          </div>

          {/* Sessions Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session, index) => (
                <SessionCard key={index} data={session} />
              ))
            ) : (
              <p className="text-[20px]">
                No session available for the category
              </p>
            )}
          </div>
        </SectionWrapper>
      )}
    </>
  );
};

export default SessionPage;

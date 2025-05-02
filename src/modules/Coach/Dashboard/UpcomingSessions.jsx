import React, { useEffect, useState } from "react";
import { FaCalendar, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

const UpcomingSessions = () => {
  const [upComingData, setUpComingData] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getSessionDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/bookedsession/getdata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const currentDate = new Date();

          const upcomingSession = data
            .filter((item) => {
              const startDate = new Date(item.startDate);
              const daysDifference = (startDate - currentDate) / (1000 * 60 * 60 * 24);
              return item.coachId === currentUser._id && daysDifference > 0; // startDate is greater than currentDate
            })
            .sort((a, b) => {
              const aDaysDifference = new Date(a.startDate) - currentDate;
              const bDaysDifference = new Date(b.startDate) - currentDate;
              return aDaysDifference - bDaysDifference; // Sort by closest startDate
            });

          if (upcomingSession.length > 0) {
            setUpComingData([upcomingSession[0]]); // Set the nearest upcoming session
          } else {
            setUpComingData([]); // No upcoming sessions found
          }
        } else {
          console.error("Failed to fetch session details. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
    };

    getSessionDetails();
  }, [currentUser]);

  return (
    <div className="w-full flex rounded-lg bg-main-dark text-white justify-between mb-8 shadow-lg">
      <div className="w-[60%] px-6 py-4">
        <p className="text-lg font-semibold">Your Upcoming Sessions</p>
        <div className="flex gap-8 mt-4 items-center">
          {upComingData.length > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <FaClock className="text-xl text-gray-300" />
                <p className="text-md">{upComingData[0].time}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-xl text-gray-300" />
                <p className="text-md">{upComingData[0].startDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-xl text-gray-300" />
                <p className="text-md">{upComingData[0].location}</p>
              </div>
            </>
          ) : (
            <p className="text-md">No upcoming sessions</p>
          )}
        </div>
      </div>
      <div
        className="w-[40%] bg-[#F8BDC5] flex items-center justify-center"
        style={{
          borderTopRightRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          borderTopLeftRadius: "8rem",
        }}
      ></div>
    </div>
  );
};

export default UpcomingSessions;

import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-hot-toast";

const BookingConfirmation = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const sessionId = queryParams.get("session_id");

  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coachDetails, setCoachDetails] = useState(null);
  const [getBookingDetails, setGetBookingDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!sessionId) return;

      try {
        // Fetch session details
        const sessionResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/get-booking-details?session_id=${sessionId}`);
        if (!sessionResponse.ok) throw new Error("Failed to retrieve session details");
        const sessionData = await sessionResponse.json();
        setSessionDetails(sessionData);

        // Fetch coach details
        const coachId = sessionData.metadata.coachId;
        const coachResponse = await fetch(`${import.meta.env.VITE_BASE_URL}/coach/profile/${coachId}`);
        if (!coachResponse.ok) throw new Error("Failed to retrieve coach details");
        const coachData = await coachResponse.json();
        setCoachDetails(coachData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [sessionId]);

  useEffect(() => {
    const addOrderId = async () => {
      if (!sessionDetails || !coachDetails) return;

      try {
        const coachId = sessionDetails.metadata.coachId;
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/session-order/session-order-post/${sessionId}/${coachId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          toast("Session order created successfully");
        }
      } catch (error) {
        console.log(error);
      }
    };

    addOrderId();
  }, [sessionDetails, coachDetails, sessionId]);
  console.log("metaa", sessionDetails);

  const isBookingExists = (bookedData, existingBookings) => {
    return existingBookings.some((booking) => booking.playerId === bookedData.playerId && booking.sessionId === bookedData.selectedSessionId);
  };

  const sendBookingInfo = async () => {
    if (!sessionDetails) return;

    const bookedData =
      sessionDetails.metadata.playerId && sessionDetails.metadata.selectedSessionId
        ? {
            playerId: sessionDetails.metadata.playerId,
            selectedSessionId: sessionDetails.metadata.selectedSessionId,
            coachId: sessionDetails.metadata.coachId,
            coachName: sessionDetails.metadata.coachName,
            sessionName: sessionDetails.metadata.sessionName,
            price: sessionDetails.metadata.price,
            time: sessionDetails.metadata.time,
            category: sessionDetails.metadata.category,
            location: sessionDetails.metadata.location,
            startDate: sessionDetails.metadata.startDate,
            endDate: sessionDetails.metadata.endDate,
            sessionImage: sessionDetails.metadata.sessionImage,
          }
        : null;

    if (!bookedData) return;

    // Check if booking already exists
    if (isBookingExists(bookedData, getBookingDetails)) {
      return;
    }

    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/bookedsession/postdata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookedData),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getBokkedData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/bookedsession/getdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGetBookingDetails(
          data.map((item) => ({
            sessionId: item.selectedSessionId,
            playerId: item.playerId,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getBokkedData();
      await sendBookingInfo();
    };

    fetchData();
  }, [sessionDetails]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#fd86c8" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!sessionDetails || !coachDetails) {
    return <div className="flex justify-center items-center h-screen">No session or coach details available</div>;
  }

  const bookingDetails = {
    session: sessionDetails.metadata.sessionName || "No session data",
    location: sessionDetails.metadata.location || "No location data",
    coachImage: coachDetails.profilePic || "https://randomuser.me/api/portraits/women/65.jpg",
    coachName: sessionDetails.metadata.coachName,
    startDate: sessionDetails.metadata.startDate || "No date data",
    endDate: sessionDetails.metadata.endDate || "No date data",
    time: sessionDetails.metadata.time || "No time data",
    price: `$${sessionDetails.metadata.price || 0}`,
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white p-6 shadow-md rounded-lg mt-10 xl:flex-row flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
      </div>
      <div className="flex xl:flex-row flex-col">
        <div className="xl:w-1/3 xl:pr-6 w-full">
          <div className="p-4 border rounded-lg shadow-sm mb-6">
            <h3 className="text-sm text-gray-600 mb-2">Session:</h3>
            <p className="font-semibold capitalize">{bookingDetails.session}</p>
            <p className="capitalize">{bookingDetails.location}</p>
            <div className="flex items-center mt-4">
              <img src={bookingDetails.coachImage} alt="Coach" className="w-20 h-20 rounded-xl mr-4" />
              <div>
                <p className="font-semibold">{bookingDetails.coachName}</p>
                <p className="text-gray-600">Coach</p>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:w-2/3 w-full">
          <div className="p-6 border rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex gap-[20px]">
                  <p className="font-semibold text-2xl">
                    StartDate: <span className="font-normal">{bookingDetails.startDate}</span>
                  </p>
                  <p className="font-semibold text-red-700 text-2xl">
                    EndDate: <span className="font-normal">{bookingDetails.endDate}</span>
                  </p>
                </div>
                <p className="font-semibold text-2xl">
                  Time: <span className="font-normal">{bookingDetails.time}</span>
                </p>
                <div className="py-3 flex justify-start items-center mt-3">
                  <p className="bg-[#2EC114] rounded-2xl py-1 px-2 text-white flex items-center gap-1">
                    <FaCheckCircle className="text-xl" />
                    Confirmed
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm">Sessions:</p>
            <div className="w-full flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold capitalize">{bookingDetails.session}</p>
                <p className="capitalize">{bookingDetails.location}</p>
              </div>
            </div>

            <div className="flex items-center my-4">
              <img src={bookingDetails.coachImage} alt="Coach" className="w-20 h-20 rounded-xl mr-4" />
              <div>
                <p className="font-semibold">{bookingDetails.coachName}</p>
                <p className="text-gray-600">Coach</p>
              </div>
            </div>

            <div className="mt-5 border border-gray-400 rounded-lg">
              <div className="w-full flex justify-between items-center border-b border-gray-400 p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold capitalize">{bookingDetails.session}</p>
                  <p>1h</p>
                </div>
                <div>
                  <p>{bookingDetails.price}</p>
                </div>
              </div>
              <div className="w-full flex justify-between items-center p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-gray-600">Taxes</p>
                  <p className="text-xl font-semibold mt-2">Total</p>
                </div>
                <div className="text-end">
                  <p className="text-gray-600">$0</p>
                  <p className="mt-2">{bookingDetails.price}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

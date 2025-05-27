import React, { useState, useEffect } from "react";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper";
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
  isValid,
} from "date-fns";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import PostalCode from "../../Components/PostalCode/PostalCode";
import { getOneByPlayerAndSessionIds } from "../../services/BookigAPis";
import moment from "moment";
import Swal from "sweetalert2";
import { BaseUrl } from "../../keys";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPostalCode, setSelectedPostalCode] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [coachData, setCoachData] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
  const [isAlreadyBooking, setIsAlreadyBooking] = useState({});
  const [bookingData, setBookingData] = useState();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { coachId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [price, setPrice] = useState(searchParams.get("price"));
  const bookingId = searchParams.get("bookingId");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [availabilityResponse, coachResponse, sessionResponse] =
          await Promise.all([
            axios.post(
              `${
                import.meta.env.VITE_BASE_URL
              }/availability/getAvailabilityDetails`,
              { coachId }
            ),
            fetch(
              `${import.meta.env.VITE_BASE_URL}/coach/profile/${coachId}`
            ).then((res) => res.json()),
            axios.get(`${import.meta.env.VITE_BASE_URL}/session/${sessionId}`),
          ]);

        const { unavailableDates, timeSlots } = availabilityResponse.data;
        setUnavailableDates(unavailableDates);

        setTimeSlots(timeSlots);
        setCoachData(coachResponse);
        setSessionData(sessionResponse.data);

        generateDates();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const generateDates = () => {
      const startDate = startOfWeek(currentMonth);
      const endDate = addDays(startDate, 41);
      const newDates = [];
      let date = startDate;

      while (date <= endDate) {
        newDates.push(date);
        date = addDays(date, 1);
      }

      setDates(newDates);
    };

    const checkIfAlreadyBooked = async () => {
      try {
        const response = await getOneByPlayerAndSessionIds(
          currentUser._id,
          sessionId
        );
        setIsAlreadyBooked(response?.status);
        setIsAlreadyBooking(response?.booking);
      } catch (error) {
        console.error("Error checking if already booked:", error);
        setIsAlreadyBooked(false);
      }
    };

    fetchData();
    checkIfAlreadyBooked();
  }, [coachId, currentMonth, sessionId]);

  useEffect(() => {
    const fetchPreviousBooking = async () => {
      setFetchLoading(true);
      try {
        const response = await axios.get(
          `${BaseUrl}/bookings/getOneBooking/${bookingId}`
        );

        setBookingData(response?.data?.booking);

        if (bookingId) {
          setIsEditMode(true);

          const booking = response?.data?.booking;

          if (booking) {
            setSelectedDate(new Date(booking.sessionDate));
            setSelectedTime(convertTimeFormat(booking.startTime));
            setSelectedPostalCode(booking.postalCode);
            setPrice(booking.sessionAmount);
          }
          console.log("the data is", selectedPostalCode, selectedTime, price);
        }

        setFetchLoading(false);
      } catch (error) {
        setFetchLoading(false);
        console.log("error while fetching data", error);
      }
    };

    if (bookingId) {
      fetchPreviousBooking();
    }
  }, [bookingId]);

  const convertTimeFormat = (time) => {
    if (!time) return null;

    if (time.match(/^\d{1,2}:\d{2}$/)) return time;
    return moment(time, "h:mm A").format("HH:mm");
  };

  const isTimeSelected = (slotTime) => {
    if (!selectedTime) return false;

    // Compare both possible formats
    return (
      selectedTime === slotTime ||
      formatTime(selectedTime) === formatTime(slotTime) ||
      convertTimeFormat(selectedTime) === slotTime
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    return (
      unavailableDates.includes(format(date, "yyyy-MM-dd")) || date < today
    );
  };

  const isTimeSlotDisabled = (slot) => {
    if (!selectedDate || !isValid(selectedDate)) return true;
    const isDateUnavailable = unavailableDates.includes(
      format(selectedDate, "yyyy-MM-dd")
    );
    return isDateUnavailable || !slot.isAvailable;
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const formattedHour = parseInt(hour, 10) % 12 || 12;
    const period = parseInt(hour, 10) >= 12 ? "PM" : "AM";
    return `${formattedHour}:${minute} ${period}`;
  };

  const handleGenerateBooking = async () => {
    const startTime = selectedTime;
    const [hour, minute] = startTime.split(":");
    const endTime = `${parseInt(hour, 10) + 1}:${minute}`;

    const dataToSend = {
      coachId,
      playerId: currentUser._id,
      sessionId: sessionId,
      sessionDate: selectedDate,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      sessionType: sessionData?.category,
      postalCode: selectedPostalCode,
      sessionAmount: parseInt(price),
    };

    try {
      setBookingLoading(true);

      let response;
      if (isEditMode && bookingId) {
        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/bookings/updateQuote/${bookingId}`,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/bookings/generateBooking`,
          dataToSend,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      }

      setBookingLoading(false);

      toast.success(
        response?.data.message ||
          (isEditMode
            ? "Booking updated successfully"
            : "Booking generated successfully")
      );

      navigate(`/checkout/${response?.data.booking._id}`);
    } catch (error) {
      setBookingLoading(false);
      console.error("Error generating booking", error);

      toast.error(
        error.response?.data?.message ||
          (isEditMode
            ? "Something went wrong while updating booking"
            : "Something went wrong while generating booking")
      );
    }
  };
  if (fetchLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />
      </div>
    );
  return (
    <SectionWrapper justifyContent="center" alignItems="center" direction="col">
      <h2 className="text-2xl font-bold mb-4 text-start w-full my-10">
        Select Date and Time
      </h2>
      <div className="flex p-4 gap-4 w-full justify-between md:flex-row flex-col">
        <div className="flex w-full md:w-[65%] flex-col p-3 shadow-[0_3px_10px_rgb(0,0,0,0.2)] border">
          <div className="w-full flex justify-between items-center mb-4">
            <div
              className="text-lg p-1.5 cursor-pointer rounded-full flex justify-center bg-main-primary items-center"
              onClick={prevMonth}
            >
              <FaAngleLeft />
            </div>
            <h2 className="text-xl font-bold">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <div
              className="text-lg p-1.5 cursor-pointer rounded-full flex justify-center items-center bg-main-primary"
              onClick={nextMonth}
            >
              <FaAngleRight />
            </div>
          </div>
          <div className="grid grid-cols-7 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-bold">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {dates.map((date) => (
              <button
                key={date}
                className={`py-4 px-4 rounded-lg border ${
                  selectedDate &&
                  format(selectedDate, "yyyy-MM-dd") ===
                    format(date, "yyyy-MM-dd")
                    ? "bg-main-dark text-white"
                    : "bg-white text-black"
                } ${
                  isDateDisabled(date) ? "bg-gray-200 text-gray-500" : ""
                } hover:bg-main-primary`}
                onClick={() => handleDateChange(date)}
                disabled={isDateDisabled(date)}
              >
                {format(date, "d")}
              </button>
            ))}
          </div>
          <div className="w-full mt-4">
            {selectedDate && (
              <div className="flex flex-col gap-4">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.startTime}
                    className={`py-6 px-4 rounded-lg border text-start ${
                      isTimeSlotDisabled(slot)
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : isTimeSelected(slot.startTime) // Use the new comparison
                        ? "bg-main-dark text-white"
                        : "bg-white text-black hover:bg-main-primary"
                    }`}
                    onClick={() => handleTimeChange(slot.startTime)}
                    disabled={isTimeSlotDisabled(slot)}
                  >
                    {`${formatTime(slot.startTime)} - ${formatTime(
                      slot.endTime
                    )}`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-[30%]">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-3">
            <p className="text-sm">Session</p>
            <p className="font-semibold">{sessionData?.title}</p>
            <p>{coachData?.address_line_1}</p>
            <div className="border border-gray-300 w-full"></div>
            <div className="flex py-4 gap-2 items-center">
              <img
                src={coachData?.profilePic}
                alt="coach pic"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {coachData?.username}
                </p>
              </div>
            </div>
            <div className="border border-gray-300 w-full"></div>
            <div className="flex py-4 w-full justify-between px-3">
              <div>
                <p>Session</p>
                <p>1h</p>
              </div>
              <p>£ {price}</p>
            </div>
            <div className="flex py-4 w-full justify-between px-3 font-semibold">
              <p>Total</p>
              <p>£ {price}</p>
            </div>
            <PostalCode
              setSelectedPostalCode={setSelectedPostalCode}
              initialValue={selectedPostalCode}
            />

            <button
              className="mt-4 py-2 px-4 w-full rounded-lg bg-main-darker text-white disabled:bg-gray-300"
              disabled={!selectedTime || bookingLoading}
              onClick={handleGenerateBooking}
            >
              {bookingLoading
                ? "Loading..."
                : isEditMode
                ? "Update Booking"
                : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default BookingPage;

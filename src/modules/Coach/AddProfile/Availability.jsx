import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSelector } from "react-redux";
import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AvailabilityManagerPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState({});

  // Initialize with default time slots (8am to 11pm)
  const initializeTimeSlots = () => {
    return Array.from({ length: 16 }, (_, i) => {
      const start = 8 + i;
      return {
        startTime: `${start.toString().padStart(2, "0")}:00`,
        endTime: `${(start + 1).toString().padStart(2, "0")}:00`,
        isAvailable: true, // Default all slots to available
      };
    });
  };

  // Fetch availability data on component mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setInitialLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/availability/getAvailabilityDetails/${currentUser._id}`
        );

        const {
          timeSlots: apiTimeSlots = [],
          unavailableDates: apiUnavailableDates = [],
        } = response.data;

        // Use API data if available, otherwise use defaults
        if (apiTimeSlots.length > 0) {
          setTimeSlots(apiTimeSlots);

          // Convert time slots to selectedSlots format
          const slotsObj = {};
          apiTimeSlots.forEach((slot) => {
            slotsObj[slot.startTime] = slot.isAvailable;
          });
          setSelectedSlots(slotsObj);
        } else {
          const defaultSlots = initializeTimeSlots();
          setTimeSlots(defaultSlots);

          const defaultSlotsObj = {};
          defaultSlots.forEach((slot) => {
            defaultSlotsObj[slot.startTime] = slot.isAvailable;
          });
          setSelectedSlots(defaultSlotsObj);
        }

        setUnavailableDates(apiUnavailableDates);
      } catch (error) {
        console.error("Error fetching availability:", error);
        // Initialize with default values if API fails
        const defaultSlots = initializeTimeSlots();
        setTimeSlots(defaultSlots);

        const defaultSlotsObj = {};
        defaultSlots.forEach((slot) => {
          defaultSlotsObj[slot.startTime] = slot.isAvailable;
        });
        setSelectedSlots(defaultSlotsObj);
      } finally {
        setInitialLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchAvailability();
    }
  }, [currentUser?._id]);

  const handleSlotToggle = (slot) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slot.startTime]: !prev[slot.startTime],
    }));
  };

  const handleDateChange = (newDate) => {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    if (!unavailableDates.includes(formattedDate)) {
      setUnavailableDates((prev) => [...prev, formattedDate]);
    }
  };

  const removeUnavailableDate = (dateToRemove) => {
    setUnavailableDates((prev) => prev.filter((date) => date !== dateToRemove));
  };

  const handleSubmit = async () => {
    const availability = timeSlots.map((slot) => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      isAvailable: !!selectedSlots[slot.startTime],
    }));

    const dataToSend = {
      coachId: currentUser?._id,
      availability,
      fullyUnavailableDates: unavailableDates,
    };

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/availability/createAvailability`,
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Availability saved successfully");
      navigate("/coach-dashboard?tab=profile"); // Redirect to dashboard after save
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save availability");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main-dark"></div>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className=" bg-gray-50 ">
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Your Availability
              </h1>
            </div>

            <div className="mb-8">
              <p className="text-gray-600 mb-6">
                Set your weekly availability and mark specific dates when you're
                unavailable. This helps players know when they can book sessions
                with you.
              </p>

              <h2 className="text-xl font-semibold mb-4">Weekly Time Slots</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.startTime}
                    className={`p-3 flex items-center justify-between rounded-lg cursor-pointer border transition-colors ${
                      selectedSlots[slot.startTime]
                        ? "border-main-dark bg-pink-50"
                        : "border-gray-200 bg-white"
                    } hover:shadow-md`}
                    onClick={() => handleSlotToggle(slot)}
                  >
                    <span className="text-main-dark material-icons text-sm">
                      access_time
                    </span>
                    <span
                      className={`text-sm ${
                        selectedSlots[slot.startTime]
                          ? "text-main-dark font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </span>
                    {selectedSlots[slot.startTime] ? (
                      <span className="text-main-dark material-icons text-sm">
                        check_circle
                      </span>
                    ) : (
                      <span className="text-gray-300 material-icons text-sm">
                        radio_button_unchecked
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Block Specific Dates
              </h2>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <DatePicker
                  label="Select date to block"
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <div className="relative">
                      <input
                        {...params.inputProps}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-main-dark focus:border-main-dark"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-400 material-icons">
                        event
                      </span>
                    </div>
                  )}
                />
              </div>

              {unavailableDates.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Blocked Dates:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {unavailableDates.map((date) => (
                      <div
                        key={date}
                        className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-gray-800 rounded-lg border border-pink-100 text-sm"
                      >
                        {date}
                        <button
                          onClick={() => removeUnavailableDate(date)}
                          className="text-pink-500 hover:text-pink-700 material-icons text-base"
                        >
                          close
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(`/coach-dashboard?tab=profile`)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 text-white bg-main-dark rounded-lg flex items-center gap-2 hover:bg-main-darker disabled:bg-gray-400 ${
                  loading && "cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <span className="material-icons animate-spin text-base">
                      loop
                    </span>
                    Saving...
                  </>
                ) : (
                  "Save Availability"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default AvailabilityManagerPage;

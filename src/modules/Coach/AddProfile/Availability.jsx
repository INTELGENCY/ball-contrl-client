import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const AvailabilityManager = ({ gotNextTab }) => {
  const [selectedSlots, setSelectedSlots] = useState({});
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const start = 8 + i;
    return {
      startTime: `${start.toString().padStart(2, "0")}:00`,
      endTime: `${(start + 1).toString().padStart(2, "0")}:00`,
    };
  });

  const handleSlotToggle = (slot) => {
    setSelectedSlots((prev) => ({
      ...prev,
      [slot.startTime]: !prev[slot.startTime],
    }));
  };

  const handleDateChange = (newDate) => {
    const formattedDate = newDate.format("YYYY-MM-DD");
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
      const response = axios.post(
        `${import.meta.env.VITE_BASE_URL}/availability/createAvailability`,
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-4 md:p-8 mt-10 bg-gray-100 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Manage Availability</h1>
        <p className="text-base mb-4">
          Select the time slots during which you are available. The remaining
          slots will automatically be marked as unavailable.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {timeSlots.map((slot) => (
            <div
              key={slot.startTime}
              className={`p-4 flex items-center justify-between rounded-lg cursor-pointer border transition-transform ${
                selectedSlots[slot.startTime]
                  ? "border-main-dark bg-pink-50"
                  : "border-gray-300 bg-white"
              } hover:shadow-lg hover:scale-105`}
              onClick={() => handleSlotToggle(slot)}
            >
              <span className="text-main-dark material-icons">access_time</span>
              <p
                className={`text-sm font-medium ${
                  selectedSlots[slot.startTime]
                    ? "text-main-dark"
                    : "text-gray-700"
                }`}
              >
                {slot.startTime} - {slot.endTime}
              </p>
              {selectedSlots[slot.startTime] && (
                <span className="text-main-dark material-icons">
                  check_circle
                </span>
              )}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold mt-8 mb-4">
          Select Fully Unavailable Dates
        </h1>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <DatePicker
            onChange={(newValue) => handleDateChange(newValue)}
            renderInput={(params) => (
              <button
                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-100"
                {...params}
              >
                Add Unavailable Date
              </button>
            )}
          />
        </div>

        <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
          {unavailableDates.length === 0 ? (
            <p className="text-sm text-gray-500">No dates selected</p>
          ) : (
            unavailableDates.map((date) => (
              <div
                key={date}
                className="flex items-center gap-2 px-4 py-2 bg-[#fddbe9] text-gray-900 rounded-lg border border-pink-200 text-sm font-medium"
              >
                {date}
                <button
                  onClick={() => removeUnavailableDate(date)}
                  className="text-red-500 hover:text-red-700 material-icons"
                >
                  delete
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-6 py-2 text-white bg-main-dark rounded-lg flex items-center gap-2 hover:bg-main-darker disabled:bg-gray-400 ${
              loading && "cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="material-icons animate-spin">loop</span>
            ) : (
              "Save & Continue"
            )}
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default AvailabilityManager;

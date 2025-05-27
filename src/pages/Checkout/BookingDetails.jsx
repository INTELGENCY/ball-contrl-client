import { FaBackward } from "react-icons/fa";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import {
  FaEdit,
  FaCalendarAlt,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTrash,
  FaCreditCard,
} from "react-icons/fa";
import moment from "moment/moment";
import {
  createPaymentIntent,
  deleteOneBooking,
} from "../../services/BookigAPis";
import toast from "react-hot-toast";

export const BookingDetails = ({
  setActiveStep,
  bookingData,
  bookingLoading,
  setClientSecretKey,
  refetchBooking,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setActiveStep(2);
    console.log("Next button clicked");
  };

  const handleCreatePaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await createPaymentIntent(bookingData._id);
      setClientSecretKey(response?.clientSecret);
      setLoading(false);
      refetchBooking();
      setActiveStep(1);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    navigate(
      `/booking/${bookingData.coachId}?sessionId=${bookingData?.sessionId}&bookingId=${bookingData._id}&price=${bookingData?.sessionAmount}`
    );
  };

  const handleDeleteBooking = async () => {
    try {
      const response = await deleteOneBooking(bookingData._id);
      navigate(-1);
      toast.success(response?.message || "Booking deletes successfully");
    } catch (error) {
      console.log("Error while deleting booking");
      toast.error("Error occurred while deleting booking");
    }
  };

  if (bookingLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-900 font-bold text-xl">Your Booking</h2>
          <button
            className="flex items-center text-main-darker border border-main-darker px-4 py-1.5 rounded-lg text-sm"
            onClick={handleEdit}
          >
            <FaEdit className="mr-2" /> Edit
          </button>
        </div>

        {/* Event Details */}
        <div className="space-y-3">
          {/* Date */}
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <p className="text-sm text-gray-500">
              {moment(bookingData?.sessionDate).format("MMMM D, YYYY")}
            </p>
          </div>

          {/* Title */}
          <div className="flex items-center">
            <FaTicketAlt className="text-gray-800 mr-2" />
            <p className="font-bold text-sm text-gray-800">
              {bookingData?.sessionType}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <p className="text-sm text-gray-500">{bookingData?.postalCode}</p>
          </div>

          {/* Start Time */}
          <div className="flex items-center">
            <FaClock className="text-gray-500 mr-2" />
            <p className="text-sm text-gray-500">{bookingData?.startTime}</p>
          </div>
        </div>

        {/* Total Price */}
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">Total Price</p>
          <p className="font-bold text-lg">£ {bookingData?.sessionAmount}</p>
        </div>
        <hr className="my-4" />

        {/* Buttons */}
        <div className="mt-6 text-center flex justify-between items-center gap-4">
          <button
            onClick={handleDeleteBooking}
            className=" bg-red-500 text-white font-bold py-2 rounded-md px-6"
          >
            Discard Booking
          </button>
          {bookingData?.paymentIntentId ? (
            <button
              className=" bg-main-darker text-white font-bold py-2 rounded-md disabled:opacity-50 px-6"
              onClick={() => setActiveStep(1)}
            >
              Got To Payment
            </button>
          ) : (
            <button
              className=" bg-main-darker text-white font-bold py-2 rounded-md disabled:opacity-50 px-6"
              onClick={handleCreatePaymentIntent}
              disabled={loading}
            >
              {loading ? "Loading..." : "Continue To Pay"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

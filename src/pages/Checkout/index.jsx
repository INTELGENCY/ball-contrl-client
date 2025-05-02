import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { BookingDetails } from "./BookingDetails";
import PaymentDetails from "./PaymentDetails";
import ConfirmBooking from "./ConfirmBooking";
import axios from "axios";
import { BaseUrl } from "../../keys";
import { getOneBooking } from "../../services/BookigAPis";
import { ToastContainer } from "react-toastify";

const steps = [
  { label: "Make Deposit" },
  { label: "Pay Deposit" },
  { label: "Get Booking Confirmed" },
];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [clientSecretKey, setClientSecretKey] = useState("");
  const { id } = useParams();

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const getOneBookingHandler = async () => {
    try {
      setLoading(true);
      const response = await getOneBooking(id);
      setBookingData(response?.booking);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("this is error", error);
    }
  };
  const setLastStep = () => {
    if (bookingData?.status === "confirmed") {
      setActiveStep(2);
    }
  };

  useEffect(() => {
    getOneBookingHandler();
  }, [id]);
  useEffect(() => {
    setLastStep();
  }, [bookingData]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="flex justify-center items-center mt-12 mb-5">
      <div className="w-11/12 p-3 bg-gray-50 rounded-lg">
        {/* Stepper component */}
        <div className="mb-4 flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index < steps.length - 1 ? "w-full" : ""
              }`}
            >
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold ${
                  index === activeStep || index < activeStep
                    ? "bg-main-dark"
                    : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  index === activeStep || index < activeStep
                    ? "text-main-darker"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-2 ${
                    index < activeStep ? "bg-main-dark" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          {activeStep === 0 && (
            <BookingDetails
              setActiveStep={setActiveStep}
              activeStep={activeStep + 1}
              bookingData={bookingData}
              refetchBooking={getOneBookingHandler}
              quoteLoading={loading}
              setClientSecretKey={setClientSecretKey}
            />
          )}
          {activeStep === 1 && (
            <div>
              <PaymentDetails
                refetchBooking={getOneBookingHandler}
                setActiveStep={setActiveStep}
                bookingData={bookingData}
                clientSecretKey={clientSecretKey}
              />
              <div className="mt-2 flex justify-between">
                <button
                  className="border border-green-600 text-green-600 px-4 py-2 rounded-lg"
                  onClick={handleBack}
                >
                  Back
                </button>
              </div>
            </div>
          )}
          {activeStep === 2 && (
            <ConfirmBooking
              setActiveStep={setActiveStep}
              bookingData={bookingData}
              loading={loading}
            />
          )}
        </div>

        {/* Navigation buttons */}
        {/* <div className="mt-4 flex justify-between">
          <button
            onClick={handleBack}
            disabled={activeStep === 0}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeStep === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeStep === steps.length - 1
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-main-dark text-white hover:bg-green-600"
            }`}
          >
            Next
          </button>
        </div> */}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { TiTick } from "react-icons/ti";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import StripePaymentForm from "./StripePaymentForm";
import { toast } from "react-toastify";
import axios from "axios";
import { BaseUrl } from "../../keys";

const stripePromise = loadStripe(
  import.meta.env.VITE_REACT_APP_STRIPE_PUBLIC_KEY
);

const PaymentDetails = ({ bookingData, setActiveStep, refetchBooking }) => {
  const [name, setName] = useState("");

  const clientSecretKey = bookingData?.clientSecret;
  // Dummy JSON data
  const data = {
    bookingProtection: {
      title: "Booking Protection",
      benefits: [
        "Full Refund Guarantee",
        "Replacement Supplier",
        "Dedicated Event Support",
        "Trusted Suppliers",
        "Secure Payment",
      ],
    },
    priceDetails: {
      totalPrice: bookingData?.sessionAmount,
      finalBalance: bookingData?.sessionAmount,
      description: `The final balance of £${bookingData?.sessionAmount} will be
                held securely and released to your coach after the session is
                successfully completed. Once your booking is confirmed, contact
                details are shared to allow for direct coordination with the
                coach.`,
    },
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between mt-10">
      <div className="w-full lg:w-[40%] p-6 bg-white shadow-2xl rounded-lg">
        <div className="flex items-center justify-between">
          <p className="font font-bold uppercase text-red-700">
            payment details
          </p>
          <p className="text-gray-700">Powered by Stripe</p>
        </div>
        {clientSecretKey && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: clientSecretKey }}
          >
            <PaymentForm
              setActiveStep={setActiveStep}
              bookingData={bookingData}
              refetchBooking={refetchBooking}
            />
          </Elements>
        )}
      </div>
      <div className="max-w-3xl mx-auto">
        {/* Booking Protection Section */}
        <div className="bg-white shadow-2xl rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {data.bookingProtection.title}
          </h2>
          <hr className="mb-4 text-gray-900" />
          <ul className="list-disc pl-5 text-gray-600">
            {data.bookingProtection.benefits.map((benefit, index) => (
              <div className="flex items-center mb-2 gap-2" key={index}>
                <TiTick className="text-green-600 text-xl" />
                <li key={index} className="list-none">
                  {benefit}
                </li>
              </div>
            ))}
          </ul>
        </div>

        {/* Price Details Section */}
        <div className="bg-white shadow-2xl rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Price Details
          </h2>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700">
              Total Price
            </span>
            <span className="text-lg font-bold text-gray-900">
              £ {data.priceDetails.totalPrice}
            </span>
          </div>
          <p className="text-gray-800">{data.priceDetails.description}</p>
        </div>
      </div>
    </div>
  );
};

const PaymentForm = ({ setActiveStep, bookingData, refetchBooking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe has not been initialized. Please try again.");
      return;
    }

    setIsPaying(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: "if_required",
      });

      // Handle Stripe payment errors
      if (error) {
        console.error("Payment Error:", error.message || error);
        toast.error(error.message || "Payment failed. Please try again later.");
        return;
      }

      // Check for successful paymentIntent
      if (paymentIntent?.status === "requires_capture") {
        try {
          const response = await axios.post(
            `${BaseUrl}/bookings/confirmBooking`,
            { bookingId: bookingData._id, paymentStatus: paymentIntent.status }
          );

          if (response.data.success) {
            toast.success("Payment successful and booking confirmed!");
            refetchBooking();
            setActiveStep(2);
          } else {
            console.error("Booking Confirmation Error:", response.data.error);
            toast.error(
              response.data.message ||
                "Booking confirmation failed. Please contact support."
            );
          }
        } catch (axiosError) {
          console.error(
            "API Error while confirming booking:",
            axiosError.response?.data || axiosError
          );
          toast.error(
            "An error occurred while confirming the booking. Please try again."
          );
        }
      } else {
        console.warn(
          "Unexpected Payment Intent Status:",
          paymentIntent?.status
        );
        toast.error(
          "Payment was not completed successfully. Please try again."
        );
      }
    } catch (error) {
      console.error("Unexpected Payment Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement />
      <div className="border-t border-gray-300"></div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold">Total Price</span>
        <span className="text-sm font-bold">
          £ {bookingData?.sessionAmount}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300"></div>

      <button
        className={`w-full bg-blue-500 text-white font-bold py-2 rounded-lg flex justify-center items-center ${
          isPaying ? "cursor-not-allowed opacity-75" : "hover:bg-blue-600"
        }`}
        onClick={handlePayment}
        disabled={isPaying}
      >
        {isPaying ? "Loading..." : "Pay Now"}
      </button>
    </div>
  );
};
export default PaymentDetails;

import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import BookingConfirmation from "./BookComfirm";
import { loadStripe } from "@stripe/stripe-js";

const PaymentForm = ({ selectedDate, selectedTime, coachDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(coachDetails);
  }, [coachDetails]);
  
const makePayment = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) {
    return;
  }

  const body = coachDetails.map((coach) => ({
    name: coach.name,
    session: coach.session,
    location: coach.location,
    price: coach.price,
  }));

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch("http://localhost:3000/api/create-checkout-session", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    const session = await response.json();
    console.log(session);

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  } catch (error) {
    console.error("Error creating checkout session:", error);
  }
};


  return (
    <div className="w-full">
      <form onSubmit={makePayment} className="w-full max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg my-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment Form</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main-darker"
            placeholder="Cardholder Name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="country">
            Country
          </label>
          <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-main-darker"
            placeholder="Country"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Card Details</label>
          <CardElement className="p-4 border rounded-lg" />
        </div>

        <button
          type="submit"
          disabled={!stripe}
          className="w-full py-2 px-4 bg-main-darker text-white rounded-lg hover:bg-main-dark focus:outline-none focus:ring-2 focus:ring-main-darker"
        >
          Pay
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;

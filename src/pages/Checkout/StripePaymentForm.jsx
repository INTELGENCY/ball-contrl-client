import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const StripePaymentForm = ({ coachDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(coachDetails);
  }, [coachDetails]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js has not loaded yet
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setPaymentStatus(`Error: ${error.message}`);
    } else {
      setPaymentStatus(
        `Payment Successful! PaymentMethod ID: ${paymentMethod.id}`
      );
      console.log("Payment Method:", paymentMethod);
      // Here, you can send the paymentMethod.id to your server to complete the payment
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg mx-auto bg-white p-6 shadow-2xl rounded-lg my-6"
      >
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

export default StripePaymentForm;

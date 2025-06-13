import axios from "axios";
import { BaseUrl } from "../keys";

export const getOneBooking = async (id) => {
  try {
    const response = await axios.get(`${BaseUrl}/bookings/getOneBooking/${id}`);
    return response.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};

export const deleteOneBooking = async (id) => {
  try {
    const response = await axios.delete(`${BaseUrl}/bookings/deleteOne/${id}`);
    return response.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};

export const createPaymentIntent = async (bookingId) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/payments/create-payment-intent`,
      {
        bookingId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};

export const getOneByPlayerAndSessionIds = async (playerId, sessionId) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/bookings/getOneBookingByPlayerAndUserId`,
      {
        playerId,
        sessionId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};
export const cancelBookings = async (formData) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/bookings/cancelBooking`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};

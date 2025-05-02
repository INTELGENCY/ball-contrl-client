import axios from "axios";
import { BaseUrl } from "../keys";
export const getDashBoardStats = async (id) => {
  try {
    const response = await axios.post(`${BaseUrl}/coach/getDashboardStats`, {
      coachId: id,
    });
    return response.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};
export const getBookings = async (formData) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/coach/getBookings`,
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

export const changeSessionStatus = async (bookingId, sessionStatus) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/bookings/updateSessionStatus`,
      {
        bookingId,
        sessionStatus,
      },
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

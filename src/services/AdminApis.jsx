import axios from "axios";
import { BaseUrl } from "../keys";
export const getDashBoardStats = async (id) => {
  try {
    const response = await axios.get(`${BaseUrl}/admin/getDashboardData`, {});
    return response.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};
export const getDashUserStats = async (id) => {
  try {
    const response = await axios.get(`${BaseUrl}/admin/getAdminUserStats`, {});
    return response.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};
export const getBookings = async (formData) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/bookings/getBookings`,
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

export const releasePayment = async (bookingId) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/payments/capture-payment`,
      {
        bookingId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.log("this is error", error);
    throw error;
  }
};

export const getAllPlayers = async () => {
  try {
    const response = await axios.get(
      `${BaseUrl}/admin/getAllPlayers`,

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
export const getAllCoaches = async () => {
  try {
    const response = await axios.get(
      `${BaseUrl}/admin/getAllCoaches`,

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

export const deletePlayer = async (id) => {
  try {
     const response = await axios.delete(
      `${BaseUrl}/admin/deletePlayer/${id}`,

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

}
export const deleteCoach = async (id) => {
  try {
     const response = await axios.delete(
      `${BaseUrl}/admin/deleteCoach/${id}`,

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

}
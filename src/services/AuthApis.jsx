import axios from "axios";
import toast from "react-hot-toast";

export const sendResetPasswordEmail = async (email, role) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/forgotPassword?role=${role}`,
      { email },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Error while sending otp";
    toast.error(errorMessage);
    console.log("This is the error:", error);
    throw error;
  }
};
export const verifyOtp = async (otp, email, role) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/verifyOtp?role=${role}`,
      {
        otp,
        email,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Error while sending otp";
    toast.error(errorMessage);
    console.log("This is the error:", error);
    throw error;
  }
};
export const updatePassword = async (
  email,
  newPassword,
  confirmNewPassword,
  role
) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/changePassword?role=${role}`,
      {
        email,
        newPassword,
        confirmNewPassword,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Error while sending otp";
    toast.error(errorMessage);
    console.log("This is the error:", error);
  }
};

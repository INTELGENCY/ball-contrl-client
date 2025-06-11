import React from "react";
import Header from "../../Components/AdminDashboard/Header/Header";
import BarChart from "../../Components/AdminDashboard/BarChart/BarChart";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboardLayout from "../../layouts/AdminDashboardLayout";
import AdminDash from "./Dashboard/AdminDash";
import AllBookings from "./Dashboard/ActiveBooking";
import { PastBookings } from "./Dashboard/PastBooking";
import Sessions from "./Dashboard/Sessions";
import MyProfile from "../../Components/AdminDashboard/MyProfile/MyProfile";
import NewLetterSubscribers from "./Dashboard/NewLetterSubscribers";
import Blogs from "./Dashboard/Blogs";
import { ToastContainer } from "react-toastify";
import ChatbotFaqs from "./Dashboard/ChatbotFaqs";
const AdminDashboard = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        <Route path="/" element={<Navigate to="/admin/home" replace />} />
        <Route path="/" element={<AdminDashboardLayout />}>
          <Route path="home" element={<AdminDash />} />
          <Route path="active-booking" element={<AllBookings />} />
          <Route path="past-booking" element={<PastBookings />} />
          <Route path="sessions" element={<Sessions />} />
          <Route
            path="newsletter-subscribers"
            element={<NewLetterSubscribers />}
          />
          <Route path="blogs" element={<Blogs />} />
          <Route path="chatbot-faqs" element={<ChatbotFaqs />} />
          <Route path="admin-profile" element={<MyProfile />} />
        </Route>
      </Routes>
    </>
  );
};

export default AdminDashboard;

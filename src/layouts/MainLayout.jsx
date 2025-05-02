import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Headers/Header";
import Footer from "../Components/Footer/Footer";
import { ToastContainer } from "react-toastify";

const MainLayout = () => (
  <>
    <Header />
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
    <div className="main-content">
      <Outlet />
    </div>
    <Footer />
  </>
);

export default MainLayout;

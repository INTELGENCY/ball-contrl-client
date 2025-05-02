import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CoachDash from "./Dashboard/CoachDash";
import TopBar from "./Dashboard/TopBar";
import SideBar from "./sidebar";

import { useSelector } from "react-redux";
import Profile from "../../Components/Profile/Profile";

import { PastBookings } from "./AllSessions/Sessions";
import ChatPage from "./chat";
import { ToastContainer } from "react-toastify";
import StripeWallet from "./wallet";
import AllBookings from "./AllBookings/Booking";

const CoachDashBoard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h- flex flex-col md:flex-row w-full p-4 md:gap-0 gap-4">
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
      <div className="md:w-[20%] w-full  ">
        <SideBar />
      </div>
      <div className="md:w-[82%] w-full md:px-10">
        <TopBar />
        {tab === "home" && <CoachDash />}
        {tab === "bookings" && <AllBookings user={currentUser} />}
        {tab === "pastbookings" && <PastBookings user={currentUser} />}
        {tab === "chatbox" && <ChatPage />}
        {tab === "wallet" && <StripeWallet />}
        {tab === "profile" && <Profile />}
      </div>
    </div>
  );
};

export default CoachDashBoard;

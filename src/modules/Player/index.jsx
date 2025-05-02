import React, { useEffect, useState } from "react";
import PlayerSideBar from "./sidebar";

import PlayerDash from "./Dashbaord/PlayerDash";

import { useLocation } from "react-router-dom";
import PlayerProfile from "./Dashbaord/AddProfile/PlayerProfile";
import TopBar from "./Dashbaord/TopBar";
import { useSelector } from "react-redux";
import { AllBookings } from "./Dashbaord/ActiveBooking";
import { PastBookings } from "./Dashbaord/PastBookings";
import ChatWindow from "../../Components/chat/ChatWindow";
import ChatPage from "./chat";

const PlayerDashBoard = () => {
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
      <div className="md:w-[20%] w-full  rounded-lg">
        <PlayerSideBar />
      </div>
      <div className="md:w-[80%] w-full md:px-10 ">
        <TopBar />
        {tab === "dashboard" && <PlayerDash />}
        {tab === "newbookings" && <AllBookings user={currentUser} />}
        {tab === "pastbookings" && <PastBookings user={currentUser} />}
        {tab === "chatbox" && <ChatPage />}
        {tab === "profile" && <PlayerProfile />}
      </div>
    </div>
  );
};

export default PlayerDashBoard;

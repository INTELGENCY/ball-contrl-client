import React, { useEffect, useState } from "react";
import PlayerSideBar from "./sidebar";
import ActiveBooking from "./Dashbaord/ActiveBooking";
import { useLocation } from "react-router-dom";
import PlayerProfile from "./Dashbaord/AddProfile/PlayerProfile";
import TopBar from "./Dashbaord/TopBar";
import PastSessions from "./Dashbaord/Recentsessions";
import ParentDash from "./Dashbaord/ParentDash";

const ParentDashBoard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

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
        {tab === "dashboard" && <ParentDash/>}
        {tab === "newbookings" && <ActiveBooking />}
        {tab === "pastbookings" && <PastSessions />}
        {tab === "profile" && <PlayerProfile />}
      </div>
    </div>
  );
};

export default ParentDashBoard;

import React, { useEffect, useState } from "react";
import { FaChartBar, FaShoppingBag, FaInbox, FaUserCircle, FaCog, FaPowerOff } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";

const PlayerSideBar = () => {
  const [showNav, setShowNav] = useState(false);
  const [tab, setTab] = useState("");
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleToggle = () => {
    setShowNav((prev) => !prev);
  };

  const menuItems = [
    { tab: "dashboard", icon: FaChartBar, label: "Dashboard" },
    { tab: "newbookings", icon: FaShoppingBag, label: "New Bookings" },
    { tab: "pastbookings", icon: FaInbox, label: "Past Bookings" },
    // { tab: "sessions", icon: FaUserCircle, label: "Sessions" },
    { tab: "profile", icon: FaCog, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden flex justify-between items-center p-4 border-b">
        <h5 className="text-lg font-bold text-blue-gray-900">Player</h5>
        <div className="cursor-pointer" onClick={handleToggle}>
          <IoMdMenu className="text-black text-xl" />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 transform md:transform-none transition-transform duration-300 ease-in-out ${
          showNav ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:fixed md:h-[calc(100vh-2rem)] w-72 p-4 bg-white shadow-xl border md:block xl:m-4 rounded-lg`}
      >
        <div className="mb-2 flex justify-between items-center md:hidden">
          <h5 className="text-lg font-bold text-blue-gray-900">Player</h5>
          <div className="cursor-pointer" onClick={handleToggle}>
            <RxCross1 className="text-black text-xl" />
          </div>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.tab}>
              <Link
                to={`?tab=${item.tab}`}
                className={`flex items-center p-2 rounded-md ${tab === item.tab ? "bg-main-dark text-white" : "text-gray-900 hover:bg-gray-100"}`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/" className="flex items-center p-2 rounded-md text-gray-900 hover:bg-gray-100 w-full text-left">
              <FaPowerOff className="h-5 w-5 mr-3" />
             Main Website
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {showNav && <div className="fixed inset-0 z-30 bg-black opacity-50 md:hidden" onClick={handleToggle}></div>}
    </>
  );
};

export default PlayerSideBar;

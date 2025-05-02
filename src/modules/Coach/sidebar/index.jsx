import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaShoppingBag,
  FaInbox,
  FaUserCircle,
  FaCog,
  FaPowerOff,
  FaPoundSign,
} from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { MessageCircle } from "lucide-react";

const SideBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [showNav, setShowNav] = useState(false);

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
    { tab: "home", icon: FaChartBar, label: "Dashboard" },
    { tab: "bookings", icon: FaShoppingBag, label: "Bookings" },
    { tab: "pastbookings", icon: FaInbox, label: "Past Bookings" },
    { tab: "chatbox", icon: MessageCircle, label: "Chat Box" },
    { tab: "wallet", icon: FaPoundSign, label: "Wallet" },
    { tab: "profile", icon: FaCog, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="xl:hidden flex justify-between items-center p-4 border-b">
        <h5 className="text-lg font-bold text-blue-gray-900">Coach</h5>
        <div className="cursor-pointer" onClick={handleToggle}>
          <MdMenu className=" text-xl " />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 transform xl:transform-none transition-transform duration-300 ease-in-out ${
          showNav ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        } xl:fixed xl:h-[calc(100vh-2rem)] w-72 p-4 bg-white shadow-xl border xl:block rounded-lg xl:m-4`}
      >
        <div className="mb-2 flex justify-between items-center xl:hidden">
          <h5 className="text-lg font-bold text-blue-gray-900">Coach</h5>
          <div className="cursor-pointer" onClick={handleToggle}>
            <RxCross1 className="text-black text-xl" />
          </div>
        </div>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.tab}>
              <Link
                to={`?tab=${item.tab}`}
                className={`flex items-center p-2 rounded-xl ${
                  tab === item.tab
                    ? "bg-main-dark text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/"
              className="flex items-center p-2 rounded-xl text-gray-900 hover:bg-gray-100 w-full text-left"
            >
              <FaPowerOff className="h-5 w-5 mr-3" />
              Main Website
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {showNav && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 xl:hidden"
          onClick={handleToggle}
        ></div>
      )}
    </>
  );
};

export default SideBar;

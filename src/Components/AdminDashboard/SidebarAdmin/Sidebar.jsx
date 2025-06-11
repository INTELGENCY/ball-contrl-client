import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaClipboardList,
  FaHistory,
  FaCalendarAlt,
  FaUserCircle,
  FaEnvelope,
} from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { SiWebauthn } from "react-icons/si";
import { ShieldQuestion } from "lucide-react";

const SideBarAdmin = ({ activeTab, setActiveTab }) => {
  // receive props

  const [showNav, setShowNav] = useState(false);

  const handleToggle = () => {
    setShowNav((prev) => !prev);
  };

  const menuItems = [
    { tab: "home", icon: FaTachometerAlt, label: "Dashboard" },
    { tab: "active-booking", icon: FaClipboardList, label: "Active Booking" },
    { tab: "past-booking", icon: FaHistory, label: "Past Booking" },
    // { tab: "sessions", icon: FaCalendarAlt, label: "Sessions" },
    {
      tab: "newsletter-subscribers",
      icon: FaEnvelope,
      label: "NewsLetter",
    },
    {
      tab: "blogs",
      icon: FaEnvelope,
      label: "Blogs",
    },
    {
      tab: "chatbot-faqs",
      icon: ShieldQuestion,
      label: "Chatbot Faq",
    },
    { tab: "admin-profile", icon: FaUserCircle, label: "Admin Profile" },
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

      {/* SidebarAdmin */}
      <div
        className={`fixed inset-0 z-40 transform xl:transform-none transition-transform duration-300 ease-in-out ${
          showNav ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
        } 2xl:fixed xl:h-[calc(100vh-2rem)] w-72 xl:w-60 p-4 bg-white shadow-xl border 2xl:block rounded-lg xl:m-4`}
      >
        <div className="mb-2 flex justify-between items-center xl:hidden">
          <h5 className="text-lg font-bold text-blue-gray-900">Coach</h5>
          <div className="cursor-pointer" onClick={handleToggle}>
            <RxCross1 className="text-black text-xl" />
          </div>
        </div>
        <ul className="space-y-2">
          <li>
            <Link
              to={`${"/"}`}
              className={`flex items-center p-2 py-4 rounded-xl ${"text-gray-900 hover:bg-gray-100"}`}
            >
              <SiWebauthn className="h-5 w-5 mr-3" />
              Main Website
            </Link>
          </li>
          {menuItems.map((item) => (
            <li key={item.tab}>
              <Link
                to={`${item.tab}`}
                className={`flex items-center p-2 py-4 rounded-xl ${
                  activeTab === item.tab
                    ? "bg-main-dark text-white"
                    : "text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(item.tab)} // Set the active tab on click
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for Mobile SidebarAdmin */}
      {showNav && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 2xl:hidden"
          onClick={handleToggle}
        ></div>
      )}
    </>
  );
};

export default SideBarAdmin;

import TopbarAdmin from "../Components/AdminDashboard/TopbarAdmin/TopbarAdmin";
import SideBarAdmin from "../Components/AdminDashboard/SidebarAdmin/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../Components/AdminDashboard/Header/Header";
import { useState, useEffect } from "react";

const AdminDashboardLayout = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "home"
  );

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div className="">
      <div className="flex">
        <div className="w-[20%]">
          <SideBarAdmin activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="w-[70%]">
          <TopbarAdmin setActiveTab={setActiveTab} />

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

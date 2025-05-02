import React, { useEffect, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import { getDashBoardStats } from "../../../services/PlayerApis";
import DashboardGraphs from "./StatsGraphs";
import { ClipLoader } from "react-spinners";

const PlayerDash = () => {
  const [dashStats, setDashStats] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await getDashBoardStats(currentUser._id);
        setDashStats(response);
        setLoading(false);
      } catch (error) {
        console.log("this is error" + error);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [currentUser]);

  if (loading)
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />;
      </div>
    );
  return (
    <>
      {/* <TopBar /> */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Active bookings
              </h3>
              <p className="text-2xl">{dashStats?.activeBookings}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Booking</h3>
              <p className="text-2xl">{dashStats?.totalBookings}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Last Month Booking
              </h3>
              <p className="text-2xl">{dashStats?.lastMonthBookings}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Completed Sessions
              </h3>
              <p className="text-2xl">{dashStats?.pastBookings}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
        </div>
      </div>

      <DashboardGraphs />
    </>
  );
};

export default PlayerDash;

import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaCalendarCheck,
  FaRunning,
  FaStar,
  FaUsers,
  FaPoundSign,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { getDashBoardStats } from "../../../services/CoachApi";
import StatsFunnel from "./StatsFunnel";
import { ClipLoader } from "react-spinners";

const CoachDash = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const data = [
    {
      title: "Total Revenue",
      value: `£ ${stats.totalRevenue}`,
      icon: <FaPoundSign className="text-green-500 text-4xl" />,
      bgColor: "bg-green-100",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings,
      icon: <FaCalendarCheck className="text-blue-500 text-4xl" />,
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Sessions",
      value: stats?.activeSessions,
      icon: <FaRunning className="text-yellow-500 text-4xl" />,
      bgColor: "bg-yellow-100",
    },
    {
      title: "Total Reviews",
      value: stats?.totalReviews,
      icon: <FaUsers className="text-purple-500 text-4xl" />,
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Rating",
      value: Number(stats?.rating).toFixed(1),
      icon: <FaStar className="text-orange-500 text-4xl" />,
      bgColor: "bg-orange-100",
    },
  ];

  const fetchDashboardStatus = async (id) => {
    try {
      setLoading(true);
      const response = await getDashBoardStats(id);
      setStats(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStatus(currentUser._id);
  }, [currentUser]);

  if (loading)
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />;
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex items-center p-6 rounded-2xl shadow-md ${item.bgColor}`}
          >
            <div className="mr-4">{item.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <StatsFunnel data={stats} />
    </div>
  );
};

export default CoachDash;

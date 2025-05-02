import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashBoardStats } from "../../../services/PlayerApis";
import { useSelector } from "react-redux";

const DashboardGraphs = () => {
  const [data, setData] = useState(null);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [timeframe, setTimeframe] = useState("monthly"); // Default to monthly
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (data) {
      filterData();
    }
  }, [data, timeframe]);

  const fetchStats = async () => {
    try {
      const response = await getDashBoardStats(currentUser._id);
      setData(response);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  const filterData = () => {
    setFilteredBookings(data.bookingTrends[timeframe] || []);
    setFilteredSessions(data.sessionTrends[timeframe] || []);
  };

  return (
    <div className=" w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header & Filter */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Dashboard Trends</h2>
        <select
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Booking Trends Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Booking Trends ({timeframe})
        </h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalBookings"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Session Trends Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Completed Sessions Trends ({timeframe})
        </h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredSessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completedSessions"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardGraphs;

import React, { useState } from "react";
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

const StatsFunnel = ({ data }) => {
  const salesFunnel = data?.salesFunnel;

  const [timeframe, setTimeframe] = useState("weekly");

  // Map data based on selected timeframe
  const getChartData = () => {
    let xData = [];
    let yData = [];

    if (timeframe === "weekly" && salesFunnel?.weekly) {
      xData = salesFunnel?.weekly.map((item) => `${item.day}`);
      yData = salesFunnel?.weekly.map((item) => item.totalRevenue);
    } else if (timeframe === "monthly" && salesFunnel?.monthly) {
      xData = salesFunnel?.monthly.map((item) => `${item.month}`);
      yData = salesFunnel?.monthly.map((item) => item.totalRevenue);
    } else if (timeframe === "yearly" && salesFunnel?.yearly) {
      xData = salesFunnel?.yearly.map((item) => `Year ${item.year}`);
      yData = salesFunnel?.yearly.map((item) => item.totalRevenue);
    }

    return {
      xData: xData.length ? xData : ["No data"],
      yData: yData.length ? yData : [0],
    };
  };

  const chartData = getChartData();

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-700">Sales Funnel</h2>
        <div className="w-40">
          <label
            htmlFor="timeframe-select"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Select Time
          </label>
          <select
            id="timeframe-select"
            className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData.xData.map((x, index) => ({
            name: x,
            revenue: chartData.yData[index],
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" stroke="#4a5568" />
          <YAxis stroke="#4a5568" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f9fafb",
              border: "1px solid #e2e8f0",
            }}
          />
          <Legend wrapperStyle={{ color: "#4a5568" }} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4f46e5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsFunnel;

// BarChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
    ],
    datasets: [
      {
        label: "Actual",
        data: [200, 180, 250, 140, 270, 130, 240, 160, 180, 220, 200],
        backgroundColor: "rgba(75, 192, 192, 0.7)", 
      },
      {
        label: "Projections",
        data: [250, 240, 300, 180, 320, 200, 270, 200, 210, 290, 240],
        backgroundColor: "rgba(201, 203, 207, 0.7)", 
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#666",
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Session Progress",   

      },
    },
    scales: {
      y: {
        min: 50,
        max: 450,
        ticks: {
          stepSize: 50,
          color: "#666",
        },
      },
      x: {
        ticks: {
          color: "#666",
        },
      },
    },
  };

  return (
    <div className="mt-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;

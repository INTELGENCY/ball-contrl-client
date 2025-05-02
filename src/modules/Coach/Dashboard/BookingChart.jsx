import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BookingChart = ({ data }) => {
  const currentAndUpcomingBookings = data.filter(
    (booking) => new Date(booking.endDate) >= new Date()
  );

  const chartData = {
    labels: currentAndUpcomingBookings.map((d) => d.session),
    datasets: [
      {
        label: 'Current and Upcoming Bookings',
        data: currentAndUpcomingBookings.map((d) =>
          parseFloat(d.amount.replace('$', ''))
        ),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Current and Upcoming Bookings',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const booking = data[context.dataIndex];
            return `${context.dataset.label}: $${context.raw} (Session: ${booking.session}, Address: ${booking.address})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Sessions',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default BookingChart;

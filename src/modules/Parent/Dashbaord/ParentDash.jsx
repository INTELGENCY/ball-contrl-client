import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import { HiArrowNarrowUp, HiOutlineUserGroup } from "react-icons/hi";
import ActiveBooking from "./ActiveBooking";
import BookingTrendChart from "./Charts/BookingTrend";
import SessionCompletionChart from "./Charts/Sessions";
import { useSelector } from "react-redux";

const ParentDash = () => {
  const [fetchDetails, setFetchDetails] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [lastMonthBookings, setLastMonthBookings] = useState(0);
  const [monthlyBookings, setMonthlyBookings] = useState({});
  const [completedSessionsPerMonth, setCompletedSessionsPerMonth] = useState({});
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getSessionDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/bookedsession/getdata`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const filteredData = data.filter((item) => item.playerId === currentUser._id);

          // Separate completed and active sessions
          const now = new Date();
          const activeSessions = filteredData.filter((item) => new Date(item.endDate) >= now);
          const completedSessions = filteredData.filter((item) => new Date(item.endDate) < now);

          // Update states
          setActiveBookings(activeSessions);
          setCompletedSessions(completedSessions);
          setTotalBookings(filteredData.length);

          // Calculate last month bookings
          const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          const lastMonthBookingsCount = filteredData.filter((item) => {
            const bookingDate = new Date(item.startDate); // Adjust this if needed
            return bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth;
          }).length;
          setLastMonthBookings(lastMonthBookingsCount);

          // Calculate monthly bookings
          const monthlyCounts = filteredData.reduce((acc, session) => {
            const month = new Date(session.startDate).toLocaleString("default", { month: "long" });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {});
          setMonthlyBookings(monthlyCounts);

          // Calculate completed sessions per month
          const completedMonthCounts = completedSessions.reduce((acc, session) => {
            const month = new Date(session.endDate).toLocaleString("default", { month: "long" });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {});
          setCompletedSessionsPerMonth(completedMonthCounts);
        } else {
          console.error("Failed to fetch session details. Status:", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSessionDetails();
  }, [currentUser]);

  return (
    <>
      {/* <TopBar /> */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Active bookings</h3>
              <p className="text-2xl">{activeBookings.length}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {Math.round((lastMonthBookings / totalBookings) * 100) || 0}%
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Booking</h3>
              <p className="text-2xl">{totalBookings}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <p className="flex items-center gap-2">
              <span className="text-green-500">{totalBookings}</span>
              <span>Sessions</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Last Month Booking</h3>
              <p className="text-2xl">{lastMonthBookings}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {Math.round((lastMonthBookings / totalBookings) * 100) || 0}%
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Completed Sessions</h3>
              <p className="text-2xl">{completedSessions.length}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {Math.round((completedSessions.length / totalBookings) * 100) || 0}%
            </span>
            <div className="text-gray-500">Total</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
        <Card className="shadow-lg rounded-lg">
          <CardHeader className="bg-teal-600 text-white rounded-t-lg p-4">
            <Typography variant="h5" className="text-white">
              Booking Trends
            </Typography>
          </CardHeader>
          <CardBody>
            <BookingTrendChart data={monthlyBookings} />
          </CardBody>
        </Card>

        <Card className="shadow-lg rounded-lg">
          <CardHeader className="bg-purple-600 text-white rounded-t-lg p-4">
            <Typography variant="h5" className="text-white">
              Session Completion
            </Typography>
          </CardHeader>
          <CardBody>
            <SessionCompletionChart data={completedSessionsPerMonth} />
          </CardBody>
        </Card>
      </div>

      <ActiveBooking activeBookings={activeBookings} />
    </>
  );
};

export default ParentDash;

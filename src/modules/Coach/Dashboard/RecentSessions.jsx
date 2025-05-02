import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { Chart } from "react-chartjs-2";
import "chart.js/auto"; // This line is needed to register the controllers
import { useSelector } from "react-redux";

const RecentSessions = () => {
  const [fetchDetails, setFetchDetails] = useState([]);
  const [showAll, setShowAll] = useState(false);
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

          const currentDate = new Date();

          // Filter sessions ending within the last 15 days
          const filteredData = data.filter((item) => {
            const endDate = new Date(item.endDate);
            const daysDifference = Math.floor((currentDate - endDate) / (1000 * 60 * 60 * 24));
            return item.coachId === currentUser._id && endDate < currentDate && daysDifference <= 15;
          });

          setFetchDetails(filteredData);

          // Count sessions per month
          const sessionsPerMonth = Array(12).fill(0);
          data.forEach((item) => {
            const sessionMonth = new Date(item.startDate).getMonth();
            sessionsPerMonth[sessionMonth]++;
          });

          setChartData({
            labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            datasets: [
              {
                label: "Sessions",
                data: sessionsPerMonth,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          console.error("Failed to fetch session details. Status:", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSessionDetails();
  }, [currentUser]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const sessionsToShow = showAll ? fetchDetails : fetchDetails.slice(0, 4);

  return (
    <div className="w-full px-2 py-4">
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        <div className="lg:w-1/2 w-full bg-white p-6 rounded-lg shadow-md mb-4 lg:mb-0">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <p className="text-xl font-bold">Recent Sessions</p>
            {fetchDetails.length > 0 && (
              <p className="text-blue-500 hover:underline cursor-pointer" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show less" : "View all"}
              </p>
            )}
          </div>
          <div className="overflow-x-auto">
            {fetchDetails.length === 0 ? (
              <p className="text-center text-gray-500">No recent bookings.</p>
            ) : (
              <table className="min-w-full text-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="py-3 px-4 text-left">Session</th>
                    <th className="py-3 px-4 text-left">Location</th>
                    <th className="py-3 px-4 text-center">Ratings</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionsToShow.map((session, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50 border-t" : "border-t"}>
                      <td className="py-2 px-4 flex items-center gap-2">
                        <div className="flex items-center">
                          <img src={session.sessionImage} alt="session Avatar" className="object-fit rounded-full w-12 h-12" />
                          <span className="ml-2">{session.sessionName}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 capitalize">{session.location}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FaStar key={i} className={i < 4 ? "text-yellow-500" : "text-gray-300"} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="lg:w-1/2 w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Sessions Chart</h2>
          <div className="h-64 lg:h-90">
            {fetchDetails.length === 0 ? <p className="text-center text-gray-500">No data available for the chart.</p> : <Chart type="bar" data={chartData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentSessions;

import React, { useEffect, useState } from "react";
import { coachesCardData } from "../../data/data.js";
import Card from "../../Components/Coaches/CoachCard";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper.jsx";
import coachesbg from "../../assets/images/coaches-bg.jpg";
import "./Coaches.css";
import { ClipLoader } from "react-spinners";

const CoachesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [allCoaches, setAllCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(allCoaches);

  // Filter coaches based on search term
  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
  };

  const filteredCoaches = allCoaches.filter(
    (coach) =>
      coach?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach?.agegroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach?.address_line_1?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/coach/getcoaches`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAllCoaches(data);
        } else {
          console.error("Failed to fetch coaches");
        }
      } catch (error) {
        console.error("Error fetching coaches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="relative w-full flex items-center justify-center">
        <img
          src={coachesbg}
          alt="headerimage"
          className="md:h-[600px] w-full h-[280px] object-cover"
        />
        <p className="absolute text-white md:text-mianheading font-bold text-[25px]">
          Coaches
        </p>
      </div>
      <div className="w-[85%] mx-auto items-center mt-[3rem] justify-center">
        <h1 className="text-[22px] text-center pb-10 lg:pb-2 lg:text-mianheading">
          Our Best Football Coaches
        </h1>

        {/* Search bar */}
        <div className="w-full md:w-3/5 mx-auto mb-6">
          <input
            type="text"
            placeholder="Search Coaches..."
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-main-dark"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Coaches cards */}
        <div className="">
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader color="#FF6AB9" />
            </div>
          ) : filteredCoaches.length === 0 ? (
            <div className=" flex justify-center items-center">
              <p className="text-gray-500 text-xl">No coaches found</p>
            </div>
          ) : (
            <div className="coaches-card">
              {filteredCoaches.map((cardData, _id) => (
                <Card key={_id} cardData={cardData} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CoachesPage;

import React, { useEffect, useState } from "react";
import SectionWrapper from "../Wrapper/SectionWrapper";
import Card from "../Coaches/CoachCard";
import { coachesCardData } from "../../data/data";
import { useNavigate } from "react-router-dom";

const Coaches = () => {
  const [allDetails, setAllDetails] = useState([]);
  const navigate = useNavigate();
  const handleDirect = () => {
    navigate("/coaches");
  };
  useEffect(() => {
    const fetchData = async () => {
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
        setAllDetails(data);
      }
    };
    fetchData();
  }, []);

  return (
    <SectionWrapper
      justifyContent={"center"}
      alignItems={"center"}
      direction={"col"}
      gap={"3rem"}
      margin={"mt-[2rem] lg:mt-[6rem]"}
      width={"95%"}
    >
      <p className="text-main-dark pb-4 text-[48px]">Find A Coach Today</p>

      <div className="flex justify-center items-center flex-wrap gap-4">
        {allDetails.slice(0, 4).map((cardData, index) => (
          <Card key={index} cardData={cardData} />
        ))}
      </div>
      <div className="text-center">
        <button
          className="w-full mt-10 bg-main-dark hover:bg-main-accent text-white text-xl py-2 px-16 rounded-lg"
          onClick={handleDirect}
        >
          Find a Coach
        </button>
      </div>
    </SectionWrapper>
  );
};

export default Coaches;

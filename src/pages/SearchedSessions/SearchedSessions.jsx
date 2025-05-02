import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./SearchSession.css";
import { SyncLoader } from "react-spinners";

const SearchedSessions = () => {
  const location = useLocation();
  const selectedData = location.state?.Data || [];
  console.log("location", selectedData);

  // Initialize loading state to true for each image
  const [loading, setLoading] = useState(selectedData.map(() => true));

  const handleFindCoach = async (id) => {
    try {
      console.log(id);
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/coach/getcoachbysessionid/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("success");
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Failed to fetch coach:", response.statusText);
      }
    } catch (error) {
      console.error("error finding the coach", error);
    }
  };

  const handleImageLoad = (index) => {
    setLoading((prevLoading) => {
      const newLoading = [...prevLoading];
      newLoading[index] = false;
      return newLoading;
    });
  };

  console.log(
    "coachid",
    selectedData.map((data) => data.coachId)
  );

  return (
    <div className="w-[100%] mt-[4rem] mb-[4rem] pt-2 mx-auto">
      <div className="text-3xl pl-[70px] uppercase font-semibold">searched sessions</div>
      <div className="xl:w-[93%] mt-[4rem] mx-auto style_searched">
        {selectedData.length === 0 ? (
          <p className="w-[90%] mx-auto text-center text-xl text-gray-500">No searched data available</p>
        ) : (
          selectedData?.map((data, index) => (
            <div key={data._id} className="mx-auto w-[90%] flex flex-col px-4 py-4 mb-6 gap-3 rounded-lg shadow-md border border-main-primary">
              {loading[index] ? (
                <div className="flex justify-center items-center h-[212px]">
                  <SyncLoader color="#FF6AB9" />
                </div>
              ) : (
                <img src={data?.image} width="100%" height={212} alt="data_image" onLoad={() => handleImageLoad(index)} />
              )}
              {loading[index] && (
                <img src={data?.image} width="100%" height={212} alt="data_image" onLoad={() => handleImageLoad(index)} style={{ display: "none" }} />
              )}
              <h1 className="text-[24px] font-semibold">{data?.title}</h1>
              <h1 className="font-regular">Category: {data?.category}</h1>
              <p className="text-[#7D8FA9] text-[14px]">{data?.description}</p>
              <div className="flex justify-between">
                <div className="text-[14px] font-regular">
                  <span className="font-medium uppercase">Location</span> : {data.location}
                </div>
                <div className="text-[14px] font-regular">
                  <span className="font-medium uppercase">AgeGroup</span> : {data.agegroup}
                </div>
              </div>
              <button className="bg-[#FF6AB9] text-white hover:bg-[#f040a6] py-2 rounded-md" onClick={() => handleFindCoach(data._id)}>
                Book Coach
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchedSessions;

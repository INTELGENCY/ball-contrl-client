import React, { useEffect, useState } from "react";
import addsession from "../../assets/images/add-session.png";
import { BiSearch } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import SessionCards from "../../Components/CoachSessionsCards/SessionCards";
import { useSelector } from "react-redux";
import FilteredData from "../../Components/CoachSessionsCards/FIlteredData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ManageSessions = () => {
  const [dataStore, setDataStore] = useState([]);
  const [searched, setSearched] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const checkForSessionPermission = () => {
    if (
      !currentUser.experience ||
      !currentUser.address_line_1 ||
      !currentUser.description
    ) {
      toast.error("First complete your profile");
      navigate("/addprofile");
    } else {
      navigate("/addsession");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}/coach/getsessionbycoachid/${
              currentUser._id
            }`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setDataStore(data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    setSearched(e.target.value.toLowerCase());
  };

  const clearField = () => {
    setSearched("");
  };

  const filteredData = searched
    ? dataStore.filter(
        (store) =>
          store.title.toLowerCase().includes(searched) ||
          store.category.toLowerCase().includes(searched) ||
          store.description.toLowerCase().includes(searched)
      )
    : null;

  return (
    <>
      <div className="flex w-[90%] mx-auto justify-between py-6 ">
        <div>
          <h1 className="text-[40px] font-medium">Manage Sessions</h1>
        </div>

        <button className="w-[19%]" onClick={checkForSessionPermission}>
          <div className="text-[#FD86C8] flex border-[1px] p-2 border-[#FD86C8] rounded gap-3 items-center justify-center">
            <img src={addsession} alt="add-session" />
            <h1>Add new session</h1>
          </div>
        </button>
      </div>

      <div className="w-[90%] flex gap-2 mx-auto">
        <div className="border rounded bg-[#E6E6E6] flex items-center w-[370px]">
          <BiSearch className="ml-3 text-gray-500" />
          <input
            type="text"
            value={searched}
            onChange={handleChange}
            placeholder="Search "
            className="flex-grow p-2 pl-3 rounded focus:outline-none text-black bg-[#E6E6E6]"
          />
        </div>
        <div className="flex relative px-4 items-center rounded">
          <div className="absolute right-5">
            <TiArrowSortedDown />
          </div>
          <select
            name="category"
            value={searched}
            onChange={handleChange}
            className="rounded py-2 px-5 border-2 border-gray-300 custom-select"
            style={{ outline: "none" }}
          >
            <option value="Category">Category</option>
            <option value="1 to 1">1 to 1</option>
            <option value="out field">Out Field</option>
            <option value="football clubs">Football Clubs</option>
            <option value="small group">Small Group</option>
          </select>
        </div>
        <button
          onClick={clearField}
          className="border-2 border-gray-300 px-5 rounded"
        >
          Clear
        </button>
      </div>

      {/* <div className="w-[90%] mx-auto py-3">
        <h1 className="text-[14px]">
          Search Result: {searched ? searched : "Selected category"}
        </h1>
      </div> */}

      {filteredData ? (
        <div>
          <h1>
            <FilteredData formData={filteredData} />
          </h1>
        </div>
      ) : (
        <SessionCards />
      )}
    </>
  );
};

export default ManageSessions;

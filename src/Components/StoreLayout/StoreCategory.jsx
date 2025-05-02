import React, { useEffect, useState } from "react";
import "./Category.css";
import { FcNext, FcPrevious } from "react-icons/fc";
import BreadCrums from "../BreadCrums/BreadCrums.jsx";
import { Link } from "react-router-dom";
import {ClipLoader} from "react-spinners"
import store21 from "../../assets/png/shop30.png"

const ITEMS_PER_PAGE = 16;

const StoreCategory = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sample, setSample] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter data based on category
  const filteredData = sample.filter((item) => item.category === props.category);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/product/getproducts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSample(data);
          console.log("Fetched products:", data);
        } else {
          console.error("Failed to fetch products:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [props.category]);

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const currentData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <div className="bg-[#d3d3d3]  mb-[-40px]">
        {/* ------BreadCrum------- */}
        <BreadCrums category={props.category} />
        <div className="px-1 pb-14 lg:px-14">
          {/* -------------- */}
          {isLoading || currentData <= 0 ? (
            <div className="flex justify-center items-center h-screen">
              <ClipLoader color="#fd86c8" />
            </div>
          ) : (
            <div className="mt-[50px]">
              <div className="mt-[50px]">
                <div className="px-[20px] md:px-[50px] lg:px-[40px] xl:px-0">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentData.map((data) => (
                      <div
                        key={data._id}
                        className="relative bg-[#e9e9e9] w-full md:w-auto lg:w-auto xl:w-auto"
                      >
                        <Link to={`/productdetails/${data._id}`}>
                          <img
                            src={store21}
                            className="h-auto w-full lg:h-[320px] lg:w-[320px] object-cover"
                            alt={data.name}
                          />
                          <div className="py-3 bg-white">
                            <p className="my-[6px] text-center lato-font font-normal text-[#888888] mx-0">
                              NEW BALANCE
                            </p>
                            <p className="my-[6px] text-center lato-font font-normal text-[#888888] mx-0">
                              {data.name}
                            </p>
                            <div className="flex justify-center font-semibold lato-font items-center gap-[20px]">
                              {data.old_price && (
                                <p className="old-price text-[#888888] text-[14px] font-medium line-through">
                                  ${data.old_price}
                                </p>
                              )}
                              <p className="new-price text-black text-[18px] font-bold">
                                ${data.new_price}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {totalPages > 1 && (
                <div className="pagination  flex justify-center pt-14">
                  <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 rounded bg-gray-200"
                  >
                    <FcPrevious />
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1 mx-1 rounded ${
                        currentPage === index + 1
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handleClick(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 mx-1 rounded bg-gray-200"
                  >
                    <FcNext />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoreCategory;

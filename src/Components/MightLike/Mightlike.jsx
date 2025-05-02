import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Might.css";
import shop21 from "../../assets/png/shop23.png"


const Mightlike = ({ category, record }) => {
  const [likeData, setLikeData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/product/getproducts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setLikeData(data);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error occurred in Like Production:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category && likeData.length > 0) {
      const filtered = likeData.filter((like) => like.category === category);
      setFilteredItems(filtered.filter((item) => item._id !== record));
    }
  }, [category, likeData]);

  const handleLoadMore = () => {
    setVisibleItems(filteredItems.length);
  };

  return (
    <>
      <h1 className="text-[21px] lato-font font-semibold w-[88%] mt-[80px] mb-[20px] mx-auto">
        You might also like
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-1 pb-14 lg:px-14">
        {filteredItems.length > 0 ? (
          filteredItems.slice(0, visibleItems).map((data) => (
            <div key={data._id} className="relative">
              {/* <div className="absolute right-2 cursor-pointer top-4 border-[1px] border-black rounded-full w-[8%] items-center">
                <BiPlus color="black" size={25} />
              </div> */}
              <Link to={`/productdetails/${data._id}`}>
                <img
                  onClick={() => window.scrollTo(0, 0)}
                  src={shop21}
                  className="object-cover"
                  alt={data.name}
                />
                <div className="py-3 bg-white">
                  <p className="my-[6px] text-center lato-font font-normal text-[#888888] mx-0">
                    NEW BALANCE
                  </p>
                  <p className="my-[6px] lato-font text-center text-[#888888] mx-0">
                    {data.name}
                  </p>
                  <div className="flex justify-center lato-font items-center gap-[20px]">
                    {data.old_price && (
                      <p className="old-price text-[#888888] text-[14px] font-medium line-through">
                        ${data.old_price}
                      </p>
                    )}
                    <p className="new-price lato-font text-black text-[18px] font-semibold">
                      ${data.new_price}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>

      {filteredItems.length > visibleItems && (
        <div className="flex justify-center mt-4 mb-16">
          <button
            onClick={handleLoadMore}
            className="w-[150px] h-[40px] uppercase bg-[#FD86C8] text-white rounded-md"
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default Mightlike;

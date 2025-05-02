import React, { useState } from "react";
import "./StorePages.css";
import { shoesData } from "../../data/store";
import StoreItem from "../StoreLayout/StoreItem";
import { FcNext, FcPrevious } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../redux/user/cartSlice";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 16;

const Shoes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const currentUser = useSelector((state) => state.user)
  console.log(cart);
  const totalPages = Math.ceil(shoesData.length / ITEMS_PER_PAGE);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const addToCart = (item) => {
    if (!currentUser) {
      toast.error("Kindly Login to your account")
      return
    }
    const itemExists = cart.find((cartItem) => cartItem.id === item.id);
    if (!itemExists) {
      dispatch(addItemToCart(item));
    } else {
      toast.error("Item already in cart");
    }
  };

  const currentData = shoesData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="mt-[50px] mb-[70px]">
      <h1 className="text-[55px] pl-[120px] mb-[50px] font-semibold uppercase text-[#171717]">Shoes</h1>
      <div className="collections">
        {currentData.map((data) => (
          <StoreItem key={data.id} id={data.id} image={data.image} name={data.name} new_price={data.new_price} old_price={data.old_price} add={addToCart} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination flex justify-center mt-14">
          <button onClick={handlePrevious} disabled={currentPage === 1} className="px-3 py-1 mx-1 rounded bg-gray-200">
            <FcPrevious />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? "bg-gray-800 text-white" : "bg-gray-200"}`}
              onClick={() => handleClick(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={handleNext} disabled={currentPage === totalPages} className="px-3 py-1 mx-1 rounded bg-gray-200">
            <FcNext />
          </button>
        </div>
      )}
    </div>
  );
};

export default Shoes;

import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import logo from "../../assets/images/logo.svg";
import { Drawer, IconButton } from "@material-tailwind/react";

const MobileDrawer = ({
  open,
  handleCloseDrawer,
  currentUser,
  menu,
  setMenu,
  search,
  handleInputChange,
  handleKeyPress,
}) => {
  if (!open) return null;

  return (
    <Drawer
      open={open}
      onClose={handleCloseDrawer}
      className="p-6 bg-black text-white"
    >
      <div className="">
        <div className="mb-10 flex items-center justify-between bg-white rounded-lg py-2 px-2">
          <Link onClick={handleCloseDrawer} to={"/"}>
            <img src={logo} alt="" className="w-[100px]" />
          </Link>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={handleCloseDrawer}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>

        <div className="flex flex-col items-start gap-6 py-6 text-white text-lg">
          {/* Search Input in Mobile Drawer */}
          <input
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            type="search"
            placeholder="Search"
            className="rounded-full bg-transparent border border-white px-3 py-2 w-56 text-white"
          />
          {["shirt", "shoes", "pant", "kit", "gloves"].map((item) => (
            <Link
              key={item}
              to={`/${item === "/" ? "" : item}`}
              onClick={() => {
                setMenu(item);
                handleCloseDrawer();
              }}
              className={menu === item ? "text-pink-400" : "text-white"}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default MobileDrawer;

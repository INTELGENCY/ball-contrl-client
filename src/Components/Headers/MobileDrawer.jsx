import React from "react";
import { Drawer, IconButton } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import logo from "../../assets/images/logo.svg";
import UserMenu from "./UserMenu";

const MobileDrawer = ({
  open,
  handleCloseDrawer,
  currentUser,
  showSessionsDropdown,
  setShowSessionsDropdown,
  showAboutContactDropdown,
  setShowAboutContactDropdown,
  handleSignOut,
}) => {
  const dropdownItems = [
    { label: "See All", link: "/session/schedule" },
    { label: "1 to 1", link: "/session/one-to-one" },
    { label: "Out Field", link: "/session/out-field" },
    { label: "Football Clubs", link: "/session/football-clubs" },
    { label: "Small Group", link: "/session/small-group" },
  ];

  const aboutContactItems = [
    { label: "About Us", link: "/about-us" },
    { label: "Contact Us", link: "/contact-us" },
  ];
  return (
    <Drawer
      open={open}
      onClose={handleCloseDrawer}
      className="p-6 bg-black text-white"
    >
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
      <div className="flex flex-col gap-6">
        <div className="relative">
          <button
            onClick={() =>
              setShowAboutContactDropdown(!showAboutContactDropdown)
            }
            className="text-[16px] flex gap-2 items-center w-full justify-between"
          >
            About
            {showAboutContactDropdown ? (
              <BiChevronUp className="text-[10px]" />
            ) : (
              <BiChevronDown className="text-[10px]" />
            )}
          </button>
          {showAboutContactDropdown && (
            <div className="flex flex-col">
              {aboutContactItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="text-[16px] flex items-center justify-between px-3 py-2 duration-200 border-b border-gray-300 transition-all hover:text-main-dark hover:ml-1"
                  onClick={handleCloseDrawer}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {currentUser && currentUser.userType !== "Coach" && (
          <Link
            to="/coaches"
            className="text-[16px] flex gap-2 items-center"
            onClick={handleCloseDrawer}
          >
            Coaches
          </Link>
        )}

        {currentUser && currentUser.userType !== "Coach" && (
          <div className="relative">
            <button
              onClick={() => setShowSessionsDropdown(!showSessionsDropdown)}
              className="text-[16px] flex gap-2 items-center w-full justify-between"
            >
              Sessions
              {showSessionsDropdown ? (
                <BiChevronUp className="text-[10px]" />
              ) : (
                <BiChevronDown className="text-[10px]" />
              )}
            </button>
            {showSessionsDropdown && (
              <div className="flex flex-col">
                {dropdownItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="text-[16px] flex items-center justify-between px-3 py-2 duration-200 border-b border-gray-300 transition-all hover:text-main-dark hover:ml-1"
                    onClick={handleCloseDrawer}
                  >
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <Link
          to="/how-it-works"
          className="text-[16px] flex gap-2 items-center hover:text-main-dark duration-200"
        >
          How it works
        </Link>
        <Link
          to="/blogs"
          className="text-[16px] flex gap-2 items-center"
          onClick={handleCloseDrawer}
        >
          News
        </Link>
        <Link
          to="/store"
          className="text-[16px] flex gap-2 items-center"
          onClick={handleCloseDrawer}
        >
          Store
        </Link>
        <Link
          to="/agency"
          className="text-[16px] flex gap-2 items-center"
          onClick={handleCloseDrawer}
        >
          Agency
        </Link>
        {/* {currentUser ? (
          <UserMenu currentUser={currentUser} handleSignOut={handleSignOut} />
        ) : (
          <Link to="/register" className="bg-main-dark px-4 py-2 rounded text-[16px] text-white hover:bg-main-darker duration-200">
            Sign In
          </Link>
        )} */}
        {currentUser ? (
          <button
            className="text-[16px] flex gap-2 items-center mt-6"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/register"
            className="bg-main-dark text-center py-2 mt-6 mr-6 rounded text-[16px] text-white"
            onClick={handleCloseDrawer}
          >
            Sign Up
          </Link>
        )}
      </div>
    </Drawer>
  );
};

export default MobileDrawer;

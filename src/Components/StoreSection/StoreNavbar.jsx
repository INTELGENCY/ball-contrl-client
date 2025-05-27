import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdMenuOpen } from "react-icons/md";
import MobileDrawer from "./MobileDrawer";
import store_logo from "../../assets/Store/store_logo.svg";
import { signOutSuccess } from "../../redux/user/userSlice";

const defaultAvatar =
  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

const StoreNavbar = () => {
  const [menu, setMenu] = useState("");
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleToggleDrawer = () => setOpen(!open);
  const handleCloseDrawer = () => setOpen(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(signOutSuccess());
    setDropdownOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden lg:flex items-center justify-between bg-black py-4 px-12">
        <Link to="/store" className="flex items-center gap-4">
          <img
            src={store_logo}
            alt="Store Logo"
            className="w-[70px] h-[70px]"
          />
          <div className="text-white">
            <h1 className="text-2xl font-bold tracking-wide">
              Ball Control Store
            </h1>
            <p className="text-sm text-gray-300">
              Empowering Women Through Coaching & Premium Gear
            </p>
          </div>
        </Link>

        {currentUser && (
          <div ref={dropdownRef} className="relative text-white">
            <div
              onClick={toggleDropdown}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src={currentUser.profilePicture || defaultAvatar}
                alt="User"
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-sm">{currentUser.username}</span>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded shadow-lg text-black p-4 z-50">
                <div className="text-sm font-semibold mb-1">
                  {currentUser.username}
                </div>
                <div className="text-xs text-gray-600 mb-3">
                  {currentUser.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-main-dark hover:bg-main-accent text-white text-sm py-1.5 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden flex items-center justify-between bg-black p-4">
        <Link to="/store" className="flex items-center gap-2">
          <img
            src={store_logo}
            alt="Store Logo"
            className="w-[50px] h-[50px]"
          />
          <span className="text-white text-sm font-semibold">Ball Control</span>
        </Link>

        <div className="flex items-center gap-3">
          {currentUser && (
            <div ref={dropdownRef} className="relative">
              <img
                onClick={toggleDropdown}
                src={currentUser.profilePicture || defaultAvatar}
                alt="User"
                className="w-8 h-8 rounded-full border cursor-pointer"
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded shadow-lg text-black p-3 z-50">
                  <div className="text-sm font-semibold mb-1">
                    {currentUser.username}
                  </div>
                  <div className="text-xs text-gray-600 mb-3">
                    {currentUser.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-1.5 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <MdMenuOpen
            size={24}
            className="text-white cursor-pointer"
            onClick={handleToggleDrawer}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={open}
        handleCloseDrawer={handleCloseDrawer}
        currentUser={currentUser}
        menu={menu}
        setMenu={setMenu}
      />
    </>
  );
};

export default StoreNavbar;

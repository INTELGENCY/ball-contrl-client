import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdMenuOpen } from "react-icons/md";
import MobileDrawer from "./MobileDrawer";
import store_logo from "../../assets/Store/store_logo.svg";
import cart_icon from "../../assets/Store/cart_image.png";

const StoreNavbar = () => {
  const [menu, setMenu] = useState("");
  const [open, setOpen] = useState(false);
  const cartItems = useSelector((state) => state.basket.cartItems);
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchBar();
    }
  };

  const handleSearchBar = () => {
    const searchLower = search.toLowerCase();
    if (["shoes", "shirt", "kit", "gloves", "pant"].includes(searchLower)) {
      navigate(`/${searchLower}`);
    } else {
      navigate("/pant");
    }
  };

  const filteredCartItems = currentUser
    ? Object.values(cartItems).filter(
        (item) => item.Customer_id === currentUser._id
      )
    : [];

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        {/* Navbar for Desktop */}
        <div className="hidden lg:flex items-center content-center lato-font bg-black justify-between py-[14p] px-12">
          <div>
            <Link to="/">
              <img
                src={store_logo}
                alt="Store Logo"
                className="w-[70px] h-[70px]"
              />
            </Link>
          </div>
          {/* <ul className="flex gap-[50px] justify-center font-medium uppercase items-center">
            {["shirt", "shoes", "pant", "kit", "gloves", "/"].map((item) => (
              <li
                key={item}
                className={menu === item ? "text-[#FD86C8]" : "text-white"}
                onClick={() => setMenu(item)}
              >
                <Link to={`/${item === "/" ? "" : item}`}>
                  {item === "/"
                    ? "Main Website"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
                  {menu === item ? (
                    <hr className="border-none h-[3px] rounded-[10px] bg-[#020621]" />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul> */}
          <div>
            <div className="flex gap-[20px] items-center">
              {/* <Link to="/basket">
                <img
                  src={cart_icon}
                  className="w-[24px] h-[20px]"
                  alt="Cart Icon"
                />
              </Link> */}
              {/* <h1 className="mt-[-23px] ml-[-28px] bg-red-700 rounded-[50%] h-[18px] text-[12px] w-[17px] flex justify-center items-center text-white">
                {currentUser ? filteredCartItems.length : 0}
              </h1> */}
              <input
                value={search}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                type="search"
                placeholder="Search"
                className="rounded-full bg-transparent border-[1px] text-white border-white p-3 lg:w-[160px] xl:w-[230px] h-[54px]"
              />
            </div>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="lg:hidden flex items-center justify-between bg-black p-4">
          <Link to="/store">
            <img
              src={store_logo}
              alt="Store Logo"
              className="w-[50px] h-[50px]"
            />
          </Link>
          <div className="flex items-center">
            <Link to="/basket">
              <img
                src={cart_icon}
                className="w-[24px] h-[20px]"
                alt="Cart Icon"
              />
            </Link>
            {currentUser && (
              <div className="ml-[-10px] bg-red-700 rounded-full h-4 w-4 flex justify-center items-center text-xs text-white">
                {filteredCartItems.length}
              </div>
            )}
            <span onClick={handleToggleDrawer} className="ml-4">
              <MdMenuOpen size={24} className="text-white cursor-pointer" />
            </span>
          </div>
        </div>

        {/* Mobile Drawer for small devices */}
        <MobileDrawer
          open={open}
          handleCloseDrawer={handleCloseDrawer}
          currentUser={currentUser}
          menu={menu}
          setMenu={setMenu}
          search={search}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </>
  );
};

export default StoreNavbar;

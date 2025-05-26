import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { MdMenuOpen } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../../redux/user/userSlice";
import NavLinkGroup from "./NavLinkGroup";
import MobileDrawer from "./MobileDrawer";
import UserMenu from "./UserMenu";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [showSessionsDropdown, setShowSessionsDropdown] = useState(false);
  const [showAboutContactDropdown, setShowAboutContactDropdown] =
    useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [open]);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-[104px] bg-white z-50 shadow-lg">
        <div className="w-full flex justify-center items-center flex-col fixed z-40 bg-white md:shadow-lg">
          <div className="flex justify-center items-center w-full bg-gray-900">
            <div className="md:w-[90%] h-15 w-[100%]">
              <div className="flex flex-col justify-center md:items-center md:flex-row h-full md:py-1  md:gap-4 md:justify-between ">
                <div>
                  <h1 className="text-white text-[12px] md:text-[16px] text-center">
                    Join Our Community And Lets Get Playing Football{" "}
                  </h1>
                </div>
                {/* <hr className="bg-white border-[1px] md:hidden border-white w-full " /> */}
                <div className="hidden md:flex md:justify-start   md:items-center gap-4">
                  <Link
                    to={"/contact-us"}
                    className="text-white text-[12px] md:text-[16px]"
                  >
                    Contact Us
                  </Link>
                  {/* <p className="text-white text-[12px] md:text-[16px]">
                    Download App
                  </p> */}
                </div>

                <div className="hidden">
                  {currentUser ? (
                    <UserMenu
                      currentUser={currentUser}
                      handleSignOut={handleSignOut}
                    />
                  ) : (
                    <Link
                      to="/user-register"
                      className="bg-main-dark md:px-4 md:py-2 px-2 py-1 text-sm rounded md:text-[16px] text-white hover:bg-main-darker duration-200"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-[90%] py-3">
            <Link to={"/"}>
              <div>
                <img src={logo} alt="" className="w-[90px]" />
              </div>
            </Link>
            <NavLinkGroup
              currentUser={currentUser}
              showSessionsDropdown={showSessionsDropdown}
              setShowSessionsDropdown={setShowSessionsDropdown}
              showAboutContactDropdown={showAboutContactDropdown}
              setShowAboutContactDropdown={setShowAboutContactDropdown}
              handleSignOut={handleSignOut}
            />
            {currentUser ? (
              <UserMenu
                currentUser={currentUser}
                handleSignOut={handleSignOut}
              />
            ) : (
              <Link
                to="/register"
                className="bg-main-dark px-4 py-2 rounded text-[16px] text-white hover:bg-main-darker duration-200"
              >
                Sign In
              </Link>
            )}
            <span onClick={handleToggleDrawer} className="lg:hidden block">
              <MdMenuOpen className="text-[30px] cursor-pointer" />
            </span>
          </div>
        </div>
      </div>

      {/* for small devices */}
      <div className="lg:hidden block">
        <MobileDrawer
          open={open}
          handleCloseDrawer={handleCloseDrawer}
          currentUser={currentUser}
          showSessionsDropdown={showSessionsDropdown}
          setShowSessionsDropdown={setShowSessionsDropdown}
          showAboutContactDropdown={showAboutContactDropdown}
          setShowAboutContactDropdown={setShowAboutContactDropdown}
          handleSignOut={handleSignOut}
        />
      </div>
    </>
  );
};

export default Header;

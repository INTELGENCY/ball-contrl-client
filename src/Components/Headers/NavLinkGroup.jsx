import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiChevronDown } from "react-icons/bi";
import UserMenu from "./UserMenu";
import { Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";

const NavLinkGroup = ({
  currentUser,
  showSessionsDropdown,
  setShowSessionsDropdown,
  showAboutContactDropdown,
  setShowAboutContactDropdown,
  handleSignOut,
}) => {
  // const dropdownItems = [
  //   { label: "See All", link: "/session/schedule" },
  //   { label: "1 to 1", link: "/session/one-to-one" },
  //   { label: "Out Field", link: "/session/out-field" },
  //   { label: "Football Clubs", link: "/session/football-clubs" },
  //   { label: "Small Group", link: "/session/small-group" },
  // ];
  // const {currentUser} = useSelector((state)=>state.user)
  const aboutContactItems = [{ label: "About Us", link: "/about-us" }];

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowSessionsDropdown(false);
      setShowAboutContactDropdown(false);
    }, 400); // Adjust the delay as needed
    // Store the timeout ID in state to clear it when needed
    setLeaveTimeout(timeout);
  };

  const clearMouseLeaveTimeout = () => {
    if (leaveTimeout) {
      clearTimeout(leaveTimeout);
    }
  };

  const [leaveTimeout, setLeaveTimeout] = useState(null); // State to store timeout ID

  const handleConnect = async () => {
    try {
      const data = {
        coachEmail: currentUser.email,
        coachId: currentUser._id,
        coachName: currentUser.username,
      };
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/connect-stripe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("connect data", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="lg:flex lg:gap-10 lg:items-center hidden"
      onMouseLeave={handleMouseLeave}
    >
      {/* <div className="relative">
        <Button onClick={handleConnect} variant="text" to="/about-us" className="text-[16px] flex gap-2 items-center hover:text-main-dark duration-200">
         Stripe Connect
        </Button>
      </div> */}
      {/* <div className="relative">
        <Link
          to="/about-us"
          className="text-[16px] flex gap-2 items-center hover:text-main-dark duration-200"
        >
          About Us
        </Link>
      </div> */}
      <Link
        to="/how-it-works"
        onClick={() => scrollTo(0, 0)}
        className="text-[16px] flex gap-2 items-center hover:text-main-dark duration-200"
      >
        How it works
      </Link>
      <Link
        to="/Coaches"
        className="text-[16px] flex gap-2 items-center hover:text-main-dark duration-200"
      >
        Coaches
      </Link>
      {/* <Link
        to="/store"
        className="text-[16px] flex gap-2 items-center hover:text-main-dark duration-200"
      >
        Store
      </Link> */}
      {/* <Link
        to="/agency"
        className="text-[16px] flex gap-2 items-center hover:text-main-dark duration-200"
      >
        Agency
      </Link> */}
    </div>
  );
};

export default NavLinkGroup;

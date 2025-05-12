import { useNavigate } from "react-router-dom";
import ProfileDummy from "../../../assets/png/profile_dummy.png";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { signOutSuccess } from "../../../redux/user/userSlice";

const TopbarAdmin = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const profilePicture = currentUser?.profilePicture;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(signOutSuccess());
    setShowDropdown(false);
    navigate("/admin-login");
  };

  const handleNavigateProfile = () => {
    navigate("admin-profile");
    setActiveTab("admin-profile");
    setShowDropdown(false);
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 shadow-xl px-4 relative">
      <p className="font-bold text-gray-800 text-xl">Admin Dashboard</p>

      <div className="relative" ref={dropdownRef}>
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src={profilePicture || ProfileDummy}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50">
            <div className="p-4 border-b">
              <p className="font-semibold text-gray-800">{currentUser?.name}</p>
              <p className="text-gray-500 text-sm truncate">
                {currentUser?.email}
              </p>
            </div>
            <ul className="flex flex-col py-2">
              <li
                onClick={handleNavigateProfile}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              >
                Admin Profile
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-red-100 text-red-600 font-medium cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopbarAdmin;

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const image = currentUser && currentUser.profilePic;

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div className="w-full border shadow-xl rounded-lg mb-10 px-3 py-2 md:flex hidden items-center justify-between">
      <p className="text-lg font-semibold">Dashboard</p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/managesession")}
          className="bg-main-dark hover:bg-main-accent text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center "
        >
          Manage Sessions
        </button>
        <Menu>
          <MenuHandler>
            <Avatar
              variant="circular"
              alt="tania andrew"
              className="cursor-pointer object-cover"
              // src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
              src={image}
            />
          </MenuHandler>
          <MenuList>
            <MenuItem>
              <Typography className="flex flex-col gap-1" variant="small">
                <span className="text-sm">{currentUser.username}</span>
                <span className="font-semibold text-[12px]">
                  {currentUser.email}
                </span>
              </Typography>
            </MenuItem>
            <hr className="my-2 border-blue-gray-50" />
            <MenuItem
              className="flex items-center gap-2 "
              onClick={handleSignOut}
            >
              <Typography variant="small" className="font-medium">
                Sign Out
              </Typography>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default TopBar;

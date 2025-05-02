import React from "react";
import { Menu, MenuHandler, MenuList, MenuItem, Avatar, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";

const UserMenu = ({ currentUser, handleSignOut }) => {
  const ProfilePicture = currentUser?.userType === "Coach" ? currentUser.profilePic : currentUser.profilePicture
  return (
    <Menu>
      <MenuHandler>
        <Avatar
          variant="circular"
          alt="UserAvatar"
          className="cursor-pointer w-9 h-9"
          // src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          src={ProfilePicture}
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

        {currentUser && currentUser.userType === "Coach" && (
          <Link to="/managesession">
            <MenuItem className="flex items-center gap-2">
              <Typography variant="small" className="font-medium">
                Manage Session
              </Typography>
            </MenuItem>
          </Link>
        )}
        {currentUser && currentUser.userType === "Coach" && (
          <Link to="coach-dashboard?tab=home">
            <MenuItem className="flex items-center gap-2">
              <Typography variant="small" className="font-medium">
                Dashboard
              </Typography>
            </MenuItem>
          </Link>
        )}
        {currentUser && currentUser.userType === "Player" && (
          <Link to="/player-dashboard?tab=dashboard">
            <MenuItem className="flex items-center gap-2">
              <Typography variant="small" className="font-medium">
                Dashboard
              </Typography>
            </MenuItem>
          </Link>
        )}
        {currentUser && currentUser.userType === "Player" && (
          <Link to="/coaches">
            <MenuItem>
              <Typography>Coaches</Typography>
            </MenuItem>
          </Link>
        )}
        {currentUser && currentUser.userType === "Player" && (
          <Link to="/session/abc">
            <MenuItem>
              <Typography>Sessions</Typography>
            </MenuItem>
          </Link>
        )}
        {currentUser && currentUser.userType === "Parent" && (
          <>
            <Link to="/parent-dashboard?tab=overview">
              <MenuItem className="flex items-center gap-2">
                <Typography variant="small" className="font-medium">
                  Dashboard
                </Typography>
              </MenuItem>
            </Link>
            <Link to="/coaches">
              <MenuItem>
                <Typography>Coaches</Typography>
              </MenuItem>
            </Link>
            <Link to="/session/abc">
              <MenuItem>
                <Typography>Sessions</Typography>
              </MenuItem>
            </Link>
          </>
        )}
        <MenuItem className="flex items-center gap-2" onClick={handleSignOut}>
          <Typography variant="small" className="font-medium">
            Sign Out
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;

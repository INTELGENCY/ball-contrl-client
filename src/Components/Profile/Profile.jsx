import React from "react";
import { useSelector } from "react-redux";
import { FaEnvelope, FaUser, FaUserTag, FaCalendarAlt, FaEdit } from "react-icons/fa";
import AddProfile from "../../modules/Coach/AddProfile/AddProfile";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return <AddProfile />;
};

export default Profile;

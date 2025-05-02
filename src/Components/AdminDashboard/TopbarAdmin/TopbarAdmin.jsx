import { useNavigate } from "react-router-dom";
import ProfileDummy from "../../../assets/png/profile_dummy.png";

const TopbarAdmin = ({ setActiveTab }) => {
  const navigate = useNavigate();
  // receive setter as prop
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 shadow-xl px-4">
      <p className="font-bold text-gray-800 text-xl">Admin Dashboard</p>

      <div
        className="flex gap-2 items-center cursor-pointer group relative"
        onClick={() => {
          navigate("admin-profile");
          setActiveTab("admin-profile");
        }} // Set the tab to "admin-profile" when clicked
      >
        <img
          src={ProfileDummy}
          alt=""
          className="w-12 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default TopbarAdmin;

import { useState, useRef } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import ProfileDummy from "../../../assets/png/profile_dummy.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { FiUpload } from "react-icons/fi";
import { signInSuccess, signOutSuccess } from "../../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    reNewPassword: "",
  });

  const [profileImage, setProfileImage] = useState(ProfileDummy);
  const [imageFile, setImageFile] = useState(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReNewPassword, setShowReNewPassword] = useState(false);
  const [showProfileButtons, setShowProfileButtons] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleProfileImageClick = () => {
    setShowProfileButtons(!showProfileButtons);
  };

  const handleUpdateProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleViewProfileClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.reNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    const submitData = new FormData();
    if (imageFile) {
      submitData.append("imageFile", imageFile);
    }
    submitData.append("currentPassword", formData.currentPassword);
    submitData.append("newPassword", formData.newPassword);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/update-profile?id=${
          currentUser._id
        }`,
        {
          method: "POST",
          body: submitData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          reNewPassword: "",
        });
        dispatch(signInSuccess(data?.admin));
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("Something went wrong while updating profile.");
    }
  };

  const handleLogout = () => {
    dispatch(signOutSuccess());
    navigate("/admin-login");
  };

  return (
    <div className="flex justify-center mt-1 relative">
      <div className="bg-white flex flex-col justify-center items-center w-full md:w-[90%] p-2 rounded-lg">
        <p className="text-gray-500 mb-6 text-2xl font-semibold">
          Edit your profile
        </p>

        {/* Profile Image */}
        <div className="flex items-center flex-col gap-2 justify-center mb-6">
          <img
            className="w-24 h-24 rounded-full border-2 border-gray-200 cursor-pointer object-cover"
            src={profileImage}
            alt="Profile"
            onClick={handleProfileImageClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          {showProfileButtons && (
            <div className="flex flex-col md:flex-row gap-2">
              <button
                onClick={handleViewProfileClick}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                View Profile Pic
              </button>
              <button
                onClick={handleUpdateProfileClick}
                className="bg-main-dark text-white px-4 py-2 rounded"
              >
                Update Profile Pic
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 h-screen"
            onClick={closeModal}
          >
            <div className="bg-white p-[.1rem]">
              <img
                src={profileImage}
                alt="Profile"
                className="w-64 h-80 object-cover"
              />
            </div>
          </div>
        )}

        {/* Form */}
        <div className="w-full md:w-[80%]">
          <h2 className="text-2xl font-semibold mb-2">Password</h2>

          {/* Current Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700">Current Password</label>
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              className="w-full p-2 border border-gray-300 mt-1 rounded-md"
              placeholder="**********"
              onChange={handleChange}
              value={formData.currentPassword}
              required
            />
            <div
              className="absolute inset-y-0 right-3 top-5 flex items-center cursor-pointer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <BsEye /> : <BsEyeSlash />}
            </div>
          </div>

          {/* New Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700">New Password</label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              className="w-full p-2 border border-gray-300 mt-1 rounded-md"
              placeholder="Enter your new password"
              onChange={handleChange}
              value={formData.newPassword}
              required
            />
            <div
              className="absolute inset-y-0 right-3 top-5 flex items-center cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <BsEye /> : <BsEyeSlash />}
            </div>
          </div>

          {/* Re-type New Password */}
          <div className="mb-4 relative">
            <label className="block text-gray-700">Re-type New Password</label>
            <input
              type={showReNewPassword ? "text" : "password"}
              id="reNewPassword"
              className="w-full p-2 border border-gray-300 mt-1 rounded-md"
              placeholder="Re-type your new password"
              onChange={handleChange}
              value={formData.reNewPassword}
              required
            />
            <div
              className="absolute inset-y-0 right-3 top-5 flex items-center cursor-pointer"
              onClick={() => setShowReNewPassword(!showReNewPassword)}
            >
              {showReNewPassword ? <BsEye /> : <BsEyeSlash />}
            </div>
          </div>

          {/* Update + Logout Buttons */}
          <button
            className="bg-main-dark text-white mt-2 px-4 py-2 rounded hover:bg-main-darker transition-all duration-200 w-[100%]"
            onClick={handleChangePassword}
          >
            Update Now
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white mt-2 px-4 py-2 rounded hover:bg-red-500 transition-all duration-200 w-[100%]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;

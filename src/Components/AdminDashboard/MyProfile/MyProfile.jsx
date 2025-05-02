import { useState, useRef } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import ProfileDummy from "../../../assets/png/profile_dummy.png";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUpload } from "react-icons/fi";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import { app } from "../../../firebase";

const MyProfile = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    reNewPassword: "",
  });

  const [profileImage, setProfileImage] = useState(ProfileDummy);
  const [imageName, setImageName] = useState("");
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // State for toggling password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReNewPassword, setShowReNewPassword] = useState(false);

  // New states for managing profile image buttons and modal
  const [showProfileButtons, setShowProfileButtons] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
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
      setImageName(file.name);
      uploadImageToFirebase(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToFirebase = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError("Image upload failed");
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfileImage(downloadURL);
          setImageUploadProgress(null);
          setImageUploadError(null);
          toast.success("Profile picture uploaded successfully!");
        });
      }
    );
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.reNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/admin/change-password?id=${
          currentUser._id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          reNewPassword: "",
        });
      } else {
        toast.error(
          data.message || "An error occurred while changing the password."
        );
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <div className="flex justify-center mt-1 relative">
      <ToastContainer />
      <div className="bg-white flex flex-col justify-center items-center w-full md:w-[90%] p-2 rounded-lg">
        {/* <h2 className="text-2xl font-semibold mb-2">Account Information</h2> */}
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
          {imageName && <p className="text-sm hidden">{imageName}</p>}
          {imageUploadProgress && (
            <p>Upload progress: {imageUploadProgress}%</p>
          )}
          {imageUploadError && (
            <p className="text-red-500">{imageUploadError}</p>
          )}

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

        {/* Modal for Viewing Profile Image */}
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

        {/* ------ Form fields ------ */}
        <form onSubmit={handleChangePassword} className="w-full md:w-[80%]">
          {/* Password Section */}
          <h2 className="text-2xl font-semibold mb-2">Password</h2>

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
          <button
            type="submit"
            className="bg-main-dark text-white mt-2 px-4 py-2 rounded hover:bg-main-darker transition-all duration-200 w-[100%]"
          >
            Update Now
          </button>
          <button
            type="submit"
            className="bg-red-400 text-white mt-2 px-4 py-2 rounded hover:bg-red-500 transition-all duration-200 w-[100%]"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiUpload, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { signInSuccess } from "../../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import AvailabilityManager from "../../../modules/Coach/AddProfile/Availability";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import axios from "axios";

const AddProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [sessionData, setSessionData] = useState({
    profilePic: null,
    username: "",
    email: "",
    address_line_1: "",
    phoneNumber: "",
    description: "",
    experience: "",
    events: [],
    fitnessGoals: [],
    agegroup: "",
    duration: "",
    coachId: currentUser ? currentUser._id : "",
  });

  const [errors, setErrors] = useState({});
  const [currentEvent, setCurrentEvent] = useState("");
  const [currentGoal, setCurrentGoal] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/coach/profile/${
            sessionData.coachId
          }`
        );
        if (response.data) {
          setSessionData({
            ...response.data,
            coachId: currentUser._id,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching profile data");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser, sessionData.coachId]);

  const validateForm = () => {
    const newErrors = {};
    if (!sessionData.username) newErrors.username = "Username is required";
    if (!sessionData.email) newErrors.email = "Email is required";
    if (!sessionData.address_line_1)
      newErrors.address_line_1 = "Address is required";
    if (!sessionData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";
    if (!sessionData.agegroup) newErrors.agegroup = "Age group is required";
    if (!sessionData.duration) newErrors.duration = "Duration is required";
    if (!sessionData.description)
      newErrors.description = "Description is required";
    if (!sessionData.experience)
      newErrors.experience = "Experience is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handleEventInputChange = (e) => {
    setCurrentEvent(e.target.value);
  };

  const handleGoalInputChange = (e) => {
    setCurrentGoal(e.target.value);
  };

  const handleAddEvent = (e) => {
    if (e.key === "Enter" && currentEvent.trim() !== "") {
      e.preventDefault();
      setSessionData((prev) => ({
        ...prev,
        events: [...prev.events, currentEvent.trim()],
      }));
      setCurrentEvent("");
    }
  };

  const handleAddGoal = (e) => {
    if (e.key === "Enter" && currentGoal.trim() !== "") {
      e.preventDefault();
      setSessionData((prev) => ({
        ...prev,
        fitnessGoals: [...prev.fitnessGoals, currentGoal.trim()],
      }));
      setCurrentGoal("");
    }
  };

  const handleRemoveEvent = (eventToRemove) => {
    setSessionData((prev) => ({
      ...prev,
      events: prev.events.filter((event) => event !== eventToRemove),
    }));
  };

  const handleRemoveGoal = (goalToRemove) => {
    setSessionData((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.filter((goal) => goal !== goalToRemove),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should not exceed 2MB");
      return;
    }

    setImageFile(file);
    setImageName(file.name);
    setSessionData((prev) => ({
      ...prev,
      profilePic: URL.createObjectURL(file),
    }));
  };

  const handleSessionSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (sessionData.events.length < 2) {
      toast.error("Please add at least 2 events");
      return;
    }

    if (sessionData.fitnessGoals.length < 2) {
      toast.error("Please add at least 2 fitness goals");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();

      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      Object.entries(sessionData).forEach(([key, value]) => {
        if (key !== "imageFile" && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => formData.append(key, item));
          } else {
            formData.append(key, value);
          }
        }
      });

      const { data } = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/coach/updateprofile/${
          sessionData.coachId
        }`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(signInSuccess(data));
      toast.success("Profile updated successfully");
      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Profile update failed"
      );
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[80vh]">
        <LockClosedIcon className="h-12 w-12 mb-4 text-gray-500" />
        <p className="text-2xl font-bold mb-4">
          Please sign in to access this page.
        </p>
        <Link
          to="/register"
          className="px-4 py-2 bg-main-dark text-white rounded"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#fd86c8" />
      </div>
    );
  }

  return (
    <div className="w-[100%] mx-auto">
      <div className="pt-10">
        <h1 className="text-[44px] text-gray-800 font-semibold text-center">
          Profile Details
        </h1>
      </div>
      <div className="w-[100%] shadow-lg mb-[5rem] rounded-xl mt-8 py-4 mx-auto">
        <h1 className="text-center text-[20px] font-semibold uppercase">
          Basic Details
        </h1>
        <div className="w-[100%] mx-auto">
          <form onSubmit={handleSessionSubmit} encType="multipart/form-data">
            <div className="my-4 App_add">
              <label
                htmlFor="fileId"
                className="text-[#8E8E8E] flex justify-center gap-3 items-center cursor-pointer"
              >
                <FiUpload className="text-[#8E8E8E]" />
                Upload profile picture
              </label>
              {imageName && (
                <p className="mt-2 text-sm text-center">{imageName}</p>
              )}
              <input
                id="fileId"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {sessionData.profilePic && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={
                      typeof sessionData.profilePic === "string"
                        ? sessionData.profilePic
                        : URL.createObjectURL(imageFile)
                    }
                    alt="Profile preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="grids">
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-600">
                  Name:
                </label>
                <input
                  type="text"
                  name="username"
                  value={sessionData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md border-[#e7e6e6]"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-600">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={sessionData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md border-[#e7e6e6]"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-600">
                  Address:
                </label>
                <input
                  type="text"
                  name="address_line_1"
                  value={sessionData.address_line_1}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md border-[#e7e6e6]"
                />
                {errors.address_line_1 && (
                  <p className="text-red-500 text-sm">
                    {errors.address_line_1}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-600">
                  Phone Number:
                </label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={sessionData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md border-[#e7e6e6]"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>

              <div className="">
                <label className="text-[#8E8E8E]">Age Group</label>
                <select
                  name="agegroup"
                  value={sessionData.agegroup}
                  onChange={handleInputChange}
                  className="w-full rounded-md px-4 py-2 border-[1px] outline-none border-[#e7e6e6]"
                >
                  <option value="">Select Age Group</option>
                  <option value="10-20">10-20</option>
                  <option value="21-30">21-30</option>
                  <option value="31-40">31-40</option>
                  <option value="41-50">41-50</option>
                  <option value="51-60">51-60</option>
                  <option value="61-70">61-70</option>
                </select>
                {errors.agegroup && (
                  <p className="text-red-500 text-sm">{errors.agegroup}</p>
                )}
              </div>

              <div className="">
                <label className="text-[#8E8E8E]">Duration</label>
                <select
                  name="duration"
                  value={sessionData.duration}
                  onChange={handleInputChange}
                  className="w-full rounded-md px-4 py-2 border-[1px] outline-none border-[#e7e6e6]"
                >
                  <option value="">Select Duration</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                  <option value="120">120</option>
                </select>
                {errors.duration && (
                  <p className="text-red-500 text-sm">{errors.duration}</p>
                )}
              </div>

              <div className="">
                <label className="text-[#8E8E8E]">Events</label>
                <input
                  type="text"
                  value={currentEvent}
                  onChange={handleEventInputChange}
                  onKeyPress={handleAddEvent}
                  className="w-full rounded-md px-4 py-2 border-[1px] outline-none border-[#e7e6e6]"
                  placeholder="Add event and press Enter"
                />
                <ul className="mt-2 flex flex-wrap gap-2">
                  {sessionData.events.map((event, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-full"
                    >
                      {event}
                      <FiX
                        className="cursor-pointer"
                        onClick={() => handleRemoveEvent(event)}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="">
                <label className="text-[#8E8E8E]">Fitness Goals</label>
                <input
                  type="text"
                  value={currentGoal}
                  onChange={handleGoalInputChange}
                  onKeyPress={handleAddGoal}
                  className="w-full rounded-md px-4 py-2 border-[1px] outline-none border-[#e7e6e6]"
                  placeholder="Add goal and press Enter"
                />
                <ul className="mt-2 flex flex-wrap gap-2">
                  {sessionData.fitnessGoals.map((goal, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-full"
                    >
                      {goal}
                      <FiX
                        className="cursor-pointer"
                        onClick={() => handleRemoveGoal(goal)}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-600">
                  Description:
                </label>
                <textarea
                  name="description"
                  value={sessionData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md border-[#e7e6e6]"
                  rows="5"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-600">
                  Experience:
                </label>
                <textarea
                  name="experience"
                  value={sessionData.experience}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md border-[#e7e6e6]"
                  rows="5"
                ></textarea>
                {errors.experience && (
                  <p className="text-red-500 text-sm">{errors.experience}</p>
                )}
              </div>
            </div>

            <div className="mt-8 w-1/2 mx-auto">
              <div
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center w-full rounded-md px-4 py-4 border-[1px] outline-none border-[#a0a0a0] cursor-pointer text-gray-900 font-medium gap-2 bg-pink-0"
              >
                <span className="text-main-dark material-icons">
                  access_time
                </span>
                <span>Manage Availability</span>
              </div>
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-md shadow-lg p-6 w-[90%] max-w-6xl">
                  <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-xl font-bold">Manage Availability</h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-600 hover:text-gray-900 text-xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <AvailabilityManager />
                </div>
              </div>
            )}

            <div className="py-3 mt-2 w-[40%] mx-auto">
              <button
                type="submit"
                disabled={uploading}
                className={`w-full flex justify-center items-center text-center bg-[#ec2e7d] text-white py-2 rounded-md ${
                  uploading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? (
                  <>
                    <ClipLoader color="#ffffff" size={20} className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProfile;

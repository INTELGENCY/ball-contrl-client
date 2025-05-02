import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddSession = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    location: "",
    agegroup: "",
    category: "",
    time: "",
    sessionDuration: "",
    price: "",
    coachId: currentUser._id,
    coachName: currentUser.username,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      toast.error("Image size should not exceed 2MB");
      return;
    }

    setImageFile(file);
    setImageName(file.name);
  };

  const handleSessionSubmit = async (e) => {
    if (!currentUser.stripeAccountId) {
      toast.error("Please connect your Stripe account to create sessions");
      navigate("/coach-dashboard?tab=wallet");
      return;
    }
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please upload a session image");
      return;
    }

    if (!sessionData.category) {
      toast.error("Please select a category");
      return;
    }

    if (currentUser.userType !== "Coach") {
      toast.error("Only coaches can create sessions");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("imageFile", imageFile);
      Object.entries(sessionData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/session/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            toast.info(`Uploading: ${percentCompleted}% complete`);
          },
        }
      );

      toast.success("Session created successfully!");
      resetForm();
      navigate("/managesession");
    } catch (error) {
      console.error("Session creation error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create session";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSessionData({
      title: "",
      description: "",
      location: "",
      agegroup: "",
      category: "",
      time: "",
      sessionDuration: "",
      price: "",
      coachId: currentUser._id,
      coachName: currentUser.username,
    });
    setImageFile(null);
    setImageName("");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md my-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Add New Session</h1>
      <form onSubmit={handleSessionSubmit} className="space-y-6">
        {/* Session Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Session Picture
          </label>
          <div className="mt-1 flex items-center">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md flex items-center hover:bg-gray-300 transition"
              onClick={() => document.getElementById("fileId").click()}
            >
              <FiUpload className="mr-2" /> Choose File
            </button>
            {imageName && (
              <span className="ml-3 text-sm text-gray-600">{imageName}</span>
            )}
          </div>
          <input
            type="file"
            id="fileId"
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
          />
          <p className="mt-1 text-xs text-gray-500">JPEG, PNG (Max 2MB)</p>
          {imageFile && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Session preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Session Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Session Name
          </label>
          <input
            type="text"
            name="title"
            value={sessionData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
            placeholder="Enter session name"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={sessionData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
            placeholder="Enter session description"
            rows="3"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={sessionData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
            placeholder="Enter session location"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (£)
          </label>
          <input
            type="number"
            name="price"
            value={sessionData.price}
            onChange={handleInputChange}
            min="0"
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
            placeholder="Enter session price"
          />
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Age Group
          </label>
          <select
            name="agegroup"
            value={sessionData.agegroup}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
          >
            <option value="">Select age group</option>
            <option value="U9-U12">U9-U12</option>
            <option value="U13-U16">U13-U16</option>
            <option value="U16+">U16+</option>
          </select>
        </div>

        {/* Session Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Session Duration
          </label>
          <select
            name="sessionDuration"
            value={sessionData.sessionDuration}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
          >
            <option value="">Select duration</option>
            <option value="45 mins">45 mins</option>
            <option value="60 mins">60 mins</option>
            <option value="90 mins">90 mins</option>
            <option value="120 mins">120 mins</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={sessionData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
          >
            <option value="">Select category</option>
            <option value="1 to 1">1 to 1</option>
            <option value="out field">Out Field</option>
            <option value="football clubs">Football Clubs</option>
            <option value="small group">Small Group</option>
            <option value="full Session">Full Sessions</option>
            <option value="goal keeper">Goal Keeper</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg transition duration-200 font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600 text-white"
            }`}
          >
            {loading ? "Processing..." : "CREATE SESSION"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSession;

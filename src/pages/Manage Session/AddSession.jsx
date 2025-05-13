import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
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

  const formFields = [
    {
      name: "title",
      label: "Session Name",
      type: "text",
      placeholder: "Enter session name",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter session description",
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter session location",
    },
    {
      name: "price",
      label: "Price (£)",
      type: "number",
      placeholder: "Enter session price",
      min: "0",
    },
  ];

  const selectOptions = {
    agegroup: [
      { value: "", label: "Select age group" },
      { value: "U9-U12", label: "U9-U12" },
      { value: "U13-U16", label: "U13-U16" },
      { value: "U16+", label: "U16+" },
    ],
    sessionDuration: [
      { value: "", label: "Select duration" },
      { value: "45 mins", label: "45 mins" },
      { value: "60 mins", label: "60 mins" },
      { value: "90 mins", label: "90 mins" },
      { value: "120 mins", label: "120 mins" },
    ],
    category: [
      { value: "", label: "Select category" },
      { value: "1 to 1", label: "1 to 1" },
      { value: "out field", label: "Out Field" },
      { value: "football clubs", label: "Football Clubs" },
      { value: "small group", label: "Small Group" },
      { value: "full Session", label: "Full Sessions" },
      { value: "goal keeper", label: "Goal Keeper" },
    ],
  };

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

        {/* Regular Input Fields */}
        {formFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={sessionData[field.name]}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                placeholder={field.placeholder}
                rows="3"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={sessionData[field.name]}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
                placeholder={field.placeholder}
                min={field.min}
              />
            )}
          </div>
        ))}

        {/* Select Fields */}
        {Object.entries(selectOptions).map(([fieldName, options]) => (
          <div key={fieldName}>
            <label className="block text-sm font-medium text-gray-700">
              {fieldName === "agegroup"
                ? "Age Group"
                : fieldName === "sessionDuration"
                ? "Session Duration"
                : "Category"}
            </label>
            <select
              name={fieldName}
              value={sessionData[fieldName]}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

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

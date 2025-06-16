import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const EditSession = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState({
    title: "",
    description: "",
    location: "",
    agegroup: "",
    category: "",
    sessionDuration: "",
    price: "",
    coachId: currentUser._id,
    image: "",
  });

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

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/session/${id}`
        );
        if (response.data) {
          setSessionData(response.data);
        } else {
          throw new Error("Failed to fetch session data");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load session data");
      }
    };

    fetchSessionData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData((prevData) => ({
      ...prevData,
      [name]: value,
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();

      // Only append the image if a new one was selected
      if (imageFile) {
        formData.append("imageFile", imageFile);
      }

      // Append all other session data
      Object.entries(sessionData).forEach(([key, value]) => {
        if (key !== "image") {
          // Don't append the old image URL
          formData.append(key, value);
        }
      });

      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/session/${id}`,
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

      toast.success("Session updated successfully!");
      navigate("/managesession");
    } catch (error) {
      console.error("Session update error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update session";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-4">
        <Link
          to={"/managesession"}
          className="py-2 px-4 rounded-lg bg-main-dark hover:bg-main-accent text-white duration-200"
        >
          Back
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-main-darker">Edit Session</h1>
        <p className="text-gray-600 mt-2">Update your session details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Session Picture
          </label>
          <div className="mt-1 flex items-center">
            <button
              type="button"
              className="px-4 py-2 bg-main-lighter text-main-darker rounded-md flex items-center hover:bg-main-primary transition"
              onClick={() => document.getElementById("fileId").click()}
            >
              <FiUpload className="mr-2" /> Choose File
            </button>
            {imageName ? (
              <span className="ml-3 text-sm text-gray-600">{imageName}</span>
            ) : (
              <span className="ml-3 text-sm text-gray-600">
                {sessionData.image ? "Current image" : "No image selected"}
              </span>
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
          {(imageFile || sessionData.image) && (
            <div className="mt-2">
              <img
                src={
                  imageFile ? URL.createObjectURL(imageFile) : sessionData.image
                }
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
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-main-lighter rounded focus:border-main-primary focus:ring-1 focus:ring-main-primary outline-none"
                placeholder={field.placeholder}
                rows="3"
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={sessionData[field.name]}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-main-lighter rounded focus:border-main-primary focus:ring-1 focus:ring-main-primary outline-none"
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
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-main-lighter rounded focus:border-main-primary focus:ring-1 focus:ring-main-primary outline-none"
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
                : "bg-main-dark hover:bg-main-darker text-white"
            }`}
          >
            {loading ? "Processing..." : "UPDATE SESSION"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSession;

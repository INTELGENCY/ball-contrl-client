import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { app } from "../../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const EditSession = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [imageName, setImageName] = useState("");
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState({
    image: null,
    title: "",
    description: "",
    category: "",
    location: "",
    price: "",
    agegroup: "",
    sessionDuration: "",
    coachId: currentUser._id,
  });
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/session/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
        } else {
          throw new Error("Failed to fetch session data");
        }
      } catch (error) {
        console.error(error);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoadingImage(true);
      uploadImageToFirebase(file);
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
        setLoadingImage(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setSessionData((prevState) => ({
            ...prevState,
            image: downloadURL,
          }));
          setImageName(file.name);
          setImageUploadProgress(null);
          setImageUploadError(null);
          setLoadingImage(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/session/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sessionData),
        }
      );

      if (response.ok) {
        setLoading(false);
        Swal.fire({
          title: "Session updated successfully",
          icon: "success",
        });
        setSessionData({
          image: "",
          title: "",
          description: "",
          category: "",
          location: "",
          price: "",
          agegroup: "",
          sessionDuration: "",
        });

        setImageName("");
        navigate("/managesession");
      } else {
        setLoading(false);
        throw new Error("Failed to update session");
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Session update failed",
        icon: "error",
      });
      console.error("Error updating session:", error);
    }
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="pt-10">
        <h1 className="text-[44px] text-[#383C3E] font-bold">Edit session</h1>
      </div>
      <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex items-center gap-20">
          <div className="my-4 App">
            <div>
              <label
                htmlFor="fileId"
                className="text-[#8E8E8E] flex gap-3 items-center"
              >
                <FiUpload className="text-[#8E8E8E]" />
                Upload session picture
              </label>
              {imageName && <p className="mt-2 text-sm">{imageName}</p>}
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                id="fileId"
                required={!sessionData.image}
              />
              {imageUploadProgress && (
                <p>Upload progress: {imageUploadProgress}%</p>
              )}
              {imageUploadError && (
                <p className="text-red-500">{imageUploadError}</p>
              )}
            </div>
          </div>
          <div>
            {loadingImage ? (
              <p>Loading image...</p>
            ) : sessionData.image ? (
              <img src={sessionData.image} width={200} alt="session_image" />
            ) : (
              <p>No image uploaded</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-[12px] opacity-70">
            Attach file. File size of your documents should not exceed 2MB
          </p>
        </div>
        <div
          className="pt-5 w-[70%]"
          style={{ borderBottom: "1px solid gray" }}
        >
          <input
            type="text"
            className="w-full"
            name="title"
            onChange={handleChange}
            value={sessionData.title}
            placeholder="Session Name"
          />
        </div>
        <div
          className="my-8 py-2 w-[70%]"
          style={{ borderBottom: "1px solid gray" }}
        >
          <input
            type="text"
            className="w-full"
            onChange={handleChange}
            name="description"
            value={sessionData.description}
            placeholder="Description"
          />
        </div>
        <div
          className="my-8 py-2 w-[70%]"
          style={{ borderBottom: "1px solid gray" }}
        >
          <input
            type="text"
            className="w-full"
            onChange={handleChange}
            name="location"
            value={sessionData.location}
            placeholder="location"
          />
        </div>
        <div
          className="my-8 py-2 w-[70%]"
          style={{ borderBottom: "1px solid gray" }}
        >
          <input
            type="text"
            className="w-full"
            onChange={handleChange}
            name="price"
            value={sessionData.price}
            placeholder="price"
          />
        </div>
        <div
          className="my-8 py-2 w-[70%]"
          style={{ borderBottom: "1px solid gray" }}
        >
          <input
            type="text"
            className="w-full"
            onChange={handleChange}
            name="agegroup"
            value={sessionData.agegroup}
            placeholder="agegroup"
          />
        </div>

        <div
          className="my-8 py-2 w-[70%]"
          style={{ borderBottom: "1px solid gray" }}
        >
          <input
            type="text"
            className="w-full"
            onChange={handleChange}
            name="sessionDuration"
            value={sessionData.sessionDuration}
            placeholder="Session duration"
          />
        </div>
        <div
          className="my-8 py-2 w-[70%]"
          style={{ borderBottom: "1px solid gray" }}
        >
          <select
            name="category"
            onChange={handleChange}
            value={sessionData.category}
            className="w-[60%] opacity-40"
            style={{ outline: "none" }}
          >
            <option value="category">Select Category</option>
            <option value="1 to 1">1 to 1</option>
            <option value="out field">Out Field</option>
            <option value="football clubs">Football Clubs</option>
            <option value="small group">Small Group</option>
          </select>
        </div>
        <div className="opacity-70">
          <p>Need an experienced and skilled hand with custom IT projects?</p>
          <p>Fill out the form to get a free consultation.</p>
        </div>
        <div className="py-3">
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#EC7CD3] text-white w-[40%] rounded-3xl py-3 ${
              loading ? "disabled:cursor-not-allowed" : ""
            } `}
          >
            {loading ? "Loading..." : "Submit Data"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSession;

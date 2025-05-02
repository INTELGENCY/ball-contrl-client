import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import icons from "../../assets/images/add-session.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./SessionStyle.css";
import { ClipLoader } from "react-spinners";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-lg p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-main-dark text-white rounded hover:bg-main-darker transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const SessionCards = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const id = currentUser._id;

  const getSessionData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/coach/getsessionbycoachid/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setLoading(new Array(data.length).fill(true));
      } else {
        throw new Error("Failed to fetch session data");
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  useEffect(() => {
    getSessionData();
  }, [id]);

  const handleImageLoad = (index) => {
    setLoading((prevLoading) => {
      if (!Array.isArray(prevLoading)) {
        console.error("Loading state is not an array");
        return prevLoading;
      }
      const newLoading = [...prevLoading];
      newLoading[index] = false;
      return newLoading;
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/session/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Session deleted successfully");
        const indexToDelete = formData.findIndex((data) => data._id === id);
        if (indexToDelete !== -1) {
          setFormData((prevFormData) =>
            prevFormData.filter((_, index) => index !== indexToDelete)
          );
          setLoading((prevLoading) =>
            prevLoading.filter((_, index) => index !== indexToDelete)
          );
        }
      } else {
        throw new Error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Session could not be deleted");
    }
  };

  const handleEdit = (id) => {
    navigate(`/editsession/${id}`);
  };

  const openDeleteModal = (id) => {
    setSelectedSessionId(id);
    setModalType("delete");
    setModalOpen(true);
  };

  const openEditModal = (id) => {
    setSelectedSessionId(id);
    setModalType("edit");
    setModalOpen(true);
  };

  const handleConfirm = () => {
    if (modalType === "delete") {
      handleDelete(selectedSessionId);
    } else if (modalType === "edit") {
      handleEdit(selectedSessionId);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-[100%] pt-2 mx-auto">
      <div className="xl:w-[86%] mx-auto style_main">
        {formData.length === 0 ? (
          <p className="w-full text-center text-xl text-gray-500">
            No sessions added yet
          </p>
        ) : (
          formData.map((data, index) => (
            <div
              key={data._id}
              className="mx-auto w-[90%] flex flex-col px-4 py-4 mb-6 gap-3 rounded-lg shadow-md border border-main-primary"
            >
              {loading[index] ? (
                <div className="flex justify-center items-center h-[212px]">
                  <ClipLoader color="#FF6AB9" />
                </div>
              ) : null}
              <img
                src={data?.image}
                width="100%"
                height={212}
                alt="data_image"
                onLoad={() => handleImageLoad(index)}
                style={{ display: loading[index] ? "none" : "block" }}
                className="object-cover"
              />
              <h1 className="text-[24px] font-semibold">{data?.title}</h1>
              <h1 className="font-regular">Category: {data?.category}</h1>
              <p className="text-[#7D8FA9] text-[14px]">{data?.description}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => openEditModal(data._id)}
                  className="w-[90%] text-center flex items-center justify-center gap-3 text-main-dark border border-main-dark py-[0.4rem] px-1 sm:px-2 rounded text-sm hover:bg-[#f5d8e9] duration-200 hover:text-black"
                >
                  <img src={icons} alt="icon" /> Edit
                </button>
                <button
                  className="text-main-dark"
                  onClick={() => openDeleteModal(data._id)}
                >
                  <RiDeleteBin6Line className="text-xl" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        title={modalType === "delete" ? "Confirm Deletion" : "Confirm Edit"}
        message={
          modalType === "delete"
            ? "Are you sure you want to delete this session? This action cannot be undone."
            : "Do you want to proceed to edit this session?"
        }
      />
    </div>
  );
};

export default SessionCards;

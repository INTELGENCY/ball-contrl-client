import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import icons from "../../assets/images/add-session.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
const FilteredData = ({ formData }) => {
  const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user)
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/session/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Session deleted successfully");
        setFormData(formData.filter((data) => data._id !== id));
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
console.log(formData);
  return (
    <div>
      <div className="w-[100%] pt-2 mx-auto">
        <div className="xl:w-[97%] mx-auto  flex  flex-wrap ">
          {formData.length === 0 ? (
            <p className="w-full text-center text-xl text-gray-500">No such sessions added yet</p>
          ) : (
            formData?.map((data) => (
              <div
                key={data._id}
                className="mx-auto w-[80%] sm:w-[60%] md:w-[40%] lg:w-[26%] flex flex-col px-2 py-2 mb-6 gap-3 rounded-lg shadow-md border border-main-primary"
              >
                <img src={data?.image} className="object-cover" width="100%" height={212} alt="data_image" />
                <h1 className="text-[24px] px-3 font-semibold">{data?.title}</h1>
                <h1 className="px-3 font-regular">Category: {data?.category}</h1>
                <p className="px-3 text-[#7D8FA9] text-[14px]">{data?.description}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(data._id)}
                    className="w-[90%] text-center flex items-center justify-center gap-3 text-main-dark border border-main-dark py-[0.4rem] px-1 sm:px-2 rounded text-sm hover:bg-[#f5d8e9] duration-200 hover:text-black"
                  >
                    <img src={icons} alt="icon" /> Edit
                  </button>
                  <button onClick={() => handleDelete(data._id)}>
                    <RiDeleteBin6Line className="text-xl" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FilteredData;

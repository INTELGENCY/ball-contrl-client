import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { FaCloudUploadAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [blogs, setBlogs] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tag: "",
    date: "",
    image: null,
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/blogs`);
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs", error);
    }
  };
  // Fetch blogs
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle description change with ReactQuill
  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Submit blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("tag", formData.tag);
    form.append("date", formData.date);
    form.append("imageFile", formData.image);

    try {
      const response = await axios.post(`${BASE_URL}/blogs/create`, form);

      setFormData({
        title: "",
        description: "",
        tag: "",
        date: "",
        image: null,
      });
      setImagePreview(null);
      setAddLoading(false);
      toast.success(response.data.message || "Blog added successfully");
      fetchBlogs();
    } catch (error) {
      setAddLoading(false);
      console.error("Error adding blog", error);
      toast.error("Failed to add blog");
    }
  };

  const handleDelete = async (id) => {
    try {
      alert("Are you sure you want to delete this blog?");
      await axios.delete(`${BASE_URL}/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog", error);
      toast.error("Failed to delete blog");
    }
  };
  const handleNavigate = async (id) => {
    navigate(`/blogdetail/${id}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "add"
              ? "bg-main-dark text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("add")}
        >
          Add Blog
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            activeTab === "view"
              ? "bg-main-dark text-white shadow-lg"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("view")}
        >
          View Blogs
        </button>
      </div>

      {/* Add Blog Form */}
      {activeTab === "add" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 shadow-lg rounded-xl border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-main-darker mb-4">
            Create a New Blog
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="title"
              placeholder="Enter blog title..."
              value={formData.title}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-main-accent"
              required
            />
            <input
              type="text"
              name="tag"
              placeholder="Enter blog tag..."
              value={formData.tag}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-main-accent"
              required
            />
          </div>

          {/* React Quill Text Editor */}
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Blog Description
            </label>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              className="rounded-lg h-52 mb-5"
              theme="snow"
            />
          </div>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-3 rounded-lg w-full mt-10 focus:ring-2 focus:ring-main-accent "
            required
          />

          {/* Custom File Upload */}
          <div className="mt-6 flex flex-col items-center">
            <label className="w-64 h-40 flex flex-col items-center justify-center border-2 border-dashed border-main-accent rounded-lg cursor-pointer hover:bg-main-primary/20 transition">
              <FaCloudUploadAlt className="text-4xl text-main-accent" />
              <span className="mt-2 text-gray-700">Upload Blog Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </label>

            {/* Image Preview */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 w-40 h-40 object-cover rounded-lg shadow-md"
              />
            )}
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-main-accent text-white rounded-lg font-bold hover:bg-main-darker transition"
          >
            {addLoading ? "Adding..." : "Create Blog"}
          </button>
        </form>
      )}

      {/* View Blogs Section */}
      {activeTab === "view" && (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-main-darker mb-4">
            All Blogs
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-main-dark text-white">
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Tag</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs?.map((blog) => (
                  <tr key={blog._id} className="border-b">
                    <td className="py-3 px-6">{blog.title}</td>
                    <td className="py-3 px-6">{blog.tag}</td>
                    <td className="py-3 px-6">
                      {new Date(blog.date).toDateString()}
                    </td>
                    <td className="py-3 px-6 flex items-center gap-3">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(blog._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-main-dark text-white px-3 py-1 rounded"
                        onClick={() => handleNavigate(blog._id)}
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;

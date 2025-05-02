import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import headerimg from "../../assets/images/blogdetail.png";
import { useSelector } from "react-redux";
import moment from "moment";
import { ClipLoader } from "react-spinners";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/blogs/${blogId}`
      );
      setBlogData(response?.data?.blog);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const response = await axios.post(
        `
        ${import.meta.env.VITE_BASE_URL}/blogs/comments`,
        {
          id: blogId,
          text: commentText,
          user: currentUser?.username || "Unknown ",
        }
      );
      fetchBlog();
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading)
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />;
      </div>
    );

  return (
    <div className="flex items-center justify-center lg:mt-8">
      <div className="w-full lg:w-[83%]">
        {/* Header Section */}
        <div className="relative">
          <img
            src={blogData?.bannerImage}
            className="w-full object-cover h-[600px]"
            alt="Blog Header"
          />
          <div className="absolute top-[100px] lg:top-[290px] bg-white p-3 lg:p-6 rounded-lg shadow-md w-[95%] md:w-[50%] lg:w-[450px] mx-2 lg:mx-0 left-24">
            <div className="bg-main-dark px-2 py-1 rounded text-white w-fit">
              {blogData.tag}
            </div>
            <h1 className="text-black lg:text-2xl font-bold mt-3">
              {blogData.title}
            </h1>
            <p className="text-gray-500 text-sm">{blogData.date}</p>
          </div>
        </div>
        {/* Blog Content */}
        <div className="mt-8 lg:mt-16 px-4 lg:px-0">
          <p
            className="leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blogData.description }}
          ></p>
        </div>
        {/* Comments Section */}
        <div className="mt-12 lg:w-[60%]">
          <h2 className="font-semibold text-gray-700 mb-4">Comments</h2>
          {blogData.comments?.length > 0 ? (
            blogData.comments.map((comment, index) => (
              <div key={index} className="border-b pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-gray-800 font-semibold">{comment.user}</p>
                  <p className="text-gray-800 text-sm">
                    {moment(comment.createdAt).format("MMM Do YY")}
                  </p>
                </div>
                <p className="text-gray-600 text-sm">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
        {/* Post Comment Section */}
        <div className="mt-8">
          <h2 className="font-semibold text-black">Post Your Comment</h2>
          <textarea
            className="border rounded-md p-2 w-full h-24 focus:outline-none mt-3"
            placeholder="Write your comment here..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button
            className="bg-main-dark text-white font-bold py-2 px-6 rounded mt-3"
            onClick={handlePostComment}
            disabled={commentLoading}
          >
            {commentLoading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;

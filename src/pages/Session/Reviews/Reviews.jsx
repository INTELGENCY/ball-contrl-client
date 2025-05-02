import React, { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import img from "../../../assets/images/user.jpg";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

// Function to calculate the relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${
      Math.floor(diff / 3600) > 1 ? "s" : ""
    } ago`;
  if (diff < 604800)
    return `${Math.floor(diff / 86400)} day${
      Math.floor(diff / 86400) > 1 ? "s" : ""
    } ago`;

  return new Date(date).toLocaleDateString();
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(10); // Track how many reviews are visible
  const { coachId } = useParams();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BASE_URL
          }/userReview/getReviews?coachId=${coachId}`
        );
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [coachId]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (rating === 0) {
      toast.error("Please select a rating.");
      setLoading(false);
      return;
    }

    if (comment.trim() === "") {
      toast.error("Please write a review.");
      setLoading(false);
      return;
    }

    try {
      const newReview = {
        playerId: currentUser?._id,
        rating,
        review: comment,
        coachId,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/userReview/addReview`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
        }
      );

      if (!response.ok) throw new Error("Failed to add review");

      const savedReview = await response.json();

      // Add the current user's data to the review before updating the state
      const completeReview = {
        ...savedReview,
        player: {
          username: currentUser?.username || "Anonymous",
          profilePicture: currentUser?.profilePicture || img,
        },
      };

      setReviews((prev) => [completeReview, ...prev]);

      setRating(0);
      setComment("");
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to add review:", error);
      toast.error("Failed to submit the review.");
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1);

  // Handle modal opening and background scroll disabling
  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  const loadMoreReviews = () => {
    setVisibleReviewsCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="mt-1">
      <div className="flex items-center mb-4">
        <p className="mr-4 flex gap-2">
          Average Rating <FaStar className="text-yellow-800 text-2xl" />
        </p>
        <div className="relative w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-main-dark"
            style={{ width: `${(averageRating / 5) * 100}%` }}
          ></div>
        </div>
        <p className="ml-4">{averageRating.toFixed(1)} / 5.0</p>
      </div>

      {reviews.slice(0, 5).map((review, index) => (
        <Review key={index} review={review} />
      ))}

      {reviews.length > 4 && (
        <button
          className="text-main-dark cursor-pointer font-semibold border border-main-dark px-6 py-2"
          onClick={openModal}
        >
          Show all reviews
        </button>
      )}

      <form onSubmit={handleAddReview} className="mt-10">
        <h3 className="text-lg font-semibold">Add a Review</h3>
        <StarRatingInput rating={rating} setRating={setRating} />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review"
          className="border border-gray-300 p-2 mb-2 w-full mt-3"
        />
        <button
          type="submit"
          className="bg-main-dark hover:bg-main-darker text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={closeModal}
        >
          <div
            className="bg-gray-100 px-8 pr-10 pt-6 pb-3 shadow-lg relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <FaTimes
              className="absolute top-4 right-4 text-gray-600 cursor-pointer hover:text-main-dark w-5 h-5 transition-all duration-200"
              onClick={closeModal}
            />
            <h3 className="text-lg font-semibold mb-4">More Reviews</h3>
            <div className="overflow-y-auto max-h-[37rem]">
              {reviews.slice(0, visibleReviewsCount).map((review, index) => (
                <Review key={index} review={review} />
              ))}
              {reviews.length > visibleReviewsCount && (
                <button
                  onClick={loadMoreReviews}
                  className="mt-1 mb-4 rounded text-main-dark cursor-pointer font-semibold border border-main-dark px-6 py-2"
                >
                  Show more reviews
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;

const Review = ({ review }) => {
  const renderStars = () =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={i < review?.rating ? "text-yellow-800" : "text-gray-400"}
        />
      ));

  return (
    <div className="border-b-2 border-gray-200 pb-4 mb-4">
      <div className="flex">
        <img
          src={review?.player?.profilePicture || img}
          alt={"Profile photo"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-4">
          <div className="flex items-center gap-4">
            <div className="flex">{renderStars()}</div>
            <p className="text-gray-500 text-[12px] mt-1">
              {getRelativeTime(review?.createdAt)}
            </p>
          </div>
          <p className="text-md font-semibold">{review?.player?.username}</p>
          <p className="text-gray-900 text-[15px]">{review?.review}</p>
          <p></p>
        </div>
      </div>
    </div>
  );
};

const StarRatingInput = ({ rating, setRating }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        onClick={() => setRating(index + 1)}
        className={`cursor-pointer ${
          index < rating ? "text-yellow-800" : "text-gray-400"
        }`}
        aria-label={`Rate ${index + 1} stars`}
      />
    ))}
  </div>
);

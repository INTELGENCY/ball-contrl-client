import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import newLetterImg from "../../assets/NewLetter/my-profit-tutor.jpg";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS
import { useSelector } from "react-redux"; // Import useSelector to access Redux state

const EmailPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Access the currentUser state from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Email validation regex
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is logged in
    if (!currentUser) {
      toast.error("Please login first.");
      return;
    }

    // Validate email length
    if (email.length > 150) {
      toast.error("Email address cannot exceed 150 characters.");
      return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (name.trim().length === 0) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/newsletter/addEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, name }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Successfully subscribed!");
      } else {
        toast.error(data.message || "Error submitting email");
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
      />
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white mx-5 md:mx-0 py-16 md:py-0 shadow-lg w-full max-w-3xl flex flex-col md:flex-row transform transition-transform duration-200 ease-in-out scale-100 opacity-100"
            style={{
              animation: "fadeIn 0.7s ease-in-out, scaleUp 0.5s ease-in-out",
            }}
          >
            {/* Left Side Image */}
            <div className="hidden md:block md:w-1/2">
              <img
                src={newLetterImg}
                alt="News Letter Image..."
                className="w-full h-[76vh] xl-plus:h-[56vh] object-cover bg-center"
              />
            </div>
            {/* Right Side Form */}
            <div className="w-full md:w-1/2 px-10 relative flex flex-col justify-center">
              <button
                className="absolute top-[-40px] md:top-4 right-4 text-gray-600 hover:text-pink-200"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <FaTimes size={24} />
              </button>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Join Ballcontrl!
              </h2>
              <p className="mb-6 text-gray-700">
                Hear about women's football, workshops, events & more exciting
                offers from our Ballcontrl store.
              </p>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border border-gray-300 p-2 w-full mb-4"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border border-gray-300 p-2 w-full mb-4"
                />
                <button
                  type="submit"
                  className="w-full bg-main-dark text-white py-2 hover:bg-main-darker transition duration-200"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-600 mt-4">
                By submitting this form, you agree that your information can be
                processed in accordance with our{" "}
                <span className="text-main-darker underline cursor-pointer">
                  Privacy Policy
                </span>{" "}
                . You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailPopup;

import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { loadStripe } from "@stripe/stripe-js";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE);

const CoachSessions = ({ coachId }) => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState([]);
  const [getBookingDetails, setGetBookingDetails] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const playerId = currentUser._id;

  const getSessionData = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/coach/getsessionbycoachid/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(data);
        setImageLoading(new Array(data.length).fill(true)); // Initialize loading state
      } else {
        throw new Error("Failed to fetch session data");
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBookedData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/bookedsession/getdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGetBookingDetails(
          data.map((item) => ({
            sessionId: item.selectedSessionId,
            playerId: item.playerId,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (coachId) {
      getSessionData(coachId);
    }
    getBookedData(); // Fetch booked data on component mount
  }, [coachId]);
  console.log(formData);

  const checkBookingExists = (sessionId) => {
    return getBookingDetails.some((booking) => booking.sessionId === sessionId && booking.playerId === playerId);
  };

  const handlePayment = async (sessionDetails) => {
    if (checkBookingExists(sessionDetails._id)) {
      toast.info("You have already booked this session.");
      return;
    }

    const stripe = await stripePromise;

    const body = {
      coachName: sessionDetails.coachName,
      sessionName: sessionDetails.title,
      location: sessionDetails.location,
      price: sessionDetails.price,
      startDate: sessionDetails.startDate,
      endDate: sessionDetails.endDate,
      time: sessionDetails.time,
      category: sessionDetails.category,
      coachId: sessionDetails.coachId,
      selectedSessionId: sessionDetails._id,
      sessionImage: sessionDetails.image,
      playerId: playerId,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/create-checkout-session`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const CustomLeftArrow = ({ onClick }) => {
    return (
      <button type="button" onClick={onClick} className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-main-dark text-white rounded-full">
        <FaChevronLeft />
      </button>
    );
  };

  const CustomRightArrow = ({ onClick }) => {
    return (
      <button type="button" onClick={onClick} className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-main-dark text-white rounded-full">
        <FaChevronRight />
      </button>
    );
  };

  const titleLength = (string, maxLength = 38) => {
    if (string.length > maxLength) {
      return string.slice(0, maxLength) + "...";
    }
    return string;
  };

  const handleImageLoad = (index) => {
    setImageLoading((prevLoading) => {
      const newLoading = [...prevLoading];
      newLoading[index] = false;
      return newLoading;
    });
  };

  return (
    <div className="pt-4 relative">
      <h1 className="text-[20px] font-bold">Available Sessions</h1>
      <div className="w-[100%] pt-2 mx-auto">
        <div className="xl:w-[100%] mx-auto">
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader color="#FF6AB9" />
            </div>
          ) : formData.length === 0 ? (
            <p className="w-full text-xl text-gray-500">No sessions added yet</p>
          ) : (
            <Carousel responsive={responsive} customLeftArrow={<CustomLeftArrow />} customRightArrow={<CustomRightArrow />}>
              {formData.map((data, index) => (
                <div key={data._id} className="mx-auto w-[95%] flex flex-col pb-4 mb-6 gap-3 rounded-lg shadow-md border border-main-primary">
                  <div className="relative flex justify-center items-center p-4 h-[300px]">
                    {/* Adjust the height as needed */}
                    {imageLoading[index] && <ClipLoader color="#FF6AB9" className="absolute" />}
                    <img
                      src={data?.image}
                      width="100%"
                      height="100%" // Adjust this height or remove it
                      alt="data_image"
                      className={`object-cover h-full w-full ${imageLoading[index] ? "opacity-0" : "opacity-100"}`}
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageLoad(index)}
                      onLoadStart={() =>
                        setImageLoading((prev) => {
                          const newLoading = [...prev];
                          newLoading[index] = true;
                          return newLoading;
                        })
                      }
                    />
                  </div>
                  <h1 className="text-[22px] px-4 leading-7 lg:h-[55px] font-semibold">{titleLength(data?.title)}</h1>
                  <h1 className="font-regular px-4">
                    {" "}
                    <span className="font-semibold">Category</span>: {data?.category}
                  </h1>
                  <p className="text-[#7D8FA9] px-4 text-[14px]">{data?.description}</p>
                  <p className="text-[#0d0d0e] px-4 text-[14px]">
                    <span className="font-bold">Price:</span> ${data?.price}
                  </p>
                  <p className="text-[#0c0c0c] px-4 capitalize text-[14px]">
                    <span className="font-bold">Location:</span> {data?.location}
                  </p>
                  <p className="text-[#111111] px-4 text-[14px]">
                    <span className="font-bold">Age Group:</span> {data?.agegroup}
                  </p>
                  <p className="text-[#111111] px-4 text-[14px]">
                    <span className="font-bold">Time:</span> {data?.time}
                  </p>
                  <p className="text-[#19191a] px-4 text-[14px]">
                    <span className="font-bold">Start Date:</span> {data?.startDate}
                  </p>
                  <p className="text-[#19191a] px-4 text-[14px]">
                    <span className="font-bold">End Date:</span> {data?.endDate}
                  </p>
                  <button className="bg-main-dark hover:bg-main-accent text-white w-[90%] mx-auto rounded-lg h-[40px]" onClick={() => handlePayment(data)}>
                    Book Session
                  </button>
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachSessions;

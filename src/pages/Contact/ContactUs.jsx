import { Typography } from "@material-tailwind/react";
import React, { useState } from "react";
import contactus from "../../assets/images/contactus (5).jpg";
import SectionWrapper from "../../Components/Wrapper/SectionWrapper";
import axios from "axios";
import { BaseUrl } from "../../keys";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else {
      newErrors.firstName = "";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
      isValid = false;
    } else {
      newErrors.phone = "";
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    } else {
      newErrors.subject = "";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
      isValid = false;
    } else {
      newErrors.message = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // const response = await axios.post(
      //   `${BaseUrl}/admin/contactUs`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      toast.success("You data submitted successfully");

      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        firstName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error while submitting data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="relative w-full flex items-center justify-center">
        <img
          src={contactus}
          alt="headerimage"
          className="md:h-[600px] w-full h-[280px] object-cover"
        />
        <p className="absolute text-white md:text-mianheading font-bold text-[25px]">
          Contact Us
        </p>
      </div>

      <SectionWrapper
        justifyContent={"center"}
        alignItems={"center"}
        margin={"mt-[2rem]"}
        direction={"col"}
        gap={"gap-3"}
      >
        {submitSuccess && (
          <div className="w-full max-w-2xl p-4 mb-6 bg-green-100 text-green-700 rounded-lg">
            Thank you for your message! We'll get back to you soon.
          </div>
        )}

        {/* contact us form  */}
        <div className="w-full rounded-lg px-8 py-14 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] mt-6">
          <Typography variant="h5">Contact Us</Typography>
          <form
            onSubmit={handleSubmit}
            className="w-full mt-6 flex flex-wrap justify-between gap-4"
            noValidate
          >
            <div className="flex flex-col md:w-[48%] w-full">
              <Typography variant="h6">First Name*</Typography>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${
                  errors.firstName ? "border-red-500" : "border-main-dark"
                }`}
                placeholder="First Name"
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className="flex flex-col md:w-[48%] w-full">
              <Typography variant="h6">Subject*</Typography>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${
                  errors.subject ? "border-red-500" : "border-main-dark"
                }`}
                placeholder="Subject"
              />
              {errors.subject && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.subject}
                </span>
              )}
            </div>

            <div className="flex flex-col md:w-[48%] w-full">
              <Typography variant="h6">Email Address*</Typography>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${
                  errors.email ? "border-red-500" : "border-main-dark"
                }`}
                placeholder="Enter Email Address"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col md:w-[48%] w-full">
              <Typography variant="h6">Phone Number*</Typography>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${
                  errors.phone ? "border-red-500" : "border-main-dark"
                }`}
                placeholder="Phone Number"
              />
              {errors.phone && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="flex flex-col w-full">
              <Typography variant="h6">Message*</Typography>
              <textarea
                rows="4"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`w-full py-2 px-3 border ${
                  errors.message ? "border-red-500" : "border-main-dark"
                } focus:border-main-dark focus:ring-0 focus:outline-none focus:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]`}
                placeholder="Message"
              />
              {errors.message && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.message}
                </span>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`mt-2 text-sm bg-main-dark text-white rounded-lg py-3 px-3 hover:bg-main-primary duration-300 hover:text-black ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Submitting..." : "Submit Message"}
              </button>
            </div>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
};

export default ContactUs;

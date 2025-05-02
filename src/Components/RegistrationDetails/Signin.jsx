import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      dispatch(signInStart());

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message || "Sign in failed.");
        return;
      }

      dispatch(signInSuccess(data));
      toast.success("Logged in successfully!");

      if (data.userType === "Coach") {
        navigate("/");
      } else {
        navigate("/coaches");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error("An error occurred. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:w-[78%] w-full mx-auto py-1 gap-3">
          <label htmlFor="email" className="py-1">
            Email<span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            className="rounded-[10px] px-5 border border-main-dark py-[9px] w-full focus:shadow-sm"
            placeholder="Enter your Email"
            required
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col md:w-[78%] mx-auto py-[9px] w-full">
          <label htmlFor="password" className="py-1">
            Password<span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              className="rounded-[10px] px-5 border border-main-dark py-[9px] w-full focus:shadow-sm"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              required
              id="password"
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 mr-3 mt-[10px] focus:outline-none bottom-[7px]"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between md:w-[78%] w-full mx-auto py-1">
          <div className="flex items-center">
            <input type="checkbox" id="showPassword" className="mr-2" />
            <button className="text-main-dark">Remember Me</button>
          </div>
          <button
            type="button"
            onClick={() => {
              navigate("/forgot-password");
            }}
            className="text-main-dark"
          >
            Forgot Password?
          </button>
        </div>
        <div className="text-center pt-2">
          <button
            className="border rounded-[10px] py-[10px] md:w-[78%] w-full text-white bg-main-dark hover:bg-main-darker duration-300"
            disabled={loading}
          >
            {loading ? <span className="pl-3">Loading...</span> : "Log In"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Signin;

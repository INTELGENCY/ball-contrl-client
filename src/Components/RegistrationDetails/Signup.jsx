import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Alert } from "@material-tailwind/react";
import { toast } from "react-toastify";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [errormessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cnfrmPassword: "",
    userType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      !formData.cnfrmPassword ||
      !formData.userType
    ) {
      return setErrorMessage("Please fill out all the fields.");
    }

    if (formData.password !== formData.cnfrmPassword) {
      return setErrorMessage("Passwords do not match.");
    }

    try {
      setErrorMessage(null);
      dispatch(signInStart());
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error(data.message || "Something went wrong");
        return setErrorMessage(data.message);
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        if (formData.userType === "Coach") {
          navigate("/addprofile");
        } else {
          navigate("/coaches");
        }
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      setErrorMessage(error.message);
      toast.error(error.message || "Something went wrong");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:w-[78%] mx-auto py-[9px] w-full">
          <label htmlFor="userType" className="py-1">
            User Type<span className="text-red-400">*</span>
          </label>
          <select
            id="userType"
            className="rounded-[10px] px-5 border border-main-dark py-[9px] w-full focus:shadow-sm"
            required
            onChange={handleChange}
          >
            <option value="" disabled selected>
              Select your user type
            </option>
            <option value="Coach">Coach</option>
            <option value="Player">Player</option>
            <option value="Parent">Parent</option>
          </select>
        </div>
        <div className="flex flex-col md:w-[78%] mx-auto py-[9px] w-full">
          <label htmlFor="email" className="py-1">
            Email Address<span className="text-red-400">*</span>
          </label>
          <input
            className="rounded-[10px] px-5 border border-main-dark py-[9px] w-full focus:shadow-sm"
            type="email"
            id="email"
            placeholder="Enter your Email Address"
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
              {showPassword ? <BsEye /> : <BsEyeSlash />}
            </button>
          </div>
        </div>
        <div className="flex flex-col md:w-[78%] mx-auto py-[9px] w-full">
          <label htmlFor="cnfrmPassword" className="py-1">
            Confirm Password<span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              className="rounded-[10px] px-5 border border-main-dark py-[9px] w-full focus:shadow-sm"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your Password"
              required
              id="cnfrmPassword"
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 mr-3 mt-[10px] focus:outline-none bottom-[7px]"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <BsEye /> : <BsEyeSlash />}
            </button>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            className="border rounded-[10px] py-[10px] md:w-[78%] w-full
             text-white bg-main-dark hover:bg-main-darker duration-300"
            disabled={loading}
          >
            {loading ? <>Loading...</> : "Register"}
          </button>
        </div>
      </form>
      {/* {errormessage && <Alert className="mt-5">{errormessage}</Alert>} */}
    </>
  );
};

export default Signup;

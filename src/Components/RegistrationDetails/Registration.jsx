import React, { useState } from "react";
import rimg from "../../assets/images/login.jpg";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import Signup from "./Signup";
import Signin from "./Signin";
import swap_Image from "../../assets/png/rethaferguson-3886279.jpg";
const Registration = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userType: "",
    email: "",
    password: "",
    cnfrmPassword: "",
  });

  console.log(formData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const data = await signUp(formData);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (data.success) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  const handleToggle = () => {
    setIsRegistering(!isRegistering);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full  mb-14">
      <div className="px-[10px] lg:pl-[40px] w-[100%] mx-auto   rounded-lg">
        <div className="flex justify-between lg:flex-row flex-col ">
          {/* Right side - Form */}
          <div className=" md:w-[40%] w-full mt-20 md:p-1 p-[4px]">
            <h1 className="text-center pt-3">{!isRegistering ? "Register form" : "Login form"}</h1>
            {/* Toggle button */}
            <div className="border border-main-dark rounded-[10px] flex justify-between mx-auto relative w-[289px] mt-5">
              <div
                className={`bg-main-dark absolute py-3 px-8 ${!isRegistering ? "left-[9rem]" : "left-0"} rounded-[10px] h-full w-[50%] duration-500 -z-10`}
              ></div>
              <button className={`py-3 px-10  rounded-[10px] ${!isRegistering ? "" : ""}`} onClick={handleToggle}>
                Login
              </button>
              <button className={`py-3 px-8  rounded-[10px] ${isRegistering ? " " : ""}`} onClick={handleToggle}>
                Register
              </button>
            </div>

            {/* Register form */}
            <div className={`${isRegistering ? "hidden" : "mt-4"}`}>
              <Signup />
            </div>
            {/* login form fields */}
            <div className={`${isRegistering ? "mt-10" : "hidden"}`}>
              <Signin />
            </div>
          </div>
          {/* ---- */}
          {/* Left side - Image */}

          <div className="md:w-[60%] relative w-full md:block hidden">
            <div className="image-container">
              <img src={swap_Image} alt="cta coaching" className="w-[670px]  opacity-90 h-[90vh] " />
              <h1 className="absolute top-44 text-white bottom-0 left-0 right-0 text-[72px] font-bold text-center">
                JOIN OUR <br /> COMMUNITY <br /> AND LET'S <br />
                <span className="text-[36px] font-normal">GET PLAYING FOOTBALL</span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;

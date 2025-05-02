import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert } from "@material-tailwind/react";
import axios from "axios";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../../redux/user/userSlice";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      dispatch(signInStart());
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/adminlogin`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!data || data.success === false) {
        dispatch(signInFailure(data.message || "Login failed"));
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      dispatch(signInSuccess(data));
      navigate("/admin");
    } catch (error) {
      dispatch(
        signInFailure(error.response?.data?.message || "Something went wrong")
      );

      Swal.fire({
        title: error.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#1f2937",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex flex-col w-[100%] md:w-[90%] lg:w-[80%] xl:w-[60%] m-auto h-screen justify-center items-center">
        <h1 className="text-center shadow-xl underline font-bold text-gray-800 text-3xl mb-3">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="w-[90%] lg:w-[80%] xl:w-[70%]">
          <div className="flex flex-col mx-auto py-5 gap-3">
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
          <div className="flex flex-col mx-auto py-[9px]">
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
          <div className="text-center pt-4">
            <button
              className="border rounded-[10px] py-[10px] w-full text-white bg-main-dark hover:bg-main-darker duration-300 "
              disabled={loading}
            >
              {loading ? <span className="pl-3">Loading...</span> : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;

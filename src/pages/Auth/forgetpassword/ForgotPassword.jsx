import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { sendResetPasswordEmail } from "../../../services/AuthApis";

const ForgotPassword = ({ onOtpSuccess, setUserRole }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // added role state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleError, setRoleError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setUserRole(e.target.value);
    setRoleError("");
  };

  const validateForm = () => {
    let valid = true;

    if (!email.trim()) {
      setError("Email is required.");
      valid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError("Invalid email address.");
      valid = false;
    }

    if (!role) {
      setRoleError("Please select your role.");
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await sendResetPasswordEmail(email, role);
      toast.success("OTP sent successfully!");
      onOtpSuccess(email, role); // pass role to next step
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white relative px-4 bg-gradient-to-tr from-main-primary to-main-ligther">
      <Toaster />

      <div className="bg-white max-w-md w-full p-6 rounded-xl shadow-lg z-10 text-center">
        <h1 className="text-2xl font-bold mb-2 text-main-darker">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Enter your registered email to receive the OTP.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-main-darker"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
                error
                  ? "border-custom-red focus:ring-custom-red"
                  : "border-main-accent focus:ring-main-accent"
              }`}
              value={email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {error && <p className="text-custom-red text-xs mt-1">{error}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium mb-1 text-main-darker"
            >
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
                roleError
                  ? "border-custom-red focus:ring-custom-red"
                  : "border-main-accent focus:ring-main-accent"
              }`}
            >
              <option value="">-- Select Role --</option>
              <option value="player">Player</option>
              <option value="coach">Coach</option>
            </select>
            {roleError && (
              <p className="text-custom-red text-xs mt-1">{roleError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-md transition-all ${
              loading
                ? "bg-main-primary opacity-70 cursor-not-allowed"
                : "bg-main-accent hover:bg-main-dark"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-2 text-sm text-gray-400">Or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <a
          href="/register"
          className="text-sm text-main-darker hover:underline"
        >
          Remembered your password? Sign In
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;

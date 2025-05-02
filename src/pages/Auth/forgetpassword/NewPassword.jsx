import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { updatePassword } from "../../../services/AuthApis";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const NewPassword = ({ email, role }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const validatePassword = () => {
    const errors = {};
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) return;
    setLoading(true);
    try {
      await updatePassword(email, password, confirmPassword, role);
      setLoading(false);
      navigate("/register");
    } catch (err) {
      console.error(err);
      setError({ apiError: "Failed to update password. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-main-lighter">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold text-main-accent text-center mb-4">
          Reset Your Password
        </h2>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-main-dark mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError((prev) => ({ ...prev, password: "" }));
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error.password
                  ? "border-main-accent focus:ring-main-accent"
                  : "border-main-dark focus:ring-main-accent"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-main-dark"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {error.password && (
            <p className="text-main-accent text-xs mt-1">{error.password}</p>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-main-dark mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                error.confirmPassword
                  ? "border-main-accent focus:ring-main-accent"
                  : "border-main-dark focus:ring-main-accent"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-main-dark"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {error.confirmPassword && (
            <p className="text-main-accent text-xs mt-1">
              {error.confirmPassword}
            </p>
          )}
        </div>

        {error.apiError && (
          <p className="text-main-accent text-sm mb-4">{error.apiError}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-main-accent hover:bg-main-dark text-white font-semibold py-2 px-4 rounded-md transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default NewPassword;

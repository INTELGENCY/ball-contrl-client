import React, { useState } from "react";
import toast from "react-hot-toast";
import { sendResetPasswordEmail, verifyOtp } from "../../../services/AuthApis";

const OtpVerification = ({ email, onVerificationSuccess, role }) => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDigitChange = (index, value) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    if (value && index < otpDigits.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtpDigits(pastedData.split(""));
      setError("");
      document.getElementById("otp-input-5").focus();
    } else {
      setError("Invalid OTP. Please paste exactly 6 digits.");
    }
  };

  const handleOtpSubmit = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(otp, email, role);
      onVerificationSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await sendResetPasswordEmail(email, role);
      toast.success("OTP resent successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-lighter px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-main-accent mb-2">
          Enter 6 Digit Code
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          We've sent a verification code to your email.
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) =>
                handleDigitChange(index, e.target.value.replace(/\D/, ""))
              }
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-12 text-center text-lg border-2 rounded-md outline-none transition-all duration-200
                ${
                  error
                    ? "border-main-accent"
                    : "border-main-dark focus:border-main-accent"
                } bg-main-lighter`}
            />
          ))}
        </div>

        {error && <p className="text-main-accent text-xs mb-4">{error}</p>}

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="text-main-accent border border-main-dark hover:bg-main-lighter transition px-4 py-2 rounded-md text-sm"
          >
            {resendLoading ? "Resending..." : "Didn't get it? Resend Code"}
          </button>

          <button
            onClick={handleOtpSubmit}
            disabled={loading}
            className="bg-main-accent text-white hover:bg-main-dark transition px-6 py-2 rounded-md text-sm w-full"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;

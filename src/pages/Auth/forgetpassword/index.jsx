import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import NewPassword from "./NewPassword";
import OtpVerification from "./OtpVerification";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState("forgotPassword"); // 'forgotPassword', 'otpVerification', or 'newPassword'
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [searchParams] = useSearchParams();

  const handleOtpSuccess = (email) => {
    setEmail(email);
    setStep("otpVerification");
  };

  const handlePasswordReset = () => {
    setStep("newPassword");
  };
  const handleSetRole = (role) => {
    setRole(role);
  };
  return (
    <>
      {step === "forgotPassword" && (
        <ForgotPassword
          onOtpSuccess={handleOtpSuccess}
          setUserRole={handleSetRole}
        />
      )}
      {step === "otpVerification" && (
        <OtpVerification
          email={email}
          role={role}
          onVerificationSuccess={handlePasswordReset}
        />
      )}
      {step === "newPassword" && <NewPassword email={email} role={role} />}
    </>
  );
};

export default ForgotPasswordPage;

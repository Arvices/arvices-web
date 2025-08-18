import React, { useState } from "react";
import { Input } from "antd";
import { useLoading } from "../../contexts/LoadingContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import {
  resendAccountVerificationMail,
  verifyAccount,
} from "../../api-services/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
const AccountVerification: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [SearchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = SearchParams.get("email");
  const { setLoading, setLoadingText } = useLoading();
  const notify = useNotificationContext();
  const handleVerify = async () => {
    console.log("Verify with OTP:", otp);
    try {
      setLoading(true);
      setLoadingText("Verifying your account...");
      const response = await verifyAccount({
        email: email as string,
        verificationCode: Number(otp),
      });
      console.log("Verification success:", response);
      notify.openNotification(
        "topRight",
        "Verification Successful",
        "Your account has been verified. You may now login",
        "success",
      );
      navigate("/login");
    } catch (error: any) {
      console.error("Verification error:", error);
      notify.openNotification(
        "topRight",
        "Verification Failed",
        error?.response?.data?.message ||
          "An error occurred during verification.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  const handleResendVerification = async () => {
    try {
      setLoading(true);
      setLoadingText("Resending verification email...");
      const response = await resendAccountVerificationMail(email as string);
      console.log("Resend verification success:", response);
      notify.openNotification(
        "topRight",
        "Email Sent",
        "A new verification email has been sent to your inbox.",
        "success",
      );
    } catch (error: any) {
      console.error("Resend verification error:", error);
      notify.openNotification(
        "topRight",
        "Error",
        error?.response?.data?.message ||
          "Failed to resend verification email.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  return (
    <section className="min-h-screen pt-13 text-royalblue-shade4">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        <div className="max-w-[500px] mx-auto mt-10 ">
          <h1 className="text-4xl mt-20 font-medium text-center text-gray-900 mb-6">
            Verify Your Account
          </h1>
          <p className="text-gray-500 mb-6 text-center">
            Enter the 6-digit code sent to your email.
          </p>
          <div className=" w-max mx-auto mb-5">
            <Input.OTP
              length={6}
              value={otp}
              onChange={setOtp}
              className="mb-6 h-10"
            />
          </div>
          <div className="mb-10 text-center">
            <p>
              Didn't get any mail?{" "}
              <span
                onClick={handleResendVerification}
                className="font-medium tracking-tight cursor-pointer"
              >
                Resend Verification Code
              </span>
            </p>
          </div>
          <button
            onClick={handleVerify}
            disabled={otp.length < 6}
            className="w-full bg-gray-900 text-white p-3 rounded cursor pointer"
          >
            Verify Account
          </button>
        </div>
      </div>
    </section>
  );
};
export default AccountVerification;

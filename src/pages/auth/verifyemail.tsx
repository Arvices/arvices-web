// AccountVerification.tsx
import React, { useState } from "react";
import { Input } from "antd";

const AccountVerification: React.FC = () => {
  const [otp, setOtp] = useState("");

  const handleVerify = () => {
    console.log("Verify with OTP:", otp);
    // Verify OTP API call
  };

  return (
    <section className="min-h-screen pt-13 text-royalblue-shade4">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        <div className="max-w-[500px] mx-auto mt-10">
          <h1 className="text-4xl font-medium text-center text-royalblue-shade3 mb-6">Verify Your Account</h1>
          <p className="text-gray-500 mb-6 text-center">Enter the 6-digit code sent to your email.</p>
          <div className=" w-max mx-auto mb-10">

          <Input.OTP
            length={6}
            value={otp}
            onChange={setOtp}
            className="mb-6 p-3"
          />
          </div>
          <button
            onClick={handleVerify}
            className="w-full bg-royalblue-main text-white p-3 rounded cursor pointer"
          >
            Verify Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default AccountVerification;

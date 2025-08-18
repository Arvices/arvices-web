// ForgotPassword.tsx
import React, { useState } from "react";
import { useLoading } from "../../contexts/LoadingContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import validator from "validator";
import { forgotPassword } from "../../api-services/auth";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const { setLoading, setLoadingText } = useLoading();
  const notify = useNotificationContext();

  const validateForm = (): boolean => {
    let valid = true;

    // Validate Email
    if (!email.trim()) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Email is required.",
        "error",
      );
      valid = false;
    } else if (!validator.isEmail(email)) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Please enter a valid email address.",
        "error",
      );
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = validateForm();
    if (!valid) return;
    console.log("Send reset email to:", email);
    // Add your API call here
    try {
      setLoading(true);
      setLoadingText("Sending reset email");
      let response = await forgotPassword({ email });
      notify.openNotification(
        "topRight",
        "Success",
        "A verification mail has been sent to you. Follow the instructions to recover your password",
        "success",
      );
      console.log("forgotpassword response:- ", response);
    } catch (err: any) {
      //
      let message = err?.message || "unknown error";
      notify.openNotification("topRight", "Failed", message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-13 text-royalblue-shade4">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        <div className="max-w-[500px] mx-auto mt-10">
          <h1 className="text-4xl  mt-20 font-medium text-center text-royalblue-shade3 mb-4">
            Forgot Password
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Enter your email to receive a password reset link.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-13 px-4 border rounded border-gray-300 w-full mt-2 mb-5"
              placeholder="eg. me@mail.com"
            />
            <button
              type="submit"
              className="w-full bg-royalblue-main text-white p-3 rounded"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;

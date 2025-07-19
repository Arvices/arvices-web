// ResetPassword.tsx
import React, { useState } from "react";
import { PasswordInput } from "../../components/input";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { passwordReset, PasswordResetBody } from "../../api-services/auth";
import { useLoading } from "../../contexts/LoadingContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const [passwords, setPasswords] = useState({
    password: "",
    confirm: "",
  });

  const notify = useNotificationContext();
  const { setLoading, setLoadingText } = useLoading();
  const navigate = useNavigate();

  const [SearchParams] = useSearchParams();
  const token = SearchParams.get("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;

    // Validate Password
    if (!passwords.password) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Password is required.",
        "error",
      );
      valid = false;
    } else if (passwords.password.length < 8) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Password must be at least 8 characters long.",
        "error",
      );
      valid = false;
    } else if (
      !/[a-zA-Z]/.test(passwords.password) ||
      !/[0-9]/.test(passwords.password)
    ) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Password must contain both letters and numbers.",
        "error",
      );
      valid = false;
    }

    // Validate Password Confirmation
    if (passwords.password !== passwords.confirm) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Passwords do not match.",
        "error",
      );
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = validateForm();
    if (!valid) return;
    let data: PasswordResetBody = {
      password: passwords.password,
      token: token as string,
    };
    try {
      setLoading(true);
      setLoadingText("Resetting Password");
      let response = await passwordReset(data);
      notify.openNotification(
        "topRight",
        "Success",
        "Reset Successful. Login with your new password",
        "success",
      );
      console.log("passwordreset response:- ", response);
      navigate("/login");
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
          <h1 className="text-4xl font-medium text-center text-royalblue-shade3 mb-4">
            Reset Password
          </h1>

          <form onSubmit={handleSubmit}>
            <label className="text-gray-600 block py-2">
              Enter your new password
            </label>
            <PasswordInput
              name="password"
              placeholder="New Password"
              value={passwords.password}
              onChange={handleChange}
              className="h-13 px-4 border rounded border-gray-300 w-full mb-3"
            />
            <label className="text-gray-600 block py-2 mt-1">
              Confirm Password
            </label>
            <PasswordInput
              name="confirm"
              placeholder="Confirm Password"
              value={passwords.confirm}
              onChange={handleChange}
              className="h-13 px-4 border rounded border-gray-300 w-full mb-6"
            />

            <button
              type="submit"
              className="cursor-pointer w-full bg-royalblue-main text-white p-3 rounded"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;

// ResetPassword.tsx
import React, { useState } from "react";
import { PasswordInput } from "../../components/input";

const ResetPassword: React.FC = () => {
  const [passwords, setPasswords] = useState({
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirm) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password Reset:", passwords.password);
    // Reset password API call
  };

  return (
    <section className="min-h-screen pt-13 text-royalblue-shade4">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        <div className="max-w-[500px] mx-auto mt-10">
          <h1 className="text-4xl font-medium text-center text-royalblue-shade3 mb-4">Reset Password</h1>

          <form onSubmit={handleSubmit}>
            <PasswordInput
              name="password"
              placeholder="New Password"
              value={passwords.password}
              onChange={handleChange}
              className="h-13 px-4 border rounded border-gray-300 w-full mb-6"
            />
            <PasswordInput
              name="confirm"
              placeholder="Confirm Password"
              value={passwords.confirm}
              onChange={handleChange}
              className="h-13 px-4 border rounded border-gray-300 w-full mb-6"
            />
            <button type="submit" className="cursor-pointer w-full bg-royalblue-main text-white p-3 rounded">Reset Password</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;

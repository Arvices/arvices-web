// ForgotPassword.tsx
import React, { useState } from "react";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Send reset email to:", email);
    // Add your API call here
  };

  return (
    <section className="min-h-screen pt-13 text-royalblue-shade4">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        <div className="max-w-[500px] mx-auto mt-10">
          <h1 className="text-4xl font-medium text-center text-royalblue-shade3 mb-4">
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

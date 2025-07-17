import React, { useState } from "react";
import { MyCustomGoogleLogin } from "./signup";
import { Link } from "react-router-dom";
import { PasswordInput } from "../../components/input";

interface LoginFormState {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    } else {
      throw new Error("Supply Input Name to make updates to Signup Form");
    }
  };

  const validateForm = () => {};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting form", loginForm);
  };
  return (
    <section className="min-h-screen pt-13 text-royalblue-shade4">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Page Starts - Page Header*/}
        <div className="max-w-[500px] mx-auto mt-10 mb-15">
          <div className="text-center max-w-[500px] mx-auto mt-10">
            <h1 className="tracking-tighter text-royalblue-shade3 leading-[140%] text-4xl md:text-5xl lg:text-6xl font-medium pb-4">
              Login
            </h1>
            <p className="text-gray-500">
              Please input your valid signin Credentials
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mt-8">
              <label
                htmlFor="email"
                className="text-royalblue-shade3 mb-3 inline-block"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                required
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                placeholder="eg. me@mail.com"
                value={loginForm.email}
                onChange={handleInputChange}
                className="h-13 px-4 border rounded border-gray-300 w-full active:border-gray-100 focus:border-gray-200"
              />
            </div>

            <div className="mt-8">
              <label
                htmlFor="password"
                className="text-royalblue-shade3 mb-3 inline-block"
              >
                Password
              </label>
              <PasswordInput
                name="password"
                placeholder="Enter Password"
                required
                value={loginForm.password}
                onChange={handleInputChange}
                className="h-13 px-4 border rounded border-gray-300 w-full active:border-gray-100 focus:border-gray-200"
              />
            </div>

            <div className="mt-14">
              <button className="w-full bg-royalblue-main text-white p-3 rounded cursor-pointer">
                Login
              </button>
            </div>
          </form>
          <div className="text-sm text-center text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up Here
            </Link>
          </div>
          <div className="text-sm text-center text-gray-600 mt-4">
            <Link
              to="/forgot-password"
              className="text-blue-600 font-medium hover:underline"
            >
              Forgot Password?
            </Link>
                        <Link
              to="/resetpassword"
              className="text-blue-600 font-medium hover:underline"
            >
              Password Reset
            </Link>
                        <Link
              to="/verify-email"
              className="text-blue-600 font-medium hover:underline"
            >
              Account Verification
            </Link>
                        <Link
              to="/complete-profile"
              className="text-blue-600 font-medium hover:underline"
            >
              Complete Profile
            </Link>
          </div>
          <div className="mt-10 mb-5 border-t border-gray-300" />
          <div className="py-2 text-center">
            <p className="text-sm text-gray-500 mb-5"> Or Continue With</p>
            {/* Google Auth Button */}
            <MyCustomGoogleLogin />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

import React, { useState } from "react";
import { MyCustomGoogleLogin } from "./signup";
import { Link, useNavigate } from "react-router-dom";
import { PasswordInput } from "../../components/input";
import validator from "validator";
import { useLoading } from "../../contexts/LoadingContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import {
  loginEmailAndPassword,
  LoginEmailAndPasswordBody,
  resendAccountVerificationMail,
} from "../../api-services/auth";
import { useAuth } from "../../contexts/AuthContext";

interface LoginFormState {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setLoading, setLoadingText } = useLoading();

  const notify = useNotificationContext();
  let auth = useAuth();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setLoginForm((prev) => ({ ...prev, [name]: value }));
    } else {
      throw new Error("Supply Input Name to make updates to Signup Form");
    }
  };

  const validateForm = (): boolean => {
    let valid = true;

    // Validate Email
    if (!loginForm.email.trim()) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Email is required.",
        "error",
      );
      valid = false;
    } else if (!validator.isEmail(loginForm.email)) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Please enter a valid email address.",
        "error",
      );
      valid = false;
    }

    // Validate Password
    if (!loginForm.password) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Password is required.",
        "error",
      );
      valid = false;
    } else if (loginForm.password.length < 8) {
      notify.openNotification(
        "topRight",
        "Validation Error",
        "Password must be at least 8 characters long.",
        "error",
      );
      valid = false;
    }

    return valid;
  };
  const handleResendVerification = async () => {
    try {
      const response = await resendAccountVerificationMail(
        loginForm.email as string,
      );
      console.log("Resend verification success:", response);

      notify.openNotification(
        "topRight",
        "Email Sent",
        "A new verification email has been sent to your inbox.",
        "success",
      );
    } catch (error: any) {
      console.error("Resend verification error:", error);
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = validateForm();
    if (!valid) return;
    let data: LoginEmailAndPasswordBody = {
      email_or_phonenumber: loginForm.email,
      password: loginForm.password,
    };

    try {
      setLoading(true);
      setLoadingText("Logging You In");
      let response = await loginEmailAndPassword(data);
      console.log("login response:- ", response);
      auth.login(
        response.response.access_token,
        loginForm.email,
        String(0),
        "Client",
      );
      notify.openNotification(
        "topRight",
        "Success",
        "Login Successful.",
        "success",
      );
    } catch (err: any) {
      //
      let message = err?.message || "unknown error";
      if (message === "Account not verified") {
        notify.openNotification(
          "topRight",
          "Failed",
          "Account Not Verified, You will be redirected to the verification page to continue your verification process",
          "warning",
        );
        navigate(`/verify-email?email=${loginForm.email}`);
        handleResendVerification();
        return;
      }
      notify.openNotification("topRight", "Failed", message, "error");
    } finally {
      setLoading(false);
    }
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

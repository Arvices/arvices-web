import React, { useState } from "react";
import { AccountTypeVal, useAuth } from "../../contexts/AuthContext";
//import validator from "validator";
//import { useLoading } from "../../contexts/LoadingContext";
import { PasswordInput } from "../../components/input";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import googleLogo from "../../assets/images/google-icon-logo-svgrepo-com.svg";

interface SignupFormState {
  fullName: string;
  email: string;
  accountType: AccountTypeVal;
  password: string;
  passwordConfirm: string;
  address: string;
}

export const MyCustomGoogleLogin = () => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse); // contains access_token
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <button
      onClick={() => login()}
      className="border border-gray-200 font-medium py-2 px-4 rounded"
    >
      <img src={googleLogo} className="inline-block w-5 h-5 mr-2" />
      Continue with Google
    </button>
  );
};

const Signup: React.FC = () => {
  //  let { setLoading, setLoadingText } = useLoading();
  let auth = useAuth();
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [signupForm, setSignupForm] = useState<SignupFormState>({
    fullName: "",
    email: "",
    accountType: "",
    password: "",
    passwordConfirm: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setSignupForm((prev) => ({ ...prev, [name]: value }));
    } else {
      throw new Error("Supply Input Name to make updates to Signup Form");
    }
  };

  const validateForm = () => {};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting form", signupForm);
  };
  return (
    <section className="min-h-screen pt-13 pb-15">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Page Starts*/}
        <div className="max-w-[500px] mx-auto mt-10">
          <div className="text-center">
            <h1 className="tracking-tighter text-royalblue-shade3 leading-[140%] text-4xl md:text-5xl lg:text-6xl font-medium pb-4">
              Create Account
            </h1>
            <p className="text-gray-500">
              Please input valid credentials to create your account.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-8">
              <label
                htmlFor="fullName"
                className="text-royalblue-shade3 mb-3 inline-block"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                placeholder="eg. John Doe"
                value={signupForm.fullName}
                onChange={handleInputChange}
                className="h-13 px-4 border rounded border-gray-300 w-full active:border-gray-100 focus:border-gray-200"
              />
            </div>
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
                value={signupForm.email}
                onChange={handleInputChange}
                className="h-13 px-4 border rounded border-gray-300 w-full active:border-gray-100 focus:border-gray-200"
              />
            </div>
            <div className="mt-8">
              <label
                htmlFor="accountType"
                className="text-royalblue-shade3 mb-3 inline-block"
              >
                Choose an Account Type.
              </label>
              <span className="text-gray-400 block font-light mb-3">
                Hint: If you are using the site to find professionals around
                you, pick the regular Account. If you intend to sell your
                services, pick the Service Provider Account.
              </span>

              <div className="mb-3">
                <input
                  id="client"
                  name="accountType"
                  type="radio"
                  value="client"
                  required
                  onChange={handleInputChange}
                  checked={signupForm.accountType === "client"}
                  className="w-4 h-4 px-4 border rounded border-gray-300"
                />
                <label
                  htmlFor="client"
                  className="inline-block ml-2 relative bottom-0.5"
                >
                  Regular Account
                </label>
              </div>

              <div>
                <input
                  id="provider"
                  name="accountType"
                  type="radio"
                  value="provider"
                  onChange={handleInputChange}
                  checked={signupForm.accountType === "provider"}
                  className="w-4 h-4 px-4 border rounded border-gray-300"
                />
                <label
                  htmlFor="provider"
                  className="inline-block ml-2 relative bottom-0.5"
                >
                  Service Provider Account
                </label>
              </div>
            </div>

            <div className="mt-8">
              <label
                htmlFor="address"
                className="text-royalblue-shade3 mb-3 inline-block"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                value={signupForm.address}
                placeholder="Enter Address"
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
                value={signupForm.password}
                onChange={handleInputChange}
                className="h-13 px-4 border rounded border-gray-300 w-full active:border-gray-100 focus:border-gray-200"
              />
            </div>
            <div className="mt-8">
              <label
                htmlFor="passwordConfirm"
                className="text-royalblue-shade3 mb-3 inline-block"
              >
                Confirm Password
              </label>
              <PasswordInput
                name="passwordConfirm"
                placeholder="Confirm Your Password"
                required
                value={signupForm.passwordConfirm}
                onChange={handleInputChange}
                className="h-13 px-4 border rounded border-gray-300 w-full active:border-gray-100 focus:border-gray-200"
              />
            </div>

            <div className="mt-6">
              <input
                type="checkbox"
                required
                checked={agreesToTerms}
                onChange={() => setAgreesToTerms((prev) => !prev)}
                className="w-4 h-4  px-4 border rounded border-gray-300 active:border-gray-100 focus:border-gray-200"
              />{" "}
              <span className="inline ml-2 relative bottom-0.5 text-sm text-gray-500">
                By clicking <strong>Create Account</strong>, you confirm that
                you have read and agree to our&nbsp;
                <Link
                  to="/policies"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Terms and Conditions
                </Link>
                .
              </span>
            </div>
            <div className="mt-14">
              <button className="w-full bg-royalblue-main text-white p-3 rounded cursor-pointer">
                Create Account
              </button>
            </div>
          </form>
          <div className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login here
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

export default Signup;

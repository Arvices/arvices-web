// CompleteProfile.tsx
import React, { useState } from "react";

const CompleteProfile: React.FC = () => {
  const [form, setForm] = useState({
    address: "",
    accountType: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile Completed:", form);
    // Submit profile data
  };

  return (
    <section className="min-h-screen pt-13 text-royalblue-shade4">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        <div className="max-w-[500px] mx-auto mt-10">
          <h1 className="text-4xl font-medium text-center text-royalblue-shade3 mb-4">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="address" className="text-gray-600">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="h-13 px-4 border rounded border-gray-300 w-full mt-2 mb-6"
              placeholder="Enter your address"
            />

            <p className="text-gray-600 mb-2">Account Type</p>
            <div className="mb-3">
              <input
                id="client"
                name="accountType"
                type="radio"
                value="client"
                onChange={handleChange}
                checked={form.accountType === "client"}
                required
              />
              <label htmlFor="client" className="ml-2">
                Regular Account
              </label>
            </div>

            <div className="mb-6">
              <input
                id="provider"
                name="accountType"
                type="radio"
                value="provider"
                onChange={handleChange}
                checked={form.accountType === "provider"}
              />
              <label htmlFor="provider" className="ml-2">
                Service Provider
              </label>
            </div>

            <button
              type="submit"
              className="cursor pointer w-full bg-royalblue-main text-white p-3 rounded"
            >
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CompleteProfile;

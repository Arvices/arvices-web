import React, { useState } from "react";
import { Input, Select } from "antd";
import { categoryOptions } from "../providers/Filter";
import { MapPin } from "feather-icons-react";

const NewJobPosting = (): React.ReactNode => {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  return (
    <section className="min-h-screen pt-13 pb-15">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mt-15">
          <h1 className="text-3xl font-medium tracking-tight md:text-4xl mb-2">
            Describe Your Task
          </h1>
          <p className="text-gray-600">
            Explain the job, and we’ll connect you with service providers who
            are ready to assist.
          </p>
        </div>

        <div className="my-8 border-t border-gray-200" />

        {/* Description Field */}
        <div className="mb-4">
          <label className="text-gray-700 block mb-1">Task Description</label>
          <textarea
            placeholder="Briefly describe what you need help with"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-2 w-full border border-gray-200 rounded-md resize-none focus:outline-none focus:border-gray-300"
            rows={4}
          />
        </div>

        {/* Category Select */}
        <div className="mb-5">
          <label className="text-gray-700 block mb-1">Category</label>
          <Select
            value={category}
            onChange={(value) => setCategory(value)}
            className="w-full"
            options={categoryOptions}
            placeholder="Select category"
            style={{ height: "50px" }}
          />
        </div>

        {/* Location Input */}
        <div className="mb-9 relative">
          <label className="text-gray-700 block mb-1">Location</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded border border-gray-300 h-13 w-full"
            style={{ paddingRight: "9rem" }}
            placeholder="Enter your location"
          />
          <div className="w-max absolute top-[35px] right-4">
            <button className="w-max font-medium cursor-pointer text-gray-600 hover:text-black">
              <span>Add Location </span>
              <MapPin className="inline ml-1" size={16} />
            </button>
          </div>
        </div>
        {/* Location Input */}
        <div className="mb-5 relative">
          <button className="border rounded bg-royalblue-shade2 text-white w-full h-13 cursor-pointer">
            Submit{" "}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewJobPosting;

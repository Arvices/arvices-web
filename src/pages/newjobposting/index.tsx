import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { MapPin } from "feather-icons-react";
// import utilities
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { Input } from "../../components/input";
import { createServiceRequest } from "../../api-services/servicerequests.service";
import { parseHttpError } from "../../api-services/parseReqError";
import { getAllCategory } from "../../api-services/categories.service";
import { Category } from "../../api-services/categories.types";
import { useNavigate } from "react-router-dom";

const NewJobPosting = (): React.ReactNode => {
  // utilities
  const { setLoading, setLoadingText } = useLoading();
  const auth = useAuth();
  const notify = useNotificationContext();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState("");
  const navigate = useNavigate();

  function findCategoryByName(name: string, categories: Category[]) {
    return categories.find((cat) => cat.name === name) || null;
  }

  const loadCategories = async () => {
    setCatLoading(true);
    setCatError("");
    try {
      const response = await getAllCategory();
      setCategories(response.data.response); // adjust this if your response shape is different
    } catch (error: any) {
      let errorMsg = parseHttpError(error);
      setCatError(
        (errorMsg || "Failed to load categories") +
          "Use the button below to reload categories",
      );
    } finally {
      setCatLoading(false);
    }
  };

  useEffect(() => {
    if (!catLoading) {
      loadCategories();
    }
  }, []);
  const handleSubmit = async () => {
    try {
      if (!description || description.trim() === "") {
        return notify.openNotification(
          "topRight",
          "Missing Field",
          "Please add a job description before posting.",
          "error",
        );
      }

      setLoading(true);
      setLoadingText("Posting your job...");
      let cat = findCategoryByName(category, categories) as Category;
      const data = {
        description,
        address: location, // You can update this if address is part of the form
        categoryId: cat.id, // Replace with selected category if applicable
        type: "Public", // Or "Private" if user can choose
      };

      let res = await createServiceRequest(data, auth.token);
      console.log({ res });

      notify.openNotification(
        "topRight",
        "Success",
        "Your job post was submitted successfully!",
        "success",
      );
      navigate(`/client/manage-jobs/${res.data.response.id}`);

      // Optionally reset form fields
      // setDescription(""); setCategoryId(0); etc.
    } catch (error) {
      let errorMsg = parseHttpError(error);
      notify.openNotification(
        "topRight",
        "Error",
        errorMsg || "Something went wrong while posting the job.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const mappedCat = [{ label: "Select A Category", value: "", id: 0 }].concat(
    categories.map((x: any) => {
      return { label: x.name, value: x.name, id: x.id };
    }),
  );
  /**
   {
  "description": "string",
  "address": "string",
  "position": "string",
  "categoryId": 0,
  "type": "Public"
}
   */
  return (
    <section className="min-h-screen pt-13 pb-15">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mt-15">
          <h1 className="text-2xl font-semibold tracking-tighter text-royalblue-shade5">
            Describe Your Task
          </h1>
          <p className="mt-2 text-royalblue-shade5">
            Explain the job, and we’ll connect you with service providers who
            are ready to assist.
          </p>
        </div>

        <div className="my-8 border-t border-gray-200" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Description Field */}
          <div className="mb-4">
            <label className="text-gray-700 block mb-1">Task Description</label>
            <textarea
              placeholder="Briefly describe what you need help with"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
              className="px-4 py-2 w-full border border-gray-200 rounded-md resize-none focus:outline-none focus:border-gray-300"
              rows={4}
            />
          </div>

          {/* Category Select */}
          {catError ? (
            <div className="w-full mb-5">
              <label className="text-red-600 font-light text-[13px] block mb-2">
                {catError}
              </label>
              <button
                onClick={loadCategories}
                className="border cursor-pointer border-dashed border-gray-500 rounded px-4 py-2 text-sm hover:bg-gray-50 transition"
              >
                Reload Category
              </button>
            </div>
          ) : (
            <div className="mb-5">
              <label className="text-gray-700 block mb-1">Category</label>
              <Select
                value={category}
                onChange={(value) => setCategory(value)}
                className="w-full"
                aria-required
                options={mappedCat}
                placeholder="Select category"
                style={{ height: "50px" }}
              />
            </div>
          )}

          {/* Location Input */}
          <div className="mb-9 relative">
            <label className="text-gray-700 block mb-1">Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="rounded border border-gray-300 h-13 w-full pr-[9rem]"
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
            <button
              type="submit"
              className="border rounded bg-royalblue-shade2 text-white w-full h-13 cursor-pointer"
            >
              Submit{" "}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewJobPosting;

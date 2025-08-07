import React, { useState, useEffect, FormEvent } from "react";

export interface EditJobData {
  description: string;
  address: string;
}

interface EditJobProps {
  initialData: EditJobData;
  onSubmit: (updatedJob: EditJobData) => void;
  onCancel?: () => void;
}

const EditJob: React.FC<EditJobProps> = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState<EditJobData>(initialData);

  useEffect(() => {
    setForm(initialData); // Sync if initial data changes
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}  className="">
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-4">
        Edit Job Details
      </h2>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Update job description"
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter job location"
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition duration-150"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditJob;

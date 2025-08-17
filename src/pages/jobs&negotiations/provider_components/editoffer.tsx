import React, { useState, useEffect, FormEvent } from "react";
export interface OfferData {
  description: string;
  price: number;
}
interface EditOfferProps {
  initialData: OfferData;
  onSubmit: (updatedOffer: OfferData) => void;
  onCancel?: () => void;
}
const EditOffer: React.FC<EditOfferProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState<OfferData>(initialData);
  useEffect(() => {
    setForm(initialData);
  }, [initialData]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };
  return (
    <form onSubmit={handleSubmit} className="">
      <h2 className="text-xl font-semibold text-gray-800 tracking-tight mb-4">
        Edit Offer
      </h2>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Enter description"
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">Price (₦)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          min={0}
          placeholder="₦0.00"
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
export default EditOffer;

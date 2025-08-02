import { Filter, MapPin } from "feather-icons-react";
import { Modal, Input, Select } from "antd";
import { useState } from "react";
import { useCategory } from "../../contexts/CategoryContext";

export interface FilterFormProps {
  filters: {
    searchTerm: string;
    category: string;
    location: string;
  };
  onChange: (name: string, value: string) => void;
}

export const FilterComponent = ({
  filters,
  onChange,
}: FilterFormProps): React.ReactNode => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const category = useCategory();
  return (
    <div>
      <div className="hidden lg:flex border rounded-3xl border-gray-300">
        {/* Desktop filter UI */}
        <input
          placeholder="Add a search term"
          value={filters.searchTerm}
          onChange={(e) => onChange("searchTerm", e.target.value)}
          className="h-13 px-4 w-full active:border-gray-100 focus:border-gray-200"
        />
        <select
          className="h-13 px-4 text-gray-500 w-full active:border-gray-100 focus:border-gray-200"
          onChange={(e) => onChange("category", e.target.value)}
          value={filters.category}
        >
          {category.categories.map((val, index) => {
            return (
              <option
                className="text-gray-700"
                key={index}
                value={JSON.stringify(val)}
              >
                {val.name}
              </option>
            );
          })}
        </select>
        <input
          placeholder="Location"
          value={filters.searchTerm}
          onChange={(e) => onChange("searchTerm", e.target.value)}
          className="h-13 px-4  w-full active:border-gray-100 focus:border-gray-200"
        />
        <button
          onClick={() => setFilterModalOpen(true)}
          className="h-13 px-5 min-w-[120px] bg-gray-900 text-white rounded-3xl cursor-pointer"
        >
          Apply <Filter className="inline" size={16} />
        </button>
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden flex justify-end">
        <button
          onClick={() => setFilterModalOpen(true)}
          className="bg-gray-900 px-7  text-white rounded cursor-pointer h-11"
        >
          Apply Filters <Filter className="inline" size={16} />
        </button>
      </div>

      {/* Filter Modal */}
      <Modal
        title="Apply Filters"
        open={filterModalOpen}
        onCancel={() => setFilterModalOpen(false)}
        onOk={() => setFilterModalOpen(false)}
        okText="Apply"
      >
        <div className="mb-5">
          <label className="text-gray-700 block mb-1">Search Term</label>
          <Input
            value={filters.searchTerm}
            onChange={(e) => onChange("searchTerm", e.target.value)}
            className="rounded border-gray-300 h-11 w-full"
          />
        </div>

        <div className="mb-5">
          <label className="text-gray-700 block mb-1">Category</label>
          <Select
            value={filters.category}
            style={{ height: "45px" }}
            onChange={(value) => onChange("category", value)}
            className="w-full rounded py-2"
            options={category.categories.map((x) => {
              return { label: x.name, value: x.id };
            })}
            placeholder="Select category"
          />
        </div>

        <div className="mb-5 relative">
          <label className="text-gray-700 block mb-1">Location</label>
          <Input
            value={filters.location}
            onChange={(e) => onChange("location", e.target.value)}
            className="rounded border-gray-300 h-11 w-full pr-26" // added padding-right to prevent overlap
          />
          <div className="w-max absolute top-[35px] right-4">
            <button className="w-max font-medium cursor-pointer">
              <span>Add Location </span>
              <span>
                <MapPin className="inline" size={16} />
              </span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

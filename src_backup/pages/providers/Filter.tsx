import { Filter, MapPin, X } from "feather-icons-react";
import { Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useCategory } from "../../contexts/CategoryContext";
import LocationInput from "../../components/map/LocationInput";
import { LocationData } from ".";

export interface FilterFormProps {
  filters: {
    searchTerm: string;
    category: string;
    location: string;
  };
  onChange: (name: string, value: string | LocationData) => void;
  onApply: () => void;
  onClear: () => void;
  isFilter?: boolean;
  setIsFilter?: () => void;
}

export const FilterComponent = ({
  filters,
  onChange,
  onApply,
  onClear,
  isFilter,
}: FilterFormProps): React.ReactNode => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const category = useCategory();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let filterForm = (
    <div className="border border-neutral-200 rounded-xl bg-white card-shadow overflow-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {/* First 4 children */}
      <div className="bg-neutral-100 rounded-lg h-auto flex items-center justify-center">
        {/* search input */}
        <input
          placeholder="Add a search term"
          value={filters.searchTerm}
          onChange={(e) => onChange("searchTerm", e.target.value)}
          className="px-4 h-12 w-full bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none"
        />
      </div>
      <div className="bg-neutral-100 rounded-lg h-auto flex items-center justify-center">
        <Select
          value={filters.category}
          onChange={(value) => onChange("category", value)}
          className="px-4 h-12 w-full bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none"
          style={{ height: 48 }} // same as h-12
          placeholder="Select category"
          options={[{ label: "Select Category", value: "" }].concat(
            category.categories.map((val) => ({
              label: val.name,
              value: String(val.id),
            })),
          )}
        />
      </div>
      <div className="bg-neutral-100 rounded-lg h-auto flex items-center justify-center">
        {/* location input */}
        <input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => onChange("location", e.target.value)}
          className="px-4 h-12 w-full bg-transparent text-neutral-800 placeholder-neutral-400 focus:outline-none"
        />
      </div>
      <div className="bg-neutral-100 rounded-lg h-auto flex items-center justify-center">
        {/* add location button */}
        <button
          className="text-neutral-600 h-12 hover:text-neutral-900 transition flex items-center gap-1"
          onClick={() => setShowModal((prev) => !prev)}
        >
          Add Location <MapPin size={18} />
        </button>
      </div>

      {/* Button row — always full width */}
      <div className="rounded-lg flex items-center justify-end col-span-1 sm:col-span-2 md:col-span-4">
        <div
          className={`w-full grid gap-4 ${
            isFilter ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {isFilter && (
            <button
              onClick={() => {
                onClear();
              }}
              className="h-12 w-full bg-neutral-200 text-neutral-800 rounded-lg hover:bg-neutral-300 transition flex items-center justify-center gap-1"
            >
              Clear <X size={16} />
            </button>
          )}
          <button
            onClick={() => {
              if (isMobile) {
                setFilterModalOpen(false);
                onApply();
              } else {
                onApply();
              }
            }}
            className="h-12 w-full bg-neutral-800 text-white rounded-lg hover:bg-neutral-900 transition flex items-center justify-center gap-1"
          >
            Apply <Filter size={16} />
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      {/* Location Input Modal */}
      <LocationInput
        open={showModal}
        onClose={() => setShowModal(false)}
        onApply={(locationData) => {
          console.log("Selected location:", locationData);
          onChange("location", locationData.address);
          onChange("locationData", locationData);
          setShowModal(false);
        }}
      />

      {/* Desktop filter bar */}
      {isMobile ? (
        <div className="lg:hidden w-full mt-3">
          <button
            onClick={() => setFilterModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-lg 
                    bg-neutral-800 text-white font-medium shadow-sm 
                    hover:bg-neutral-900 active:scale-[0.98] transition-all"
          >
            <Filter className="w-5 h-5" />
            Apply Filters
          </button>
        </div>
      ) : (
        filterForm
      )}

      {/* Mobile Filter Button */}

      {/* Filter Modal */}
      <Modal
        title={
          <span className="text-neutral-900 font-medium">Apply Filters</span>
        }
        open={filterModalOpen}
        onCancel={() => setFilterModalOpen(false)}
        footer={null} // removes default footer buttons
        className="rounded-xl"
        bodyStyle={{ backgroundColor: "#fff" }}
      >
        {filterForm}
      </Modal>
    </div>
  );
};

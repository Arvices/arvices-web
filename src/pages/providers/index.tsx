import React, { useState } from "react";
import { FilterComponent } from "./Filter";
import { categoryData } from "../home";
import { CategoryCarousel } from "./CategoryCarousel";
import { ProviderCard } from "../../components/cards/appcards";

const ArvicesProviders = (): React.ReactNode => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    location: "",
  });
  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="min-h-screen pt-14 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto pb-15">
        {/* Page Starts*/}
        <div className="mt-5">
          <FilterComponent onChange={handleFilterChange} filters={filters} />
        </div>
        <div className="mt-13">
          <h3 className="text-royalblue-shade5 text-2xl font-medium tracking-tight md:text-3xl mb-4">
            Service Categories
          </h3>
          <CategoryCarousel categoryData={categoryData} />
        </div>
        <div className="mt-13 text-royalblue-shade5 ">
          <h3 className="text-2xl font-medium tracking-tight md:text-3xl mb-2">
            Service Providers
          </h3>
          <p className="text-[16px] md:text-[18px] tracking-tight font-medium">
            Top Professionals
          </p>
          <div className="pt-8">
            <div className="max-w-[400px] w-full">
              <ProviderCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArvicesProviders;

import React, { useEffect, useState } from "react";
import { FilterComponent } from "./Filter";
import { categoryData } from "../home";
import { CategoryCarousel } from "./CategoryCarousel";
import { ProviderCard } from "../../components/cards/appcards";

import { useAuth } from "../../contexts/AuthContext";
import {
  getRisingTalent,
  getTopProfessionals,
} from "../../api-services/auth-re";
import { Pagination } from "../../components/pagination";

const ArvicesProviders = (): React.ReactNode => {
  let auth = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [topProfessionals, setTopProfessionals] = useState<any[]>([]);
  const [risingTalents, setRisingTalents] = useState<any[]>([]);

  const [topLoading, setTopLoading] = useState(true);
  const [risingLoading, setRisingLoading] = useState(true);
  const [topError, setTopError] = useState(false);
  const [risingError, setRisingError] = useState(false);

  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    location: "",
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchTopProfessionals = async () => {
    try {
      setTopLoading(true);
      setTopError(false);
      const res = await getTopProfessionals(auth.token);

      console.log({ resTop: res });
      setTopProfessionals(res?.data?.response || []);
    } catch (err) {
      setTopError(true);
    } finally {
      setTopLoading(false);
    }
  };

  const fetchRisingTalents = async () => {
    try {
      setRisingLoading(true);
      setRisingError(false);
      const res = await getRisingTalent(auth.token);
      console.log({ resRising: res });
      setRisingTalents(res?.data?.response || []);
    } catch (err) {
      setRisingError(true);
    } finally {
      setRisingLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProfessionals();
    fetchRisingTalents();
  }, []);
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
          <h3 className="hidden text-2xl font-medium tracking-tight md:text-3xl mb-2">
            Service Providers
          </h3>
          <p className="text-[16px] md:text-[18px] tracking-tight font-medium">
            Top Professionals
          </p>
          <div className="pt-8">
            <div className="flex flex-wrap gap-5">
              {topProfessionals
                .concat(topProfessionals)
                .map((provider, index) => {
                  return (
                    <div
                      key={index}
                      className="max-w-[400px] min-w-[300px] flex-1"
                    >
                      <ProviderCard provider={provider} />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="mt-13 text-royalblue-shade5 ">
          <h3 className="hidden text-2xl font-medium tracking-tight md:text-3xl mb-2">
            Service Providers
          </h3>
          <p className="text-[16px] md:text-[18px] tracking-tight font-medium">
            Rising Talents
          </p>
          <div className="pt-8">
            <div className="flex flex-wrap gap-5">
              {risingTalents.concat(risingTalents).map((provider, index) => {
                return (
                  <div
                    key={index}
                    className="max-w-[400px] min-w-[300px] flex-1"
                  >
                    <ProviderCard provider={provider} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={(pageNo) => {
            setCurrentPage(pageNo);
            console.log("new Page is", pageNo);
          }}
        />
      </div>
    </section>
  );
};

export default ArvicesProviders;

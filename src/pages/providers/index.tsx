import React, { useEffect, useState } from "react";
import { FilterComponent } from "./Filter";
import { categoryData } from "../home";
import { CategoryCarousel } from "./CategoryCarousel";
import { ProviderCard } from "../../components/cards/appcards";

import { useAuth } from "../../contexts/AuthContext";
import {
  getProfessionals
} from "../../api-services/auth-re";
import { Pagination } from "../../components/pagination";
import { UserAccount } from "../../api-services/auth";
import { ContentHOC } from "../../components/nocontent";
import { useNotificationContext } from "../../contexts/NotificationContext";

const ArvicesProviders = (): React.ReactNode => {
  let auth = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [professionals, setProfessionals] = useState<UserAccount[]>([]);
  const { openNotification } = useNotificationContext();

  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    location: "",
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchProfessionals = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const res = await getProfessionals({
        search: filters.searchTerm || undefined,
        category: filters.category || undefined,
        orderBy: "DESC",
        page: currentPage,
        limit: 10,
      });
      if (res?.data?.response?.length === 0) {
        openNotification("topRight", "No More Content To Show", "", "info");
        return;
      }
      setProfessionals(res?.data?.response || []);

      console.log({ res });
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, [filters, currentPage]);
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
            {
              <ContentHOC
                loading={loading}
                error={!!error}
                errMessage={error}
                actionFn={fetchProfessionals}
                noContent={professionals.length === 0}
                UIComponent={
                  <div className="flex flex-wrap gap-5">
                    {professionals.map((provider, index) => {
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
                }
              />
            }
          </div>
        </div>
        <div className="w-max mx-auto mt-20">
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={(pageNo) => {
              setCurrentPage(pageNo);
              console.log("new Page is", pageNo);
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ArvicesProviders;

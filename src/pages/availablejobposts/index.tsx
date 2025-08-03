import React, { useEffect, useState } from "react";
import { FilterComponent } from "../providers/Filter";
import { CategoryCarousel } from "../providers/CategoryCarousel";
import { categoryData } from "../home";
import { Job, JobCard } from "../../components/cards/appcards";
import { getAllServiceRequests } from "../../api-services/servicerequests.service";
import { useAuth } from "../../contexts/AuthContext";
import { ContentHOC } from "../../components/nocontent";
import { Pagination } from "../../components/pagination";
import { useNotificationContext } from "../../contexts/NotificationContext";

const AvailableJobPostings = (): React.ReactNode => {
  const auth = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const { openNotification } = useNotificationContext();
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "",
    location: "", // assuming location maps to "user" or another query param
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<any[]>([]); // Replace `any` with your actual type if available

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const loadServiceRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllServiceRequests({
        token: auth.token,
        page: currentPage,
        limit: 10,
        search: filters.searchTerm || undefined,
        category: filters.category ? Number(filters.category) : undefined,
        user: filters.location ? Number(filters.location) : undefined, // adjust if needed
      });

      if (response?.data?.response?.length === 0) {
        openNotification("topRight", "No More Content To Show", "", "info");
        return;
      }
      setJobPostings(response?.data?.response || []);
      console.log({ response });
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load service requests",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      loadServiceRequest();
    }
    // include currentPage and filters in the dependencies
  }, [auth.token, currentPage, filters]);
  return (
    <section className="min-h-screen pt-13  text-royalblue-shade5 pb-15">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {/* Page Starts*/}
        <div className="mt-5">
          <FilterComponent onChange={handleFilterChange} filters={filters} />
        </div>
        <div className="mt-13">
          <h3 className="text-royalblue-shade5 text-2xl font-medium tracking-tight md:text-3xl mb-4">
            Job Categories
          </h3>
          <CategoryCarousel categoryData={categoryData} />
        </div>

        <div className="mt-13">
          <h3 className="text-2xl font-medium tracking-tight md:text-3xl mb-2">
            Available Job Posting
          </h3>
          <p className="text-[16px] md:text-[18px] tracking-tight font-medium">
            All Categories
          </p>

          <div className="pt-8">
            {
              <ContentHOC
                loading={loading}
                error={!!error}
                errMessage={error || ""}
                actionFn={loadServiceRequest}
                noContent={jobPostings.length === 0}
                minHScreen={false}
                UIComponent={
                  <div className="flex flex-wrap gap-5">
                    {jobPostings.map((job, index) => {
                      return (
                        <div
                          key={index}
                          className="max-w-[400px] min-w-[300px] flex-1"
                        >
                          <JobCard job={job} />
                        </div>
                      );
                    })}
                  </div>
                }
              />
            }
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
      </div>
    </section>
  );
};

export default AvailableJobPostings;

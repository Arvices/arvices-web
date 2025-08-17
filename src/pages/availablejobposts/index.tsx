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
import { Filters, LocationData } from "../providers";
const AvailableJobPostings = (): React.ReactNode => {
  const auth = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const { openNotification } = useNotificationContext();
  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    category: "",
    location: "",
    locationData: {
      coordinates: {
        lat: 0,
        lng: 0,
      },
      country: "",
      lga: "",
      state: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<Job[]>([]);
  const handleFilterChange = (name: string, value: string | LocationData) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [isFilter, setIsFilter] = useState(false);
  const handleFilterApply = () => {
    loadServiceRequest();
    setIsFilter(true);
  };
  const handeClearFilter = () => {
    setFilters({
      searchTerm: "",
      category: "",
      location: "",
      locationData: {
        coordinates: {
          lat: 0,
          lng: 0,
        },
        country: "",
        lga: "",
        state: "",
      },
    });
    setIsFilter(false);
  };
  const addOfferToJob = (jobId: number, newOffer: any) => {
    setJobPostings((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              offer: job.offer ? [...job.offer, newOffer] : [newOffer],
            }
          : job,
      ),
    );
  };
  const updateOfferInJob = (
    jobId: number,
    offerId: number,
    updatedOffer: any,
  ) => {
    let job = jobPostings.find((x) => x.id === jobId);
    const jobOffers = job?.offer || [];
    const filtered = jobOffers?.filter((x) => x.id !== offerId);
    const newOffers = [...filtered, updatedOffer];
    console.log({
      newOffers,
    });
    setJobPostings((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              offer: (job.offer || []).map((offer: any) =>
                offer.id === offerId
                  ? {
                      ...offer,
                      ...updatedOffer,
                    }
                  : offer,
              ),
            }
          : job,
      ),
    );
  };
  const removeOfferFromJob = (jobId: number, offerId: number) => {
    setJobPostings((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              offer: job.offer?.filter((offer: any) => offer.id !== offerId),
            }
          : job,
      ),
    );
  };
  const handleOfferAction = (
    action: "add" | "update" | "delete",
    jobId: number,
    offer: any,
  ) => {
    console.log({
      action,
      jobId,
      offer,
    });
    if (action === "add") {
      addOfferToJob(jobId, offer);
    } else if (action === "update") {
      updateOfferInJob(jobId, offer.id, offer);
    } else if (action === "delete") {
      removeOfferFromJob(jobId, offer.id);
    }
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
        category: Number(filters.category),
        location: filters.location || undefined,
      });
      if (response?.data?.response?.length === 0) {
        openNotification("topRight", "No More Content To Show", "", "info");
        return;
      }
      setJobPostings(response?.data?.response || []);
      console.log({
        response,
      });
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
  console.log({
    jobPostings,
  });
  useEffect(() => {
    if (auth.token) {
      loadServiceRequest();
    }
  }, [auth.token, currentPage, filters]);
  return (
    <section className="min-h-screen pt-13  text-royalblue-shade5 pb-15">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        {}
        <div className="mt-5">
          <FilterComponent
            isFilter={isFilter}
            onApply={handleFilterApply}
            onClear={handeClearFilter}
            onChange={handleFilterChange}
            filters={filters}
          />
        </div>
        <div className="mt-13">
          <h3 className="text-2xl font-semibold tracking-tighter text-royalblue-shade5 mb-4">
            Job Categories
          </h3>
          <CategoryCarousel categoryData={categoryData} />
        </div>

        <div className="mt-13">
          <h3 className="text-2xl font-semibold tracking-tighter text-royalblue-shade5 mb-2">
            Available Job Posting
          </h3>
          <p className="text-[16px] tracking-tight font-bold">All Categories</p>

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
                          <JobCard
                            handleOfferAction={handleOfferAction}
                            job={job}
                          />
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

import React, { useEffect, useState } from "react";
import { FilterComponent } from "../providers/Filter";
import { CategoryCarousel } from "../providers/CategoryCarousel";
import { categoryData } from "../home";
import { Job, JobCard } from "../../components/cards/appcards";
import {
  getAllServiceRequests,
  getServiceRequestAroundMe,
} from "../../api-services/servicerequests.service";
import { useAuth } from "../../contexts/AuthContext";
import { ContentHOC } from "../../components/nocontent";
import { Pagination } from "../../components/pagination";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { Filters, LocationData } from "../providers";
import { List } from "feather-icons-react";
import { MapIcon } from "lucide-react";
import JobMapView from "./JobMapView";
import axios from "axios";
import { mapBoxPublickKey } from "../providers/mapbox.util";

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

  const [geoCodeResponse, setGeoCodeResponse] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [isMapView, setIsMapView] = useState(false);

  const toggleMapview = () => {
    setIsMapView((prev) => !prev);
  };

  const handleFilterChange = (name: string, value: string | LocationData) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isFilter, setIsFilter] = useState(false);

  const handleFilterApply = () => {
    load();
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

  const geoCodeLocation = async (address: string) => {
    const accessToken = mapBoxPublickKey; // Replace with your actual key
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`;
    try {
      const response = await axios.get(url);
      const data = response.data;
      if (data.features.length > 0) {
        const coordinates = data.features[0].center;
        const [longitude, latitude] = coordinates;

        setGeoCodeResponse({
          latitude,
          longitude,
        });
        return {
          latitude,
          longitude,
        };
      } else {
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Geocoding failed:",
          error.response?.data || error.message,
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
      throw error;
    }
  };

  const loadServiceRequestsAroundMe = async () => {
    setLoading(true);
    setError(null);

    try {
      const geocode = await geoCodeLocation(filters.location);

      if (!geocode) {
        // Handle the case where geocoding fails, e.g., show a message to the user
        console.error("Geocoding failed. Cannot load service requests.");
        openNotification(
          "topRight",
          "Location not found.",
          "Please enter a valid address.",
          "error",
        );
        return;
      }

      const categoryId = filters.category
        ? Number(filters.category)
        : undefined;

      const response = await getServiceRequestAroundMe(auth.token, {
        page: currentPage,
        limit: 10,
        search: filters.searchTerm || undefined,
        category: categoryId ? [categoryId] : undefined,
        longitude: geocode.longitude,
        latitude: geocode.latitude,
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

  const loadServiceRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const categoryId = filters.category
        ? Number(filters.category)
        : undefined;

      const response = await getAllServiceRequests({
        page: currentPage,
        limit: 10,
        search: filters.searchTerm || undefined,
        category: categoryId ? categoryId : undefined,
        token: auth.token,
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

  const load = () => {
    if (filters.location) {
      loadServiceRequestsAroundMe();
    } else {
      loadServiceRequest();
    }
  };

  console.log({
    jobPostings,
  });
  useEffect(() => {
    if (auth.token) {
      load();
    }
  }, [auth.token, currentPage]);
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
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold tracking-tighter text-royalblue-shade5 mb-2">
                Available Job Posting
              </h3>
              <p className="text-[16px] tracking-tight font-semibold">
                All Categories
              </p>
            </div>
            <div className="w-full sm:w-max pt-3 sm:pt-0">
              {filters.location && (
                <>
                  {isMapView ? (
                    <button
                      onClick={toggleMapview}
                      className="w-full inline-block h-10 px-5 text-sm font-medium tracking-tight rounded-[8px] cursor-pointer text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <List className="inline w-4 h-4" /> View As List
                    </button>
                  ) : (
                    <button
                      onClick={toggleMapview}
                      className="w-full inline-block h-10 px-5 text-sm font-medium tracking-tight rounded-[8px] cursor-pointer text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <MapIcon className="inline w-4 h-4" /> Switch To Map View
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="pt-8">
            {
              <ContentHOC
                loading={loading}
                error={!!error}
                errMessage={error || ""}
                actionFn={load}
                noContent={jobPostings.length === 0}
                minHScreen={false}
                UIComponent={
                  isMapView ? (
                    <JobMapView
                      position={[
                        geoCodeResponse.latitude,
                        geoCodeResponse.longitude,
                      ].join(",")}
                      jobs={jobPostings.filter((x) => !!x.position)}
                    />
                  ) : (
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
                  )
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

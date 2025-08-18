import React, { useEffect, useState } from "react";
import { FilterComponent } from "./Filter";
import { categoryData } from "../home";
import { CategoryCarousel } from "./CategoryCarousel";
import { ProviderCard } from "../../components/cards/appcards";

import {
  getProfessionals,
  getServiceProvidersAroundMe,
} from "../../api-services/auth-re";
import { Pagination } from "../../components/pagination";
import { UserAccount } from "../../api-services/auth";
import { ContentHOC } from "../../components/nocontent";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useSearchParams } from "react-router-dom";
import { mapBoxPublickKey } from "./mapbox.util";
import axios from "axios";
import { parseHttpError } from "../../api-services/parseReqError";
import { List, MapIcon } from "lucide-react";
import MapView from "./MapView";

export interface LocationData {
  coordinates: {
    lat: number;
    lng: number;
  };
  country: string;
  lga: string;
  state: string;
}
export interface Filters {
  searchTerm: string;
  category: string;
  location: string;
  locationData: LocationData;
}

const ArvicesProviders = (): React.ReactNode => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [professionals, setProfessionals] = useState<UserAccount[]>([]);
  const { openNotification } = useNotificationContext();

  const [searchParams] = useSearchParams();

  const [isMapView, setIsMapView] = useState(false);
  const toggleMapview = () => {
    setIsMapView((prev) => !prev);
  };

  // Get the 'category' query parameter
  const category = searchParams.get("category");
  // Get the 'location' query parameter
  const location = searchParams.get("location");
  const [position, setPosition] = useState("");

  const [filters, setFilters] = useState<Filters>({
    searchTerm: "",
    category: category || "",
    location: location || "",
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

  const [isFilter, setIsFilter] = useState(false);

  const handleFilterChange = (name: string, value: string | LocationData) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterApply = () => {
    fetchProfessionals();
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

  const geoCodeLocation = async (address: string) => {
    const accessToken = mapBoxPublickKey; // Replace with your actual token
    const encodedAddress = encodeURIComponent(address);

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      // Check if any features (results) were returned
      if (data.features.length > 0) {
        const coordinates = data.features[0].center;
        const [longitude, latitude] = coordinates;

        // Return the geocoded coordinates
        return { latitude, longitude };
      } else {
        // Return null if no results are found
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
      throw error; // Handle the error gracefully
    }
  };

  const fetchProfessionalsAroundMe = async () => {
    setLoading(true);
    setError("");

    // GeoCode location first
    const geoCodeResponse = await geoCodeLocation(filters.location || ""); // Use filters.location
    console.log({ geoCodeResponse });

    // Handle case where geocoding fails or returns no results
    if (
      !geoCodeResponse ||
      !geoCodeResponse.latitude ||
      !geoCodeResponse.longitude
    ) {
      openNotification(
        "topRight",
        "Location Not Found",
        "Could not geocode the specified location. Please try a different address.",
        "error",
      );
      setLoading(false);
      return; // Stop execution if location cannot be geocoded
    }

    setPosition(
      [geoCodeResponse.latitude, geoCodeResponse.longitude].join(","),
    );

    try {
      const res = await getServiceProvidersAroundMe({
        page: 1, // Assuming you always want the first page for "around me" search
        limit: 10,
        latitude: geoCodeResponse.latitude,
        longitude: geoCodeResponse.longitude,
        // You might want to add category and search term filters here too if applicable
        // category: filters.category || undefined,
        // search: filters.searchTerm || undefined,
      });

      console.log("users around me", res); // Log the full response for debugging

      // Handle no content scenario, mirroring fetchProfessionals
      if (res?.data?.response?.length === 0) {
        openNotification(
          "topRight",
          "No Professionals Found",
          "There are no professionals around this location matching your criteria.",
          "info",
        );
        setProfessionals([]); // Clear previous professionals if no new ones are found
        return;
      }

      // Set the professionals data
      setProfessionals(res?.data?.response || []);
    } catch (err: any) {
      // Catch and set the error, mirroring fetchProfessionals
      let message = parseHttpError(err);
      setError(message);
      openNotification(
        "topRight",
        "Error Fetching Professionals",
        message,
        "error",
      );
    } finally {
      // Always stop loading
      setLoading(false);
    }
  };

  const fetchProfessionals = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getProfessionals({
        search: filters.searchTerm || undefined,
        category: filters.category,
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
      let message = parseHttpError(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadServiceProviders = async () => {
    if (location !== null) {
      fetchProfessionalsAroundMe();
    } else {
      fetchProfessionals();
    }
  };

  useEffect(() => {
    // Update state or directly use the values
    if (category || location) {
    }
    if (location) {
    }

    console.log("Extracted Category:", category);
    console.log("Extracted Location:", location);
  }, [searchParams]);
  useEffect(() => {
    loadServiceProviders();
  }, []);
  return (
    <section className="min-h-screen pt-14 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto pb-15">
        {/* Page Starts*/}
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
            Service Categories
          </h3>
          <CategoryCarousel categoryData={categoryData} />
        </div>
        <div className="mt-13 text-royalblue-shade5 ">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-semibold tracking-tighter text-royalblue-shade5 mb-2">
                Service Providers
              </h3>
              <p className="text-[16px] tracking-tight font-semibold">
                Top Professionals
              </p>
            </div>
            <div className="w-full sm:w-max pt-3 sm:pt-0">
              {location && (
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
                errMessage={error}
                actionFn={loadServiceProviders}
                noContent={professionals.length === 0}
                UIComponent={
                  isMapView ? (
                    <MapView users={professionals} position={position} />
                  ) : (
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
                  )
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

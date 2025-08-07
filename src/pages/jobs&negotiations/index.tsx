import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { ManageJobsTabs } from "./managejobstab";
import JobDetails from "./jobdetails";
import { getAllServiceRequests } from "../../api-services/servicerequests.service";
import { Pagination } from "../../components/pagination";
import { useAuth } from "../../contexts/AuthContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { ContentHOC } from "../../components/nocontent";
import { getAllOffers } from "../../api-services/offer.service";
import { Offer } from "../../types/main.types";

const ManageJob = (): React.ReactNode => {
  const auth = useAuth();

  const { openNotification } = useNotificationContext();
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const isClient = location.pathname.indexOf("client") !== -1;
  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<any[]>([]); // Replace `any` with your actual type
  const [sentOffers, setSentOffers] = useState<Offer[]>([]); // This is the state we'll use for offers

  const loadServiceRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllServiceRequests({
        token: auth.token,
        page: currentPage,
        limit: 10,
        user: auth?.user?.id,
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

  const loadOffers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllOffers(auth.token, {
        user: auth?.user?.id,
        page: 1,
        limit: 10,
      });

      if (response?.data?.response?.length === 0) {
        openNotification("topRight", "No More Content To Show", "", "info");
        return;
      }

      // Corrected line: We use setSentOffers here, not setJobPostings
      setSentOffers(response?.data?.response || []);
      console.log({ response });
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load offers", // Updated error message for clarity
      );
    } finally {
      setLoading(false);
    }
  };

  const load = async () => {
    if (isClient) {
      loadServiceRequest();
    } else {
      loadOffers();
    }
  };

  useEffect(() => {
    if (auth.token) {
      load();
    }
    // Added isClient to the dependency array, as it's a condition for which function runs
  }, [auth.token, currentPage, isClient]);
  useEffect(() => {
    console.log({ activeTab });
  }, []);

  return (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto pb-15">
        {/* Page Starts*/}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tighter text-royalblue-shade5">
            Manage Jobs
          </h2>
          <p className="mt-2 text-royalblue-shade5">
            View, track, and manage all your job activities — from offers and
            negotiations to completion.
          </p>
        </div>
        <div>
          <ManageJobsTabs
            isClient={isClient}
            onTabChange={(key) => {
              console.log("Active tab:", key);
              setActiveTab(key);
              // Filter jobs based on this key
            }}
          />
        </div>

        <div className="pt-8">
          {
            <ContentHOC
              loading={loading}
              error={!!error}
              errMessage={error || ""}
              actionFn={load}
              noContent={
                isClient ? jobPostings.length === 0 : sentOffers.length === 0
              }
              minHScreen={false}
              UIComponent={
                <div className="flex flex-wrap gap-5">
                  {isClient
                    ? jobPostings.map((job, index) => {
                        return (
                          <div
                            key={index}
                            className="max-w-[400px] min-w-[300px] flex-1"
                          >
                            <JobDetails isClient={isClient} job={job} />
                          </div>
                        );
                      })
                    : sentOffers.map((offer, index) => {
                        return (
                          <div
                            key={index}
                            className="max-w-[400px] min-w-[300px] flex-1"
                          >
                            <JobDetails
                              isClient={isClient}
                              job={offer.serviceRequest}
                              offerId={offer.id}
                            />
                          </div>
                        );
                      })}
                </div>
              }
            />
          }
        </div>

        <div className="w-max mx-auto mt-15">
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

export default ManageJob;

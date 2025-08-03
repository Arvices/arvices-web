import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { ManageJobsTabs } from "./managejobstab";
import JobDetails from "./jobdetails";
import { getAllServiceRequests } from "../../api-services/servicerequests.service";
import { Pagination } from "../../components/pagination";
import { useAuth } from "../../contexts/AuthContext";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { ContentHOC } from "../../components/nocontent";

const ManageJob = (): React.ReactNode => {
  const auth = useAuth();

  const { openNotification } = useNotificationContext();
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const isClient = location.pathname.indexOf("client") !== -1;
  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobPostings, setJobPostings] = useState<any[]>([]); // Replace `any` with your actual type if available

  const loadServiceRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllServiceRequests({
        token: auth.token,
        page: currentPage,
        limit: 10,
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
  }, [auth.token, currentPage]);
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
                        <JobDetails isClient={isClient} job={job} />
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

import React from "react";
import { Job } from "../../components/cards/appcards";
import { JobDescription, JobDetailsHeader } from "./jobdetailsheader";

import { StatusTag } from "./statustag";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "feather-icons-react";

interface JobCardProp {
  job: Job;
  isClient: boolean;
  offerId?: number;
}
const JobDetails = ({
  job,
  isClient,
  offerId,
}: JobCardProp): React.ReactNode => {
  const linkUrl = isClient
    ? `/client/manage-jobs/${job.id}`
    : `/provider/manage-jobs/${job.id}/${offerId}`;

  return (
    <section className="card-shadow p-4 rounded-[10px]">
      <div>
        <JobDetailsHeader job={job} isClient={isClient} />
        <JobDescription job={job} />
        <div className="py-2 pb-3">
          {isClient && (
            <StatusTag
              role={isClient ? "client" : "serviceProvider"}
              status={job.status}
            />
          )}
          {isClient && (
            <span className="inline-block ml-3 bg-gray-100 text-gray-600 border border-gray-500 text-xs px-2 py-1 rounded-full">
              {job?.offer?.length} Offers received
            </span>
          )}
        </div>
        <div className="mt-3" />
        <Link to={linkUrl} className="mt-3">
          <button
            className={`cursor-pointer h-12 w-full rounded-lg bg-gray-900 text-white transition duration-200 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
          >
            {isClient ? "Manage Job" : "Monitor Job"}
            <ArrowUpRight className="inline w-4 h-4 ml-2" />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default JobDetails;

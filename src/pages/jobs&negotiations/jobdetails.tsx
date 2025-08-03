import React from "react";
import { Job } from "../../components/cards/appcards";
import { useAuth } from "../../contexts/AuthContext";
import { JobDescription, JobDetailsHeader } from "./jobdetailsheader";

import ClientJobActions from "./clientactions";
import ProviderJobActions from "./provideractions";

interface JobCardProp {
  job: Job;
  isClient: boolean;
}
const JobDetails = ({ job, isClient }: JobCardProp): React.ReactNode => {
  const auth = useAuth();

  return (
    <section className="card-shadow p-4 rounded-[10px]">
      <div>
        <JobDetailsHeader job={job} isClient={isClient} />
        <JobDescription job={job} />
        <div className="my-4" />
        {isClient ? (
          <ClientJobActions job={job} />
        ) : (
          <ProviderJobActions job={job} />
        )}
      </div>
    </section>
  );
};

export default JobDetails;

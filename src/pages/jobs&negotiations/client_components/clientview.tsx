import React from "react";
import { Job, JobCard, JobCardView } from "../../../components/cards/appcards";
import OfferCardClient from "./clientoffercard";
import { Offer } from "../../../types/main.types";

const ClientView: React.FC<{
  job: Job;
  jobOffers: Offer[];
  onJobChange: (data: any) => void;
  onOfferChange: (data: any) => void;
  onOfferCounterChange: (offerId: any, data: any) => void;
}> = ({
  job,
  jobOffers,
  onJobChange,
  onOfferChange,
  onOfferCounterChange,
}): React.ReactNode => {
  return (
    <section>
      {/* Client Page Starts */}
      <h1 className="text-2xl font-semibold mb-4 tracking-tight">
        Monitor This Job
      </h1>
      <p className="text-gray-600">
        Track your job request and manage incoming offers from service providers
        in real time.
      </p>
      {/* Add client-specific components here */}
      <div className="mt-5">
        <p className="mb-2 text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-800 inline-block" />
          Job Details
        </p>
        <JobCardView job={job} onJobChange={onJobChange} />
      </div>
      <div className="mt-10">
        <p className="mb-2 text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-800 inline-block" />
          Offers Received
        </p>
        {jobOffers && jobOffers.length > 0 ? (
          jobOffers.map((offer, index) => (
            <div className="py-2" key={index}>
              <OfferCardClient
                onJobChange={onJobChange}
                onOfferChange={onOfferChange}
                onOfferCounterChange={onOfferCounterChange}
                job={job}
                offer={offer}
              />
            </div>
          ))
        ) : (
          <NoOffer />
        )}
      </div>
    </section>
  );
};

export default ClientView;

const NoOffer = () => (
  <div className="flex flex-col items-center justify-center border border-gray-200 rounded-2xl shadow-sm p-6">
    <div className="bg-gray-100 p-4 rounded-full mb-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h3.586a1 1 0 01.707.293l1.414 1.414A1 1 0 0013.414 7H17a2 2 0 012 2v10a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <p className="text-gray-500 text-sm italic text-center max-w-xs">
      No offers have been made for this job yet. When someone sends a proposal,
      it will show up here.
    </p>
  </div>
);

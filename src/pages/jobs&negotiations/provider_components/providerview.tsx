import React from "react";
import { JobCardView } from "../../../components/cards/appcards";
import ProviderOfferCard from "./providerofferview";
import { Offer } from "../../../types/main.types";

const ProviderView: React.FC<{ offer: Offer }> = ({
  offer,
}): React.ReactNode => {
  return (
    <section>
      {/* Provider Page Starts */}
      <div>
        <h1 className="text-2xl font-semibold mb-4 tracking-tight">
          Monitor Your Offer
        </h1>
        <p className="text-gray-600">
          Keep track of all your submitted offers, monitor responses, and stay
          updated on your service request progress.
        </p>
      </div>
      {/* Job Details View */}
      <div className="mt-10">
        <p className="mb-2 text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-800 inline-block" />
          Job Details
        </p>
        <JobCardView job={offer.serviceRequest} />
      </div>

      {/* Job Offer View */}
      <div className="mt-10">
        <p className="mb-2 text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-800 inline-block" />
          Your Offer
        </p>

        <ProviderOfferCard offer={offer} />
      </div>
    </section>
  );
};

export default ProviderView;

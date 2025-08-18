import React from "react";
import { Job, JobCardView } from "../../../components/cards/appcards";
import ProviderOfferCard from "./providerofferview";
import { Offer } from "../../../types/main.types";
const ProviderView: React.FC<{
  offer: Offer;
  onJobChange: (data: any) => void;
  onOfferChange: (data: any) => void;
  onOfferCounterChange: (offerId: number, data: any) => void;
  job: Job | null;
  load: () => void;
}> = ({
  job,
  offer,
  onJobChange,
  onOfferChange,
  onOfferCounterChange,
  load,
}): React.ReactNode => {
  console.log({
    jobInPView: job,
  });
  return (
    <section>
      {}
      <div>
        <h1 className="text-2xl font-semibold mb-4 tracking-tight">
          Monitor Your Offer
        </h1>
        <p className="text-gray-600">
          Keep track of all your submitted offers, monitor responses, and stay
          updated on your service request progress.
        </p>
      </div>
      {}
      <div className="mt-10">
        <p className="mb-2 text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-800 inline-block" />
          Job Details
        </p>
        <JobCardView
          onOfferChange={onOfferChange}
          onJobChange={onJobChange}
          job={job}
          load={load}
        />
      </div>

      {}
      <div className="mt-10">
        <p className="mb-2 text-gray-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-800 inline-block" />
          Your Offer
        </p>

        <ProviderOfferCard
          onOfferCounterChange={onOfferCounterChange}
          onJobChange={onJobChange}
          onOfferChange={onOfferChange}
          offer={offer}
        />
      </div>
    </section>
  );
};
export default ProviderView;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ClientView from "./client_components/clientview";
import ProviderView from "./provider_components/providerview";
import { getServiceRequest } from "../../api-services/servicerequests.service";
import { getAllOffers, getOfferById } from "../../api-services/offer.service";
import { ContentHOC } from "../../components/nocontent";
import { Job } from "../../components/cards/appcards";
import { Offer } from "../../types/main.types";

const JobView = (): React.ReactNode => {
  const auth = useAuth();
  const { id, offerId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [allJobOffers, setJobOffers] = useState<Offer[] | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobOrOffer = async () => {
    setLoading(true);
    setError(null);

    try {
      if (auth.isClient) {
        const response = await getServiceRequest(id as string, auth.token);
        console.log({ fetchingallloffers: true });
        const allOffers = await getAllOffers(auth.token, {
          servicerequest: Number(id),
          page: 1,
          limit: 10,
        });
        setJob(response?.data?.response || null);
        setJobOffers(allOffers?.data?.response || []);
        setOffer(null);
      } else if (offerId) {
        const response = await getOfferById(auth.token, Number(offerId));
        setOffer(response?.data?.response || null);
        setJob(null); // Optional: Clear job when loading from offer
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load data",
      );
    } finally {
      setLoading(false);
    }
  };

  const onJobChange = (data: Job) => {
    setJob(data);
    console.log("Job updated:", data);
  };

  const onOfferChange = (data: Offer) => {
    setJobOffers((prev) => {
      if (!prev) return prev; // If no offers yet, just return

      return prev.map((offer) => (offer.id === data.id ? data : offer));
    });

    console.log("On Offer Change", { data });
  };
  const onEvent = (data: any) => {
    console.log("On Job Change", { data });
  };

  useEffect(() => {
    loadJobOrOffer();
  }, [id, offerId]);

  return (
    <section className="min-h-screen pt-13">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto my-[70px]">
        <ContentHOC
          loading={loading}
          error={!!error}
          errMessage={error || ""}
          actionFn={loadJobOrOffer}
          noContent={auth?.isClient ? !job : !offer}
          minHScreen={false}
          UIComponent={
            auth?.isClient ? (
              job ? (
                <ClientView
                  onJobChange={onJobChange}
                  jobOffers={allJobOffers || []}
                  job={job}
                  onOfferChange={onOfferChange}
                />
              ) : null
            ) : offer ? (
              <ProviderView offer={offer} />
            ) : null
          }
        />
      </div>
    </section>
  );
};

export default JobView;

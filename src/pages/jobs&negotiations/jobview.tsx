import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ClientView from "./client_components/clientview";
import ProviderView from "./provider_components/providerview";
import { getServiceRequest } from "../../api-services/servicerequests.service";
import { getAllOffers, getOfferById } from "../../api-services/offer.service";
import { ContentHOC } from "../../components/nocontent";
import { Job } from "../../components/cards/appcards";
import { CounterOffer, Offer } from "../../types/main.types";
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
        const jobRes = await getServiceRequest(id as string, auth.token);
        console.log({
          fetchingallloffers: true,
        });
        const allOffers = await getAllOffers(auth.token, {
          servicerequest: Number(id),
          page: 1,
          limit: 10,
        });
        setJob(jobRes?.data?.response);
        setJobOffers(allOffers?.data?.response);
        console.log({
          jobOffersRes: allOffers,
        });
      } else if (offerId) {
        const jobRes = await getServiceRequest(id as string, auth.token);
        setJob(jobRes?.data?.response);
        console.log({
          fetchingallloffers: true,
        });
        const response = await getOfferById(auth.token, Number(offerId));
        setOffer(response?.data?.response);
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
      if (!prev) return prev;
      return prev.map((offer) => (offer.id === data.id ? data : offer));
    });
    console.log("On Offer Change", {
      data,
    });
  };
  const onOfferCounterChange = (offerId: number, counter: CounterOffer[]) => {
    console.log({
      counter,
      offerId,
    });
    if (auth.isProvider) {
      setOffer((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          counterOffer: counter,
        };
      });
    } else {
      setJobOffers((prev) => {
        if (!prev) return prev;
        const updatedOffers = prev.map((o) => {
          if (o.id === offerId) {
            const updatedOffer = {
              ...o,
              counterOffer: counter,
            };
            console.log({
              updatedOfferCounter: updatedOffer,
            });
            return updatedOffer;
          }
          return o;
        });
        return updatedOffers;
      });
    }
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
                  onOfferCounterChange={onOfferCounterChange}
                  load={loadJobOrOffer}
                />
              ) : null
            ) : offer ? (
              <ProviderView
                job={job}
                onOfferChange={onOfferChange}
                onOfferCounterChange={onOfferCounterChange}
                onJobChange={onJobChange}
                offer={offer}
                load={loadJobOrOffer}
              />
            ) : null
          }
        />
      </div>
    </section>
  );
};
export default JobView;

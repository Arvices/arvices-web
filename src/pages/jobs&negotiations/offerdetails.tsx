import React from "react";
import { User2, Layers } from "lucide-react";
import { CounterOffer, Offer } from "../../types/main.types";
import { useAuth } from "../../contexts/AuthContext";
import { getLatestCounterOffer } from "../../util/jobutils";
interface OfferDetailsProps {
  offer: CounterOffer | Offer;
  title: string;
  name: string;
}
export const OfferDetails: React.FC<OfferDetailsProps> = ({
  offer,
  title,
  name,
}) => {
  return (
    <div className="mb-4">
      <p className="text-gray-900 text-sm font-medium tracking-tight mb-1">
        {title}
      </p>

      <div className="border border-gray-100 rounded-md p-4 bg-gray-50 space-y-2">
        <p className="text-sm text-gray-700">
          <User2 className="inline-block mr-1" size={16} />{" "}
          <span className="font-medium">Offer By:</span> {name}
        </p>

        <p className="text-sm text-gray-700">
          <Layers className="inline-block mr-2" size={16} />
          <span className="font-medium">Proposed Price:</span> ₦{offer.price}
        </p>

        <p className="text-sm text-gray-700">
          <span className="font-medium">Description:</span> {offer.description}
        </p>

        <p className="text-xs text-gray-400">
          Created: {new Date(offer.createdDate).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
interface OfferHistoryProps {
  offer: Offer;
}
export const OfferHistory: React.FC<OfferHistoryProps> = ({ offer }) => {
  const auth = useAuth();
  const clientOffers = offer.counterOffer.filter((x) => x.type === "Client");
  const providerOffers = offer.counterOffer.filter(
    (x) => x.type === "Service Provider",
  );
  const latestClientOffer = getLatestCounterOffer(clientOffers);
  const latestProviderOffer = getLatestCounterOffer(providerOffers) || offer;
  const latestOffer = getLatestCounterOffer(offer.counterOffer);
  console.log({
    latestClientOffer,
    latestProviderOffer,
    latestOffer,
    counteroffers: offer.counterOffer,
  });
  const getPreviousOppositeTypeOffer = () => {
    if (!latestOffer) return null;
    if (latestOffer.type === "Client") {
      return latestProviderOffer;
    } else {
      return latestClientOffer;
    }
  };
  const prevOffer = getPreviousOppositeTypeOffer();
  console.log({
    prevOffer,
    latestOffer,
  });
  const clientview = (
    <div>
      {latestOffer && (
        <div>
          <OfferDetails
            name={latestOffer?.type == "Client" ? "You" : offer.user.username}
            offer={latestOffer}
            title={
              latestOffer?.type === "Client"
                ? "Your counter offer, waiting for the provider response"
                : "Provider made a counter offer, waiting for your response"
            }
          />
        </div>
      )}

      {prevOffer && (
        <div className="mt-4">
          <OfferDetails
            name={prevOffer?.type == "Client" ? "You" : offer.user.username}
            offer={prevOffer}
            title={
              prevOffer?.type === "Client"
                ? "Your previous counter offer"
                : "Provider's previous counter offer"
            }
          />
        </div>
      )}
    </div>
  );
  const providerview = (
    <div>
      {latestOffer && (
        <div>
          <OfferDetails
            name={
              latestOffer?.type == "Service Provider" ? "You" : "The Client"
            }
            offer={latestOffer}
            title={
              latestOffer?.type === "Service Provider"
                ? "Your counter offer, waiting for the client response"
                : "Client made a counter offer, waiting for your response"
            }
          />
        </div>
      )}

      {prevOffer && (
        <div className="mt-4">
          <OfferDetails
            name={
              prevOffer?.type
                ? prevOffer.type == "Service Provider"
                  ? "You"
                  : "The Client"
                : "You"
            }
            offer={prevOffer}
            title={
              prevOffer?.type
                ? prevOffer?.type === "Service Provider"
                  ? "Your previous counter offer"
                  : "Client's previous counter offer"
                : "Your Previous counter offer"
            }
          />
        </div>
      )}
    </div>
  );
  return (
    <div>
      {!latestOffer && (
        <div>
          <OfferDetails
            name={offer.user.fullName}
            offer={offer}
            title={auth.isClient ? "Offer from provider" : "Your Offer"}
          />
        </div>
      )}

      {auth.isClient ? clientview : providerview}
    </div>
  );
};

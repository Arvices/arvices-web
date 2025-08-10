import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  User2,
  Layers,
  CalendarDays,
  MessageSquare,
  Handshake,
} from "lucide-react";
import { CounterOffer, Offer } from "../../../types/main.types";
import { getOfferStatusStyle, Job } from "../../../components/cards/appcards";
import ActionButtons, { clientOfferActions } from "../jobsaction";
import { useLoading } from "../../../contexts/LoadingContext";
import { useNotificationContext } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { updateServiceRequest } from "../../../api-services/servicerequests.service";
import {
  createCounterOffer,
  getAllCounterOffers,
  updateOffer,
} from "../../../api-services/offer.service";
import { useNavigate } from "react-router-dom";
import NegotiationPanel from "../negotiationpanel";
import { GenericTag } from "../statustag";
import { getLatestCounterOffer } from "../../../util/jobutils";
import { OfferDetails, OfferHistory } from "../offerdetails";
import { initializeServiceRequestTransaction } from "../../../api-services/wallet.services";

interface Props {
  offer: Offer;
  job: Job;
  onJobChange: (data: Job) => void;
  onOfferChange: (data: Offer) => void;
  onOfferCounterChange: (offerId: any, data: CounterOffer[]) => void;
}

const OfferCardClient: React.FC<Props> = ({
  job,
  offer,
  onJobChange,
  onOfferChange,
  onOfferCounterChange,
}) => {
  const auth = useAuth();
  const { openNotification } = useNotificationContext();
  const { setLoading, setLoadingText } = useLoading();
  const navigate = useNavigate();
  const [showCounterForm, setShowCounterForm] = useState(false);

  const { user, price, description, createdDate, accepted } = offer;

  let latestOffer = getLatestCounterOffer(offer.counterOffer);

  let actions = clientOfferActions[offer.status];
  console.log({ actions });

  const handleUpdateJob = async (data: any) => {
    console.log("Edited offer submitted:", data);
    setLoading(true);
    setLoadingText("Updating service request...");

    try {
      let response = await updateServiceRequest(
        String(job.id),
        data,
        auth.token,
      );
      onJobChange(response.data.response);

      openNotification("topRight", "Service Request Updated", "", "success");
    } catch (error) {
      openNotification(
        "topRight",
        "Failed to update Service request",
        "Please try again later.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const handleUpdateOffer = async (data: any) => {
    console.log("Update offer submitted:", data);
    setLoading(true);
    setLoadingText("Updating service request...");

    try {
      let response = await updateOffer(auth.token, offer.id, data);
      onOfferChange(response.data.response);
    } catch (error) {
      openNotification(
        "topRight",
        "Failed update offer status",
        "Please try again later.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const getCounterOffers = async () => {
    try {
      const response = await getAllCounterOffers(auth.token, {
        page: 1,
        limit: 10,
        offer: offer.id,
      });
      let counterOffers = response?.data?.response;

      console.log("Counter offers:", counterOffers);
      onOfferCounterChange(offer.id, counterOffers);
    } catch (error) {
      console.error("Failed to fetch counter offers:", error);
      openNotification(
        "topRight",
        "Failed to fetch counter offers",
        "Please try again later.",
        "error",
      );
    }
  };

  const handleCreateCounterOffer = async (
    price: number,
    description: string,
  ) => {
    setLoading(true);
    setLoadingText("Creating counter offer...");

    let data = {
      price: String(price),
      description,
      offerId: offer.id,
    };
    try {
      let response = await createCounterOffer(auth.token, data);
      console.log({ counterOfferResponse: response });
      //let response = await updateOffer(auth.token, offer.id,  data);
      onOfferChange(response.data.response);
      setShowCounterForm(false);
      getCounterOffers();
    } catch (error) {
      openNotification(
        "topRight",
        "Failed to create counter offer",
        "Please try again later.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const goToMessageProvider = async () => {
    navigate(`/messaging/conversations?with=${offer.user.id}`);
  };

  const dummy = () => console.log("dummy called");

  const showBtns = latestOffer && latestOffer.type === "Service Provider";

  // map out the whole lot and assign your action functions.

  if (offer.status === "Pending") {
    actions.map((action) => {
      if (action.label === "Start Negotiation") {
        action.action = () => {
          handleUpdateOffer({ status: "Negotiating" });
          handleUpdateJob({ status: "Negotiating" });
        };
      } else if (action.label === "Message Provider") {
        action.action = goToMessageProvider;
      }
      return action;
    });
  } else if (offer.status === "Negotiating") {
    actions.map((action) => {
      if (action.label === "Accept This Proposal") {
        action.action = () => {
          handleUpdateOffer({ status: "Ongoing", accepted: true });
          handleUpdateJob({ status: "Ongoing", accepted: true });
        };
      } else if (action.label === "Make Counter Offer") {
        action.action = () => {
          setShowCounterForm(true);
        };
      } else if (action.label === "Message Provider") {
        action.action = () => {
          goToMessageProvider();
        };
      }
      return action;
    });
  } else {
    actions.map((action) => {
      if (action.label === "") {
      } else if (action.label === "") {
      }
      return action;
    });
  }
  if (!showBtns && status === "Negotiating") {
    console.log({ showBtns, actions });
    actions = actions.filter(
      (x) => x.label == "Message Provider", // remove Message Client button if showing counter/accept buttons
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex md:flex-row justify-between md:items-center mb-4">
        <div className="flex items-center justify-between gap-2 text-sm text-gray-500 w-max">
          <CalendarDays size={16} />
          <span>Received {formatDistanceToNow(new Date(createdDate))} ago</span>
        </div>
        <div className="w-max">
          <GenericTag
            label={offer.status}
            buttonStyle={getOfferStatusStyle(offer.status)}
          />
        </div>
      </div>

      <div className="border-t border-gray-100 mb-4" />

      <OfferHistory offer={offer} />
      <div className="border-t border-gray-100 mb-4" />

      {/* Footer Info 
      <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User2 size={16} />
          <span>{user?.fullName || "Service Provider"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-royalblue-dark">
          <Layers size={16} />₦{price}
        </div>
      </div>*/}

      {offer.status === "Negotiating" && showCounterForm && (
        <NegotiationPanel
          job={job}
          offer={offer}
          isClient={auth.isClient}
          onAccept={dummy}
          onCancel={() => {
            setShowCounterForm(false);
          }}
          onCounter={handleCreateCounterOffer}
          onUpdate={dummy}
        />
      )}

      {!showBtns && offer.status === "Negotiating" && (
        <p className="text-gray-600 text-sm font-medium tracking-tight mb-4">
          Awaiting client response on your submitted offer.
        </p>
      )}

      {offer.status === "Ongoing" && (
        <p className="text-gray-600 text-sm font-medium tracking-tight mb-4">
          You will be notified to review when the provider marks the job as
          completed.
        </p>
      )}

      <div className="border-t border-gray-100 my-4" />
      {/* Call to Action (if needed) */}
      <ActionButtons actions={actions} />
    </div>
  );
};

export default OfferCardClient;

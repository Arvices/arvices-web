import React from "react";
import { formatDistanceToNow } from "date-fns";
import {
  User2,
  Layers,
  CalendarDays,
  MessageSquare,
  Handshake,
} from "lucide-react";
import { Offer } from "../../../types/main.types";
import { getOfferStatusStyle, Job } from "../../../components/cards/appcards";
import ActionButtons, { buttonClasses, clientOfferActions } from "../jobsaction";
import { useLoading } from "../../../contexts/LoadingContext";
import { useNotificationContext } from "../../../contexts/NotificationContext";
import { useAuth } from "../../../contexts/AuthContext";
import { updateServiceRequest } from "../../../api-services/servicerequests.service";
import { updateOffer } from "../../../api-services/offer.service";
import { useNavigate } from "react-router-dom";
import NegotiationPanel from "../negotiationpanel";
import { GenericTag } from "../statustag";

interface Props {
  offer: Offer;
  job: Job;
  onJobChange: (data: Job) => void;
  onOfferChange: (data: Offer) => void;
}

const OfferCardClient: React.FC<Props> = ({
  job,
  offer,
  onJobChange,
  onOfferChange,
}) => {
  const auth = useAuth();
  const { openNotification } = useNotificationContext();
  const { setLoading, setLoadingText } = useLoading();
  const navigate = useNavigate();

  const { user, price, description, createdDate, accepted } = offer;

  const actions = clientOfferActions[offer.status];

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

  const goToMessageProvider = async () => {
    navigate(`/messaging/conversations?with=${offer.user.id}`)
  }
  
  const dummy = () => console.log("dummy called")

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
      if (action.label === "Close Negotiation") {
        action.action = () => {
          handleUpdateOffer({ status: "Pending" });
          handleUpdateJob({ status: "Open" });
        };
      } else if (action.label === "Message Provider") {
        action.action = goToMessageProvider;
      }
      return action;
    });
  } else if (offer.status === "Ongoing") {
    actions.map((action) => {
      if (action.label === "") {
      } else if (action.label === "") {
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

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={16} />
          <span>Received {formatDistanceToNow(new Date(createdDate))} ago</span>
        </div>
        <div>
          <GenericTag label={offer.status} buttonStyle={getOfferStatusStyle(offer.status)} />
        </div>
      </div>

      <div className="border-t border-gray-100 mb-4" />

      {/* Offer Description */}
      <div className="mb-4">
        <p className="text-gray-900 text-sm font-medium tracking-tight mb-1">
          Provider’s Offer Details
        </p>

      {/* Offer Details */}
      <div className="border border-gray-100 rounded-md p-4 bg-gray-50 space-y-2">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Offer By:</span>{" "}
         <User2 className="inline-block mr-1" size={16} />  {offer.user?.fullName || "Unknown User"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Proposed Price:</span> <Layers className="inline-block mr-2" size={16} />₦{offer.price}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Description:</span> {offer.description}
        </p>
        <p className="text-xs text-gray-400">
          Created: {new Date(offer.createdDate).toLocaleString()}
        </p>
      </div>
      </div>

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

      <div className="border-t border-gray-100 my-4" />

      {/* Call to Action (if needed) */}
      <ActionButtons actions={actions} />

      {offer.status === "Negotiating" && (
        <NegotiationPanel job={job} offer={offer} isClient={auth.isClient} onAccept={dummy} onWithdraw={dummy} onAssign={dummy} onCounter={dummy} onUpdate={dummy} />
      )}
    </div>
  );
};

export default OfferCardClient;

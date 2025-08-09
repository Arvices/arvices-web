import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays, Layers, User2 } from "lucide-react";
import { Modal } from "antd";
import { Offer } from "../../../types/main.types";
import ActionButtons, { buttonClasses, offerActions } from "../jobsaction"; // Adjust import path if needed
import EditOffer, { OfferData } from "./editoffer";
import {
  getOfferStatusStyle,
  OfferStatus,
} from "../../../components/cards/appcards";
import { GenericTag } from "../statustag";
import { OfferHistory } from "../offerdetails";
import NegotiationPanel from "../negotiationpanel";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotificationContext } from "../../../contexts/NotificationContext";
import { useLoading } from "../../../contexts/LoadingContext";
import { useNavigate } from "react-router-dom";
import {
  createCounterOffer,
  getAllCounterOffers,
  updateOffer,
} from "../../../api-services/offer.service";
import { getLatestCounterOffer } from "../../../util/jobutils";
import { updateServiceRequest } from "../../../api-services/servicerequests.service";

interface Props {
  offer: Offer;
  onJobChange: (data:any)=> void;
  onOfferChange: (data:any) =>void;
  onOfferCounterChange: (offerId:number,data:any)=>void;
}

const ProviderOfferCard: React.FC<Props> = ({ offer, onOfferChange, onOfferCounterChange, onJobChange }) => {
  const auth = useAuth();
  const { openNotification } = useNotificationContext();
  const { setLoading, setLoadingText } = useLoading();
  const navigate = useNavigate();
  const {
    serviceRequest: job,
    price,
    description,
    createdDate,
    accepted,
  } = offer;

  let actions = offerActions[offer.status];

  const goToMessageClient = () => {
    navigate(`/messaging/conversations`);
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
  // Get latest ones
  const latestOffer = getLatestCounterOffer(offer.counterOffer);

  const showBtns = latestOffer && latestOffer.type === "Client";

  if (offer.status === "Pending") {
    actions = actions.map((action) => {
      if (action.label === "Edit Offer") {
        action.action = () => setShowEditView(true);
      } else if (action.label === "Withdraw Offer") {
        action.action = () => setShowCancelModal(true);
      }
      return action;
    });
  } else if (offer.status === "Negotiating") {
    console.log({ showBtns });

    actions = actions.map((action) => {
      if (action.label === "Message Client") {
        action.action = goToMessageClient;
      } else if (action.label === "Accept Client's Offer" && showBtns) {
        // define accept logic
        action.action = () => {
          handleUpdateOffer({ status: "Ongoing", accepted: true });
          handleUpdateJob({ status: "Ongoing", accepted: true });
        };
      } else if (action.label === "Make Counter Offer" && showBtns) {
        action.action = () => {
          setShowCounterForm(true);
        };
      }
      return action;
    });

    // Only filter if `showBtns` is true
    if (!showBtns) {
      actions = actions.filter(
        (x) => x.label == "Message Client", // remove Message Client button if showing counter/accept buttons
      );
    }
  }

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditView, setShowEditView] = useState(false);

  const toggleCancelModal = () => setShowCancelModal((prev) => !prev);
  const toggleEditView = () => setShowEditView((prev) => !prev);

  const [showCounterForm, setShowCounterForm] = useState(false);

  const handleCancelOffer = () => {
    // Add actual cancel logic here
    console.log("Offer cancelled");
    setShowCancelModal(false);
  };

  const handleEditSubmit = (data: any) => {
    console.log("Edited offer submitted:", data);
    toggleEditView();
  };

  const handleEditCancel = () => {
    console.log("Edit cancelled");
    toggleEditView();
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

  const dummy = () => console.log("dummy called");

  // Check if editing
  if (showEditView) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <EditOffer
          initialData={{
            description: offer?.description,
            price: Number(offer?.price),
          }}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={16} />
          <span>
            Offer Sent {formatDistanceToNow(new Date(createdDate))} ago
          </span>
        </div>
        <div className="w-max">
          <GenericTag
            label={offer.status}
            buttonStyle={getOfferStatusStyle(offer.status)}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      <OfferHistory offer={offer} />

      {offer.status === "Negotiating" && showCounterForm && (
        <div>
          <div className="border-t border-gray-100 mb-4" />
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
        </div>
      )}

      {!showBtns && (
        <p className="text-gray-600 text-sm font-medium tracking-tight mb-4">
          Awaiting client response on your submitted offer.
        </p>
      )}
      <div className="border-t border-gray-100 mb-4" />
      {/* Actions */}
      <ActionButtons actions={actions} />

      {/* Cancel Confirmation Modal */}
      <Modal
        title="Cancel Offer"
        open={showCancelModal}
        onOk={handleCancelOffer}
        onCancel={toggleCancelModal}
        okText="Yes, Cancel"
        cancelText="Keep Offer"
      >
        <p>
          Are you sure you want to cancel this offer? This action is
          irreversible.
        </p>
      </Modal>
    </div>
  );
};

export default ProviderOfferCard;

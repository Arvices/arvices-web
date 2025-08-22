import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Modal } from "antd";
import { Offer } from "../../../types/main.types";
import ActionButtons, { offerActions } from "../jobsaction";
import EditOffer from "./editoffer";
import { getOfferStatusStyle } from "../../../components/cards/appcards";
import { GenericTag } from "../statustag";
import { OfferHistory } from "../offerdetails";
import NegotiationPanel from "../negotiationpanel";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotificationContext } from "../../../contexts/NotificationContext";
import { useLoading } from "../../../contexts/LoadingContext";
import { useNavigate } from "react-router-dom";
import {
  createCounterOffer,
  deleteOffer,
  getAllCounterOffers,
  updateOffer,
} from "../../../api-services/offer.service";
import { getLatestCounterOffer } from "../../../util/jobutils";
import { updateServiceRequest } from "../../../api-services/servicerequests.service";
import { parseHttpError } from "../../../api-services/parseReqError";
interface Props {
  offer: Offer;
  onJobChange: (data: any) => void;
  onOfferChange: (data: any) => void;
  onOfferCounterChange: (offerId: number, data: any) => void;
}
const ProviderOfferCard: React.FC<Props> = ({
  offer,
  onOfferChange,
  onOfferCounterChange,
  onJobChange,
}) => {
  const auth = useAuth();
  const { openNotification } = useNotificationContext();
  const { setLoading, setLoadingText } = useLoading();
  const navigate = useNavigate();
  const { serviceRequest: job, createdDate } = offer;
  console.log({offerInCheck: offer})
  let actions = offerActions[offer.status];
  const goToMessageClient = () => {
    navigate(`/messaging/conversations?with=${job?.user?.id}`);
  };
  const getCounterOffers = async () => {
    try {
      const response = await getAllCounterOffers(auth.token, {
        page: 1,
        limit: 10,
        offer: offer.id,
      });
      let counterOffers = response?.data?.response;
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
  const handleNotifyForCompletion = async () => {
    openNotification(
      "topRight",
      "Cient will be notified that you have completed the job.",
      "After the client confirms completion, payment would be disbursed.",
      "info",
    );
  };
  const latestOffer = getLatestCounterOffer(offer.counterOffer);
  let showBtns = false;
  if (latestOffer && latestOffer.type === "Client") {
    showBtns = true;
  }
  actions.map((action) => {
    if (action.label === "Message Client") {
      action.action = goToMessageClient;
    }
    return action;
  });
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
    actions = actions.map((action) => {
      if (action.label === "Accept Client's Offer" && showBtns) {
        action.action = () => {
          handleUpdateOffer({
            status: "Ongoing",
            accepted: true,
          });
          handleUpdateJob({
            status: "Ongoing",
            accepted: true,
          });
        };
      } else if (action.label === "Make Counter Offer" && showBtns) {
        action.action = () => {
          setShowCounterForm(true);
        };
      }
      return action;
    });
    if (!showBtns) {
      actions = actions.filter((x) => x.label == "Message Client");
    }
  } else if (offer.status === "Ongoing") {
    actions = actions.map((action) => {
      if (action.label === "Notify Client Of Job Completion") {
        action.action = handleNotifyForCompletion;
      }
      return action;
    });
  }
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const toggleCancelModal = () => setShowCancelModal((prev) => !prev);
  const toggleEditView = () => setShowEditView((prev) => !prev);
  const [showCounterForm, setShowCounterForm] = useState(false);

  const handleCancelOffer = async () => {
    setShowCancelModal(false);
    setLoading(true);
    setLoadingText("Cancelling offer...");

    try {
      await deleteOffer(auth.token, offer.id);

      openNotification(
        "topRight",
        "Success",
        "Offer cancelled successfully.",
        "success",
      );

      navigate("/provider/manage-jobs");
    } catch (error) {
      console.error("Failed to cancel offer:", error);

      const errorMessage = parseHttpError(error);
      openNotification(
        "topRight",
        "Error",
        errorMessage || "Unable to cancel offer.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  const handleEditSubmit = async (data: any) => {
    setLoading(true);
    setLoadingText("Updating offer...");

    try {
      const response = await updateOffer(auth.token, offer.id, {
        price: String(data.price),
        description: data.description,
      });

      onOfferChange(response.data.response);

      openNotification(
        "topRight",
        "Success",
        "Offer updated successfully.",
        "success",
      );

      toggleEditView();
    } catch (error) {
      console.error("Failed to update offer:", error);

      const errorMessage = parseHttpError(error);
      openNotification(
        "topRight",
        "Error",
        errorMessage || "Unable to update offer.",
        "error",
      );
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };
  const handleEditCancel = () => {
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
      await createCounterOffer(auth.token, data);
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
      {}
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

      {}
      <div className="border-t border-gray-100 mb-4" />

      <OfferHistory offer={offer} />

      {offer.status === "Negotiating" && showCounterForm && (
        <div>
          <div className="border-t border-gray-100 mb-4" />
          <NegotiationPanel
            job={job}
            offer={offer}
            isClient={auth.isClient}
            onCancel={() => {
              setShowCounterForm(false);
            }}
            onCounter={handleCreateCounterOffer}
          />
        </div>
      )}

      {!showBtns && offer.status === "Negotiating" && (
        <p className="text-gray-600 text-sm font-medium tracking-tight mb-4">
          Awaiting client response on your submitted offer.
        </p>
      )}
      {!showBtns && offer.status === "Completed" && (
        <p className="text-gray-600 text-sm font-medium tracking-tight mb-4">
          Job Completed - Client has made payments
        </p>
      )}
      <div className="border-t border-gray-100 mb-4" />
      {}
      <ActionButtons actions={actions} />

      {}
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

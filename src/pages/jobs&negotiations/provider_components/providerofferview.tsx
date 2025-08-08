import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays, Layers, User2 } from "lucide-react";
import { Modal } from "antd";
import { Offer } from "../../../types/main.types";
import { buttonClasses, offerActions } from "../jobsaction"; // Adjust import path if needed
import EditOffer, { OfferData } from "./editoffer";
import { OfferStatus } from "../../../components/cards/appcards";

interface Props {
  offer: Offer;
}

const ProviderOfferCard: React.FC<Props> = ({ offer }) => {
  const {
    serviceRequest: job,
    price,
    description,
    createdDate,
    accepted,
  } = offer;

  let action: OfferStatus = "Pending";
  let actions = offerActions[action];

  if (action === "Pending") {
    actions = actions.map((action, index) => {
      if (action.label === "Edit Offer") {
        action.action = () => setShowEditView(true);
      } else if (action.label === "Withdraw Offer") {
        action.action = () => setShowCancelModal(true);
      }
      return action;
    });
  }

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showEditView, setShowEditView] = useState(false);

  const toggleCancelModal = () => setShowCancelModal((prev) => !prev);
  const toggleEditView = () => setShowEditView((prev) => !prev);

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
        <div
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            accepted
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {action.toUpperCase()}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4" />

      {/* Offer Description */}
      <div className="mb-4">
        <p className="text-gray-900 text-sm font-medium">Your Solution</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="border-t border-gray-100 mb-4" />

      {/* Footer */}
      <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User2 size={16} />
          <span>Client: {job?.user?.fullName || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-royalblue-dark">
          <Layers size={16} />₦{price}
        </div>
      </div>

      <div className="border-t border-gray-100 mb-4" />

      {/* Actions */}
      <div className="flex gap-3">
        {actions.map(({ label, action, styleClass, icon: Icon }) => {
          const isEdit = label.toLowerCase() === "edit";
          const isCancel = label.toLowerCase().includes("cancel");

          return (
            <button
              key={label}
              onClick={
                isEdit ? toggleEditView : isCancel ? toggleCancelModal : action
              }
              className={`flex-1 rounded-lg transition ${buttonClasses[styleClass]}`}
            >
              {Icon && <Icon className="inline h-11" size={16} />}
              {label}
            </button>
          );
        })}
      </div>

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

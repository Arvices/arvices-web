import React from "react";
import { formatDistanceToNow } from "date-fns";
import { User2, Layers, CalendarDays, MessageSquare , Handshake} from "lucide-react";
import { Offer } from "../../../types/main.types";
import { Job } from "../../../components/cards/appcards";
import ActionButtons, { buttonClasses, clientJobActions, ClientJobState, JobActionItem } from "../jobsaction";

interface Props {
  offer: Offer;
  job: Job;
}

const OfferCardClient: React.FC<Props> = ({ job, offer }) => {
  const { user, price, description, createdDate, accepted, serviceRequest } =
    offer;

    
  let action: ClientJobState = "open"; // This would typically come from business logic

let openAction: JobActionItem[] = [
  {
    label: "Accept Offer",
    action: () => {
      // handle accept logic here
    },
    styleClass: "primary",
    icon: Handshake,
  },
  {
    label: "Message Provider",
    action: () => {
      // handle message logic here
    },
    styleClass: "outline",
    icon: MessageSquare,
  },
];

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={16} />
          <span>Received {formatDistanceToNow(new Date(createdDate))} ago</span>
        </div>
        <div
          className={`text-sm font-medium px-3 py-1 rounded-full ${
            accepted
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {accepted ? "Accepted" : "Pending"}
        </div>
      </div>

      <div className="border-t border-gray-100 mb-4" />

      {/* Offer Description */}
      <div className="mb-4">
        <p className="text-gray-900 text-sm font-medium tracking-tight mb-1">
          Provider’s Offer
        </p>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="border-t border-gray-100 mb-4" />

      {/* Footer Info */}
      <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <User2 size={16} />
          <span>{user?.fullName || "Service Provider"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-royalblue-dark">
          <Layers size={16} />₦{price}
        </div>
      </div>

      <div className="border-t border-gray-100 my-4" />

      {/* Call to Action (if needed) */}
      <ActionButtons actions={openAction} />
    </div>
  );
};

export default OfferCardClient;

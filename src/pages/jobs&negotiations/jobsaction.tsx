import {
  MessageCircle,
  FileEdit,
  Upload,
  CheckCheck,
  Trash2,
  LucideIcon,
  MessageSquare,
  Handshake,
  CheckCircle,
} from "lucide-react";

import { Star, Repeat, FileText } from "lucide-react";
import { JobStatus, OfferStatus } from "../../components/cards/appcards";

export interface JobActionItem {
  label: string;
  action: () => void;
  styleClass: ButtonStyleName;
  icon?: LucideIcon;
  show?: boolean;
}

// Define job states for clarity

export const buttonClasses = {
  neutral:
    "cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-gray-300",
  primary:
    "cursor-pointer bg-royalblue-tint5 text-royalblue-main hover:bg-royalblue-tint4 focus:bg-royalblue-tint5 focus:ring-2 focus:ring-blue-300",
  danger:
    "cursor-pointer bg-red-100 text-red-700 hover:bg-red-200 focus:bg-red-200 focus:ring-2 focus:ring-red-300",
  outline:
    "cursor-pointer border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-300",
  subtle:
    "cursor-pointer bg-white text-gray-500 hover:bg-gray-50 focus:bg-gray-50 focus:ring-2 focus:ring-gray-200",
  mutedBlue:
    "cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 focus:bg-blue-100 focus:ring-2 focus:ring-blue-200",
  mutedGreen:
    "cursor-pointer bg-green-50 text-green-600 hover:bg-green-100 focus:bg-green-100 focus:ring-2 focus:ring-green-200",
  mutedYellow:
    "cursor-pointer bg-yellow-50 text-yellow-700 hover:bg-yellow-100 focus:bg-yellow-100 focus:ring-2 focus:ring-yellow-200",
  mutedPurple:
    "cursor-pointer bg-purple-50 text-purple-600 hover:bg-purple-100 focus:bg-purple-100 focus:ring-2 focus:ring-purple-200",
  mutedSlate:
    "cursor-pointer bg-slate-100 text-slate-600 hover:bg-slate-200 focus:bg-slate-200 focus:ring-2 focus:ring-slate-300",
} as const;

export type ButtonStyleName = keyof typeof buttonClasses;

export type JobActionsMap<T extends string> = Record<T, JobActionItem[]>;

export interface JobActionsProps {
  job: any;
}

export const offerActions: JobActionsMap<OfferStatus> = {
  Pending: [
    {
      label: "Edit Offer",
      action: () => console.log("Editing offer"),
      styleClass: "primary",
      icon: FileEdit,
    },
    {
      label: "Withdraw Offer",
      action: () => console.log("Withdrawing offer"),
      styleClass: "danger",
      icon: Trash2,
    },
  ],
  Negotiating: [
    {
      label: "Message Client",
      action: () => console.log("Continuing chat"),
      styleClass: "primary",
      icon: MessageCircle,
    },
    {
      label: "Accept Client's Offer",
      action: () => console.log("Updating offer"),
      styleClass: "mutedGreen",
      icon: CheckCircle,
    },
    {
      label: "Make Counter Offer",
      action: () => console.log("Withdrawing offer"),
      styleClass: "neutral",
      icon: Repeat,
    },
  ],
  Ongoing: [
    {
      label: "Send Update",
      action: () => console.log("Sending update"),
      styleClass: "neutral",
      icon: MessageCircle,
    },
    {
      label: "Upload Work",
      action: () => console.log("Uploading work"),
      styleClass: "primary",
      icon: Upload,
    },
    {
      label: "Request Completion",
      action: () => console.log("Requesting completion"),
      styleClass: "primary",
      icon: CheckCheck,
    },
  ],
  Completed: [
    {
      label: "View Feedback",
      action: () => console.log("Viewing feedback"),
      styleClass: "subtle",
    },
    {
      label: "Message Client",
      action: () => console.log("Messaging client"),
      styleClass: "outline",
      icon: MessageCircle,
    },
  ],
};

export const jobActions: JobActionsMap<JobStatus> = {
  Open: [
    {
      label: "Edit Job",
      action: () => console.log("Editing job"),
      styleClass: "neutral",
      icon: FileEdit,
    },
    {
      label: "Close Job",
      action: () => console.log("Closing job"),
      styleClass: "danger",
      icon: Trash2,
    },
  ],
  Negotiating: [
    {
      label: "Close Job",
      action: () => console.log("Closing job"),
      styleClass: "danger",
      icon: Trash2,
    },
  ],
  Ongoing: [
    {
      label: "Request Update",
      action: () => console.log("Requesting update"),
      styleClass: "neutral",
      icon: MessageCircle,
    },
    {
      label: "Cancel Job",
      action: () => console.log("Cancelling job"),
      styleClass: "danger",
      icon: Trash2,
    },
    {
      label: "Mark as Completed",
      action: () => console.log("Marking job as completed"),
      styleClass: "primary",
      icon: CheckCheck,
    },
  ],
  Completed: [
    {
      label: "View Summary",
      action: () => console.log("Viewing summary"),
      styleClass: "subtle",
      icon: FileText,
    },
    {
      label: "Rehire Provider",
      action: () => console.log("Rehiring provider"),
      styleClass: "primary",
      icon: Repeat,
    },
    {
      label: "Rate Provider",
      action: () => console.log("Rating provider"),
      styleClass: "primary",
      icon: Star,
    },
  ],
  Closed: [
    {
      label: "Re-Open This Job",
      action: () => console.log("Viewing summary"),
      styleClass: "mutedYellow",
      icon: FileText,
    },
  ],
};

export const clientOfferActions: JobActionsMap<OfferStatus> = {
  Pending: [
    {
      label: "Start Negotiation",
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
  ],
  Negotiating: [
    {
      label: "Message Provider",
      action: () => {
        // handle message logic here
      },
      styleClass: "mutedBlue",
      icon: MessageSquare,
    },
    {
      label: "Accept This Proposal",
      action: () => {
        // handle accept proposal logic here
      },
      styleClass: "mutedGreen",
      icon: CheckCircle,
    },
    {
      label: "Make Counter Offer",
      action: () => {
        // handle counter offer logic here
      },
      styleClass: "primary",
      icon: Repeat,
    },
  ],
  Ongoing: [],
  Completed: [],
};

interface ActionButtonsProps {
  actions: JobActionItem[];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ actions }) => {
  return (
    <div className="flex gap-3">
      {actions.map(({ label, action, styleClass, icon: Icon }) => (
        <button
          key={label}
          type="button"
          onClick={action}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${buttonClasses[styleClass]}`}
        >
          {Icon && <Icon className="w-4 h-4" />}
          {label}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;

import { ArrowUpRight, LucideIcon } from "lucide-react";
import {
  MessageCircle,
  FileEdit,
  Upload,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { Star, Repeat, FileText } from "lucide-react";

export interface JobActionItem {
  label: string;
  action: () => void;
  styleClass: ButtonStyleName;
  icon?: LucideIcon;
}

// Define job states for clarity
export type ClientJobState =
  | "all"
  | "open"
  | "negotiating"
  | "ongoing"
  | "completed";
export type ProviderJobState =
  | "all"
  | "pending"
  | "negotiating"
  | "ongoing"
  | "completed";

// Action type: now representing an array of action labels
type JobActionsMap_array<State extends string> = Record<State, string[]>;

// Client-specific job actions map
export const clientJobActions_array: JobActionsMap_array<ClientJobState> = {
  all: [],
  open: ["View Offers", "Edit Job", "Close Job"],
  negotiating: ["Chat with Provider", "Accept Offer", "Decline Offer"],
  ongoing: ["Request Update", "Cancel Job", "Mark as Completed"],
  completed: ["View Summary", "Rehire Provider", "Rate Provider"],
};

// Provider-specific job actions map
export const providerJobActions_array: JobActionsMap_array<ProviderJobState> = {
  all: [],
  pending: ["Edit Offer", "Withdraw Offer"],
  negotiating: ["Continue Chat", "Update Offer", "Withdraw Offer"],
  ongoing: ["Send Update", "Upload Work", "Request Completion"],
  completed: ["View Feedback", "Message Client", "Rate Client"],
};
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
} as const;

export type ButtonStyleName = keyof typeof buttonClasses;

export type JobActionsMap<T extends string> = Record<T, JobActionItem[]>;

export interface JobActionsProps {
  job: any; // Adjust to your actual job type
}

export const providerJobActions: JobActionsMap<ProviderJobState> = {
  all: [],
  pending: [
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
  negotiating: [
    {
      label: "Continue Chat",
      action: () => console.log("Continuing chat"),
      styleClass: "primary",
      icon: MessageCircle,
    },
    {
      label: "Update Offer",
      action: () => console.log("Updating offer"),
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
  ongoing: [
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
  completed: [
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

export const clientJobActions: JobActionsMap<ClientJobState> = {
  all: [],
  open: [
    {
      label: "View Offers",
      action: () => console.log("Viewing offers"),
      styleClass: "primary",
      icon: ArrowUpRight,
    },
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
  negotiating: [
    {
      label: "Chat with Provider",
      action: () => console.log("Chatting with provider"),
      styleClass: "primary",
      icon: MessageCircle,
    },
    {
      label: "Accept Offer",
      action: () => console.log("Accepting offer"),
      styleClass: "primary",
      icon: CheckCheck,
    },
    {
      label: "Decline Offer",
      action: () => console.log("Declining offer"),
      styleClass: "danger",
      icon: Trash2,
    },
  ],
  ongoing: [
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
  completed: [
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
};

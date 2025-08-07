import React from "react";
import { JobStatusType } from "../../components/cards/appcards";

// ---- Status Enum Replacement ----

// ---- Role Definition ----
export type Role = "client" | "serviceProvider";

type TagMeta = {
  label: string;
  className: string; // color class or AntD/Vuesax color string
};
// ---- Tag Mapping per Role ----
const jobStatusTagMap: Record<Role, Record<JobStatusType, TagMeta>> = {
  client: {
    Open: {
      label: "Looking for a Provider",
      className:
        "bg-gray-100 text-gray-600 border border-gray-500 text-xs px-2 py-1 rounded-full",
    },
    Negotiating: {
      label: "In Negotiation",
      className:
        "bg-blue-100 text-blue-600 border border-blue-500 text-xs px-2 py-1 rounded-full",
    },
    Assigned: {
      label: "Provider Assigned",
      className:
        "bg-purple-100 text-purple-600 border border-purple-500 text-xs px-2 py-1 rounded-full",
    },
    Ongoing: {
      label: "In Progress",
      className:
        "bg-orange-100 text-orange-600 border border-orange-500 text-xs px-2 py-1 rounded-full",
    },
    Completed: {
      label: "Completed",
      className:
        "bg-green-100 text-green-600 border border-green-500 text-xs px-2 py-1 rounded-full",
    },
    Cancelled: {
      label: "Cancelled",
      className:
        "bg-red-100 text-red-600 border border-red-500 text-xs px-2 py-1 rounded-full",
    },
  },
  serviceProvider: {
    Open: {
      label: "Your Offer Is Pending",
      className:
        "bg-gray-100 text-gray-600 border border-gray-500 text-xs px-2 py-1 rounded-full",
    },
    Negotiating: {
      label: "Negotiating with Client",
      className:
        "bg-blue-100 text-blue-600 border border-blue-500 text-xs px-2 py-1 rounded-full",
    },
    Assigned: {
      label: "You Got the Job",
      className:
        "bg-purple-100 text-purple-600 border border-purple-500 text-xs px-2 py-1 rounded-full",
    },
    Ongoing: {
      label: "Working on It",
      className:
        "bg-orange-100 text-orange-600 border border-orange-500 text-xs px-2 py-1 rounded-full",
    },
    Completed: {
      label: "Finished",
      className:
        "bg-green-100 text-green-600 border border-green-500 text-xs px-2 py-1 rounded-full",
    },
    Cancelled: {
      label: "Client Cancelled",
      className:
        "bg-red-100 text-red-600 border border-red-500 text-xs px-2 py-1 rounded-full",
    },
  },
};

// ---- Helper Function ----
export function getJobStatusTag(role: Role, status: JobStatusType): TagMeta {
  return jobStatusTagMap[role][status];
}

// ---- StatusTag Component ----
interface StatusTagProps {
  role: Role;
  status: JobStatusType;
  className?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({
  role,
  status,
  className,
}) => {
  const { label, className: defaultClassName } = getJobStatusTag(role, status);

  return (
    <span className={`${defaultClassName} ${className || ""}`}>{label}</span>
  );
};

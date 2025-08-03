import React from "react";
import { MoreVertical } from "lucide-react";
import { Dropdown, Menu } from "antd";
import moment from "moment";
import { Job } from "../../components/cards/appcards";
import { MapPin } from "feather-icons-react";

interface JobDetailsHeaderProps {
  job: Job;
  isClient: boolean;
}

export const JobDetailsHeader: React.FC<JobDetailsHeaderProps> = ({
  job,
  isClient,
}) => {
  const timeAgo = moment(job.createdDate).fromNow(); // e.g., "23 minutes ago"

  const menu = (
    <Menu
      items={[
        { key: "1", label: "View Details" },
        { key: "2", label: "Edit Job" },
        { key: "3", label: "Delete Job", danger: true },
      ]}
    />
  );

  return (
    <div className="flex items-start justify-between w-full">
      {/* Left: Job text */}
      <div className="text-muted-foreground tracking-tight">
        <div className="font-medium text-foreground tracking-tight">
          {isClient ? "You posted this" : `Posted by ${job.user?.fullName}`}
        </div>
        <div className="text-sm mt-0.5 text-gray-500">
          {timeAgo} &mdash;{" "}
          <span className="capitalize">{job.category.name}</span> category
        </div>

        <div className="max-w-max text-[14px] mt-1.5">
          <p className="text-royalblue-shade2 font-medium cursor-pointer tracking-tight">
            {" "}
            <MapPin className="inline" size={13} />{" "}
            {job.user?.address ?? "No address"}
          </p>
        </div>
      </div>

      {/* Right: Menu */}
      <div className="w-max">
        <Dropdown overlay={menu} trigger={["click"]}>
          <button className="rounded-full hover:bg-muted transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </Dropdown>
      </div>
    </div>
  );
};

interface JobDescriptionProps {
  job?: Job;
}

export const JobDescription: React.FC<JobDescriptionProps> = ({ job }) => {
  if (!job?.description) return null;

  return (
    <div className="mt-6 text-muted-foreground tracking-tight text-[14]">
      <h3 className="font-medium tracking-tighter">Description</h3>
      <p className="text-sm text-muted-foreground leading-relaxed text-gray-700">
        {job.description}
      </p>
    </div>
  );
};

import React from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import {
  FilePlus,
  MessagesSquare,
  RefreshCcw,
  CheckCircle,
  Clock,
  ListChecks,
} from "lucide-react";
import { ChevronDown, Filter } from "feather-icons-react";
type TabItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};
const clientTabs: TabItem[] = [
  {
    key: "All",
    label: "All",
    icon: <ListChecks className="w-4 h-4" />,
  },
  {
    key: "Open",
    label: "Open",
    icon: <FilePlus className="w-4 h-4" />,
  },
  {
    key: "Negotiating",
    label: "Negotiating",
    icon: <MessagesSquare className="w-4 h-4" />,
  },
  {
    key: "Ongoing",
    label: "Ongoing",
    icon: <RefreshCcw className="w-4 h-4" />,
  },
  {
    key: "Completed",
    label: "Completed",
    icon: <CheckCircle className="w-4 h-4" />,
  },
];
const providerTabs: TabItem[] = [
  {
    key: "All",
    label: "All",
    icon: <ListChecks className="w-4 h-4" />,
  },
  {
    key: "Pending",
    label: "Pending Offers",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    key: "Negotiating",
    label: "Negotiating",
    icon: <MessagesSquare className="w-4 h-4" />,
  },
  {
    key: "Ongoing",
    label: "Ongoing",
    icon: <RefreshCcw className="w-4 h-4" />,
  },
  {
    key: "Completed",
    label: "Completed",
    icon: <CheckCircle className="w-4 h-4" />,
  },
];
interface ManageJobsTabsProps {
  isClient: boolean;
  setActiveTab: (key: string) => void;
  activeTab: string;
}
export const ManageJobsTabs: React.FC<ManageJobsTabsProps> = ({
  isClient,
  setActiveTab,
  activeTab,
}) => {
  const tabs = isClient ? clientTabs : providerTabs;
  const isMobile = window.innerWidth < 768;
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  const mobileMenu: MenuProps = {
    items: tabs.map((tab) => ({
      key: tab.key,
      icon: tab.icon,
      label: tab.label,
    })),
    onClick: ({ key }) => handleTabChange(key),
    selectedKeys: [activeTab],
  };
  return (
    <div className="mt-6">
      {isMobile ? (
        <div className="flex items-center justify-start gap-4 px-2 py-2 border-t border-b border-gray-200">
          {}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Filters</span>
          </div>

          {}
          <div className="w-max">
            <Dropdown menu={mobileMenu} trigger={["click"]}>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer border border-gray-300 bg-gray-100 rounded-[8px] border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm transition-colors">
                {tabs.find((t) => t.key === activeTab)?.label || "Select Tab"}
                <ChevronDown className="w-4 h-4" />
              </button>
            </Dropdown>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 border-b border-gray-200">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-b-2 ${activeTab === tab.key ? "text-royalblue-main border-royalblue-main" : "border-transparent text-gray-500"}`}
            >
              {tab.icon}
              <span className="text-sm">{tab.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from "react";
import {
  buttonClasses,
  JobActionsProps,
  providerJobActions,
  ProviderJobState,
} from "./jobsaction";

const ProviderJobActions: React.FC<JobActionsProps> = ({ job }) => {
  let action = "pending" as ProviderJobState;
  let actions = providerJobActions[action];
  return (
    <div className="flex flex-col gap-3">
      {actions.map(({ label, action, styleClass, icon: Icon }) => (
        <button
          key={label}
          onClick={action}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${buttonClasses[styleClass]}`}
        >
          {Icon && <Icon size={16} />}
          {label}
        </button>
      ))}
    </div>
  );
};

export default ProviderJobActions;

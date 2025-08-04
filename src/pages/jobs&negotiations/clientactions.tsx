import React from "react";
import { Job } from "../../components/cards/appcards";
import {
  buttonClasses,
  clientJobActions,
  ClientJobState,
  JobActionsProps,
} from "./jobsaction";

const ClientJobActions: React.FC<JobActionsProps> = ({ job }) => {
  let action = "open" as ClientJobState;
  let actions = clientJobActions[action];
  return (
    <div className="grid grid-cols-2 gap-3 [&>*:last-child]:col-span-2">
      {actions.map(({ label, action, styleClass, icon: Icon }) => (
        <button
          key={label}
          onClick={action}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-lg transition ${buttonClasses[styleClass]}`}
        >
          {label}
          {Icon && <Icon size={16} />}
        </button>
      ))}
    </div>
  );
};

export default ClientJobActions;

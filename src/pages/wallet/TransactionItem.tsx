import { FC } from "react";
<<<<<<< Updated upstream
import {
  ArrowUpLeft,
  Download,
  Upload,
  DollarSign,
  CreditCard,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
=======
import { ArrowUpRight, ArrowDownLeft, Plus, X } from "lucide-react";

>>>>>>> Stashed changes
interface TransactionItemProps {
  transaction: {
    id: string | number;
    type: string;
    reference?: string;
    paid?: boolean;
<<<<<<< Updated upstream
    reflected?: boolean;
    createdDate?: string;
    from?: {
      fullName?: string;
      email?: string;
    };
    to?: {
      fullName?: string;
      email?: string;
    };
    amount: string | number;
  };
}
const TransactionItem: FC<TransactionItemProps> = ({ transaction }) => {
  const rawType = transaction.type?.toLowerCase();
  let type: "topup" | "withdrawal" | "received" | "sent" = "topup";
  let label = "";
  if (rawType.includes("withdraw")) {
    type = "withdrawal";
    label = "Withdrawal";
  } else if (rawType.includes("topup")) {
    type = "topup";
    label = "TopUp";
  } else if (rawType.includes("credit")) {
    type = "received";
    label = "Received";
  } else if (rawType.includes("debit")) {
    type = "sent";
    label = "Sent";
  } else if (rawType.includes("receive")) {
    type = "received";
    label = "Received";
  } else if (rawType.includes("send")) {
    type = "sent";
    label = "Sent";
  } else {
    label = "TopUp";
  }
  let partyName = "";
  if (type === "received" && transaction.from?.fullName) {
    partyName = ` from ${transaction.from.fullName}`;
  } else if (type === "sent" && transaction.to?.fullName) {
    partyName = ` to ${transaction.to.fullName}`;
  }
  const isSuccessful = transaction.paid || transaction.reflected;
  const isFailed = !isSuccessful;
  const statusText = isSuccessful ? "Successful" : "Failed";
  let icon;
  if (isFailed) {
    icon = <XCircle size={18} />;
  } else {
    switch (type) {
      case "topup":
        icon = <DollarSign size={18} />;
        break;
      case "withdrawal":
        icon = <ArrowUpLeft size={18} />;
        break;
      case "received":
        icon = <Download size={18} />;
        break;
      case "sent":
        icon = <Upload size={18} />;
        break;
      default:
        icon = <CreditCard size={18} />;
    }
  }
  const iconWrapperClass = clsx(
    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
    {
      "bg-green-100 text-green-700": type === "topup" && !isFailed,
      "bg-red-100 text-red-700": type === "withdrawal" && !isFailed,
      "bg-blue-100 text-blue-700": type === "received" && !isFailed,
      "bg-yellow-100 text-yellow-700": type === "sent" && !isFailed,
      "bg-red-200 text-red-800": isFailed,
    },
  );
  let dateTimeStr = "";
  const rawDate =
    transaction.createdDate ||
    (transaction as any).created_at ||
    (transaction as any).transactionDate ||
    (transaction as any).date;
  if (rawDate) {
    let parsedDate = new Date(rawDate);
    if (isNaN(parsedDate.getTime()) && typeof rawDate === "string") {
      const match = rawDate.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (match) {
        parsedDate = new Date(`${match[2]}/${match[1]}/${match[3]}`);
      }
    }
    if (!isNaN(parsedDate.getTime())) {
      dateTimeStr = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).format(parsedDate);
    }
  }
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className={iconWrapperClass}>{icon}</div>
        <div className="text-sm">
          <p className="font-medium text-gray-800">
            {label}
            {partyName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {transaction.reference && (
              <>
                {transaction.reference} <span className="mx-1">•</span>
              </>
            )}
            {dateTimeStr}
          </p>
          <p
            className={clsx("text-xs mt-0.5", {
              "text-green-600": isSuccessful,
              "text-red-600": isFailed,
            })}
          >
            {statusText}
          </p>
        </div>
      </div>
      <p className="font-semibold text-[15px] text-gray-900">
        ₦
        {Number(transaction.amount).toLocaleString(undefined, {
          minimumFractionDigits: 0,
        })}
      </p>
=======
    createdDate?: string;
    method?: string;
    amount: number | string;
  };
}

const TransactionItem: FC<TransactionItemProps> = ({ transaction }) => {
  let icon;
  let circleColor = "";

  if (!transaction.paid) {
    icon = <X size={16} color="#b91c1c" />; // red
    circleColor = "bg-red-200";
  } else if (transaction.type === "credit" || transaction.type === "received") {
    icon = <ArrowDownLeft size={16} color="#15803d" />; // green
    circleColor = "bg-green-200";
  } else if (transaction.type === "debit" || transaction.type === "sent") {
    icon = <ArrowUpRight size={16} color="#b91c1c" />; // red
    circleColor = "bg-red-200";
  } else if (transaction.type === "topup") {
    icon = <Plus size={16} color="#1d4ed8" />; // blue
    circleColor = "bg-blue-200";
  } else {
    icon = <ArrowUpRight size={16} color="#374151" />; // gray
    circleColor = "bg-gray-200";
  }

  return (
    <div className="p-3 rounded-md flex items-center justify-between">
      {/* Left side: icon + details */}
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full ${circleColor}`}
        >
          {icon}
        </div>
        <div>
          <p className="font-semibold capitalize">{transaction.type}</p>
          <p className="text-sm text-gray-500">Ref: {transaction.reference}</p>
          <p className="text-sm">
            {transaction.paid ? "Paid" : "Not Paid"} —{" "}
            {transaction.createdDate
              ? new Date(transaction.createdDate).toLocaleString()
              : ""}
          </p>
          {transaction.method && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
              {transaction.method}
            </span>
          )}
        </div>
      </div>

      {/* Right side: amount */}
      <span className="font-bold">
        ₦{Number(transaction.amount).toLocaleString()}
      </span>
>>>>>>> Stashed changes
    </div>
  );
};
export default TransactionItem;

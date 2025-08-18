import { FC } from "react";
import {
  ArrowUpLeft,
  Download,
  Upload,
  CreditCard,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import clsx from "clsx";

interface TransactionItemProps {
  transaction: {
    id: string | number;
    type: string; // from API
    reference?: string;
    paid?: boolean;
    reflected?: boolean; // true if amount reflected in balance
    createdDate?: string;
    from?: { fullName?: string; email?: string };
    to?: { fullName?: string; email?: string };
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
  } else if (rawType.includes("credit") || rawType.includes("receive")) {
    type = "received";
    label = "Received";
  } else if (rawType.includes("debit") || rawType.includes("send")) {
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

  // Determine success/failure/pending
  const isSuccessful = transaction.paid || transaction.reflected;
  const isFailed = !isSuccessful && transaction.paid === false;
  const isPending = !isSuccessful && !isFailed;

  let statusText = "Pending";
  if (isSuccessful) statusText = "Successful";
  if (isFailed) statusText = "Failed";

  // Choose icon with direct color classes
  let icon;
  if (isSuccessful) {
    icon = <CheckCircle size={18} className="text-green-600" />;
  } else if (isFailed) {
    icon = <XCircle size={18} className="text-red-600" />;
  } else if (isPending) {
    icon = <Clock size={18} className="text-yellow-600" />;
  } else {
    // fallback type-based icons with colors
    switch (type) {
      case "withdrawal":
        icon = <ArrowUpLeft size={18} className="text-red-700" />;
        break;
      case "received":
        icon = <Download size={18} className="text-blue-700" />;
        break;
      case "sent":
        icon = <Upload size={18} className="text-yellow-800" />;
        break;
      default:
        icon = <CreditCard size={18} className="text-blue-700" />;
    }
  }

  // Icon wrapper background colors only
  const iconWrapperClass = clsx(
    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
    {
      "bg-green-100": isSuccessful,
      "bg-red-100": isFailed,
      "bg-yellow-100": isPending,
      "bg-gray-100": !isSuccessful && !isFailed && !isPending,
    }
  );

  // Date handling with multiple fallbacks
  let dateTimeStr = "";
  const rawDate =
    transaction.createdDate ||
    (transaction as any).created_at ||
    (transaction as any).transactionDate ||
    (transaction as any).date;

  if (rawDate) {
    let parsedDate = new Date(rawDate);

    // Handle DD/MM/YYYY
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
              "text-yellow-600": isPending,
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
    </div>
  );
};

export default TransactionItem;
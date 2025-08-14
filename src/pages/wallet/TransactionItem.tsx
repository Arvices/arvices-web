import { FC } from "react";
import { ArrowDownRight, ArrowUpLeft } from "lucide-react";
import clsx from "clsx";

interface TransactionItemProps {
  transaction: {
    id: string | number;
    type: string; // from API
    reference?: string;
    paid?: boolean;
    createdDate?: string;
    to?: { fullName?: string; email?: string };
    amount: string | number;
  };
}

const TransactionItem: FC<TransactionItemProps> = ({ transaction }) => {
  // Normalize type from API to match our design categories
  const rawType = transaction.type?.toLowerCase();
  let type: "deposit" | "withdrawal" | "received" | "sent" = "deposit";

  if (rawType.includes("withdraw")) type = "withdrawal";
  else if (rawType.includes("receive")) type = "received";
  else if (rawType.includes("send")) type = "sent";

  const isIncoming = type === "deposit" || type === "received";

  const icon = isIncoming ? (
    <ArrowDownRight size={18} />
  ) : (
    <ArrowUpLeft size={18} />
  );

  const iconWrapperClass = clsx(
    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
    {
      "bg-green-100 text-green-700": type === "deposit",
      "bg-red-100 text-red-700": type === "withdrawal",
      "bg-gradient-to-br from-royalblue-shade5 via-gray-900 to-royalblue-shade3 text-white":
        type === "received" || type === "sent",
    }
  );

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className={iconWrapperClass}>{icon}</div>
        <div className="text-sm">
          <p className="font-medium text-gray-800">
            {transaction.reference || transaction.type}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {transaction.id} <span className="mx-1">•</span>{" "}
            {transaction.createdDate
              ? new Date(transaction.createdDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
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

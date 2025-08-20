import { FC } from "react";
import { ArrowUpRight, ArrowDownLeft, Plus, X } from "lucide-react";

interface TransactionItemProps {
  transaction: {
    id: string | number;
    type: string;
    reference?: string;
    paid?: boolean;
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
    </div>
  );
};

export default TransactionItem;

import { ArrowDownRight, ArrowUpLeft } from "lucide-react";
import clsx from "clsx";

type TransactionType = "deposit" | "withdrawal" | "received" | "sent";

interface Transaction {
  type: TransactionType;
  title: string;
  amount: number;
  id: string;
  date: string;
}

export const TransactionItem = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const { type, title, amount, id, date } = transaction;
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
    },
  );

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className={iconWrapperClass}>{icon}</div>
        <div className="text-sm">
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {id} <span className="mx-1">•</span> {date}
          </p>
        </div>
      </div>
      <p className="font-semibold text-[15px] text-gray-900">
        ₦{amount.toLocaleString()}
      </p>
    </div>
  );
};

export const transactions: Transaction[] = [
  {
    id: "TXN91283A",
    title: "Deposit",
    amount: 239300,
    type: "deposit",
    date: "July 23rd, 2025",
  },
  {
    id: "TXN12983B",
    title: "Withdrawal | 8123456789 Opay",
    amount: 239300,
    type: "withdrawal",
    date: "July 23rd, 2025",
  },
  {
    id: "TXN19383C",
    title: "Sent to Patience",
    amount: 15900,
    type: "sent",
    date: "July 22nd, 2025",
  },
  {
    id: "TXN19493D",
    title: "Received from Tolu",
    amount: 73000,
    type: "received",
    date: "July 21st, 2025",
  },
  {
    id: "TXN19503E",
    title: "Deposit",
    amount: 50000,
    type: "deposit",
    date: "July 20th, 2025",
  },
  {
    id: "TXN19613F",
    title: "Withdrawal | 8129876543 Opay",
    amount: 74000,
    type: "withdrawal",
    date: "July 19th, 2025",
  },
  {
    id: "TXN19723G",
    title: "Sent to Victor",
    amount: 32000,
    type: "sent",
    date: "July 18th, 2025",
  },
  {
    id: "TXN19833H",
    title: "Received from Joy",
    amount: 88500,
    type: "received",
    date: "July 17th, 2025",
  },
];

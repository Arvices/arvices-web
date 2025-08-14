import { FC } from "react";

interface TransactionItemProps {
  transaction: {
    id: string | number;
    type: string;
    reference?: string;
    paid?: boolean;
    createdDate?: string;
    to?: { fullName?: string; email?: string };
    amount: string | number;
  };
}

const TransactionItem: FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <li
      key={transaction.id}
      className="border p-3 rounded-md flex justify-between items-center"
    >
      <div>
        <p className="font-semibold">{transaction.type}</p>
        {transaction.reference && (
          <p className="text-sm text-gray-500">
            Ref: {transaction.reference}
          </p>
        )}
        {transaction.createdDate && (
          <p className="text-sm">
            {transaction.paid ? "✅ Paid" : "❌ Not Paid"} —{" "}
            {new Date(transaction.createdDate).toLocaleString()}
          </p>
        )}
        {transaction.to && (
          <p className="text-sm text-gray-600">
            To: {transaction.to.fullName} ({transaction.to.email})
          </p>
        )}
      </div>
      <span className="font-bold">₦{transaction.amount}</span>
    </li>
  );
};

export default TransactionItem;

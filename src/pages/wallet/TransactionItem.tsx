import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Plus, X } from "lucide-react";

const TransactionItem = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reuse login token or refresh it if missing
  const ensureToken = async (): Promise<string | null> => {
    let token = localStorage.getItem("access_token");
    if (token) return token;

    const savedEmail = localStorage.getItem("user_email");
    const savedPassword = localStorage.getItem("user_password");

    if (!savedEmail || !savedPassword) {
      setError("No login details found. Please log in again.");
      return null;
    }

    try {
      const res = await fetch(
        "https://arvicesapi.denateonlineservice.com/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: savedEmail, password: savedPassword }),
        }
      );

      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      const data = await res.json();
      const accessToken = data?.access_token;
      if (!accessToken) throw new Error("No token received");

      localStorage.setItem("access_token", accessToken);
      return accessToken;
    } catch (err: any) {
      setError(err.message || "Login failed");
      return null;
    }
  };

  // Fetch the 10 most recent transactions
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await ensureToken();
      if (!token) return;

      const res = await fetch(
        "https://arvicesapi.denateonlineservice.com/wallet/getalltransactions?orderBy=DESC&page=1&limit=10",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok)
        throw new Error(`Error ${res.status}: Unauthorized or invalid request`);

      const data = await res.json();
      setTransactions(data?.response || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <ul className="space-y-2">
      {loading && <p>Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && transactions.length === 0 && (
        <p>No transactions found.</p>
      )}

      {transactions.map((tx) => {
        let icon;
        let circleColor = "";

        if (!tx.paid) {
          icon = <X size={16} color="#b91c1c" />;
          circleColor = "bg-red-200";
        } else if (tx.type === "credit" || tx.type === "received") {
          icon = <ArrowDownLeft size={16} color="#15803d" />;
          circleColor = "bg-green-200";
        } else if (tx.type === "debit" || tx.type === "sent") {
          icon = <ArrowUpRight size={16} color="#b91c1c" />;
          circleColor = "bg-red-200";
        } else if (tx.type === "topup") {
          icon = <Plus size={16} color="#1d4ed8" />;
          circleColor = "bg-blue-200";
        } else {
          icon = <ArrowUpRight size={16} color="#374151" />;
          circleColor = "bg-gray-200";
        }

        return (
          <li
            key={tx.id}
            className="p-3 rounded-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${circleColor}`}
              >
                {icon}
              </div>
              <div>
                <p className="font-semibold capitalize">{tx.type}</p>
                <p className="text-sm text-gray-500">Ref: {tx.reference}</p>
                <p className="text-sm">
                  {tx.paid ? "Paid" : "Not Paid"} —{" "}
                  {new Date(tx.createdDate).toLocaleString()}
                </p>
                {tx.to && (
                  <p className="text-sm text-gray-600">
                    To: {tx.to.fullName} ({tx.to.email})
                  </p>
                )}
              </div>
            </div>
            <span className="font-bold">₦{tx.amount}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default TransactionItem;

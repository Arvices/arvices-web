import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Plus, X } from "lucide-react";

const Transactions = (): React.ReactNode => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [search, setSearch] = useState("");
  const [paid, setPaid] = useState("");
  const [type, setType] = useState("");
  const [method, setMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderBy, setOrderBy] = useState("DESC");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await ensureToken();
      if (!token) return;

      const params = new URLSearchParams({
        orderBy,
        page: String(page),
        limit: String(limit),
      });

      if (search) params.append("search", search);
      if (paid) params.append("paid", paid);
      if (type) params.append("type", type);
      if (method) params.append("method", method);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(
        `https://arvicesapi.denateonlineservice.com/wallet/getalltransactions?${params.toString()}`,
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
      const txs = data?.response || [];

      setTransactions(txs);
      setTotalPages(txs.length < limit ? page : page + 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, orderBy]);

  return (
    <section className="min-h-screen pt-16">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto">
        <h1 className="text-2xl font-bold mb-3">Transactions</h1>

        {/* Filters */}
        <div className="bg-white p-2.5 rounded shadow-sm mb-3">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 border-[1px] p-1.5 text-sm rounded"
            />

            <select
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              className="border border-gray-300 border-[1px] p-1.5 text-sm rounded"
            >
              <option value="">Paid status</option>
              <option value="true">Paid</option>
              <option value="false">Not Paid</option>
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border border-gray-300 border-[1px] p-1.5 text-sm rounded"
            >
              <option value="">Type</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="border border-gray-300 border-[1px] p-1.5 text-sm rounded"
            >
              <option value="">Method</option>
              <option value="bank">Bank</option>
              <option value="wallet">Wallet</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 border-[1px] p-1.5 text-sm rounded"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 border-[1px] p-1.5 text-sm rounded"
            />

            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="border border-gray-300 border-[1px] p-1.5 text-sm rounded"
            >
              <option value="DESC">Newest First</option>
              <option value="ASC">Oldest First</option>
            </select>

            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border border-gray-300 border-[1px] p-1.5 text-sm rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <button
            onClick={() => {
              setPage(1);
              fetchTransactions();
            }}
            className="bg-blue-600 text-white px-3 py-1 text-sm rounded mt-2.5"
          >
            Apply Filters
          </button>
        </div>

        {loading && <p>Loading transactions...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && transactions.length === 0 && (
          <p>No transactions found.</p>
        )}

        {!loading && transactions.length > 0 && (
          <ul className="space-y-2">
            {transactions.map((tx) => {
              let icon;
              let circleColor = "";

              if (!tx.paid) {
                // Any unpaid transaction = red X
                icon = <X size={16} color="#b91c1c" />; // red-700
                circleColor = "bg-red-200";
              } else if (tx.type === "credit" || tx.type === "received") {
                icon = <ArrowDownLeft size={16} color="#15803d" />; // green-700
                circleColor = "bg-green-200";
              } else if (tx.type === "debit" || tx.type === "sent") {
                icon = <ArrowUpRight size={16} color="#b91c1c" />; // red-700
                circleColor = "bg-red-200";
              } else if (tx.type === "topup") {
                icon = <Plus size={16} color="#1d4ed8" />; // blue-700
                circleColor = "bg-blue-200";
              } else {
                icon = <ArrowUpRight size={16} color="#374151" />; // gray-700
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
                      <p className="text-sm text-gray-500">
                        Ref: {tx.reference}
                      </p>
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
        )}

        {/* Pagination */}
        <div className="flex gap-4 mt-6 items-center">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={transactions.length < limit}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Transactions;

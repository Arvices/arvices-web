import { useEffect, useState } from "react";
import WalletCard from "./walletcard";
import TransactionItem from "./TransactionItem"; // now default import

type Transaction = {
  id: string | number;
  title: string;
  amount: number;
  type: "deposit" | "withdrawal" | "sent" | "received";
  date: string;
};

const Wallet = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        },
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

      const res = await fetch(
        `https://arvicesapi.denateonlineservice.com/wallet/getalltransactions?page=1&limit=10&orderBy=DESC`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok)
        throw new Error(`Error ${res.status}: Unauthorized or invalid request`);

      const data = await res.json();
      const apiTxs = data?.response || [];

      const mapped: Transaction[] = apiTxs.map((tx: any) => ({
        id: tx.reference || tx.id,
        title:
          tx.type === "credit"
            ? "Deposit"
            : tx.type === "debit"
            ? "Withdrawal"
            : tx.type || "Transaction",
        amount: Number(tx.amount) || 0,
        type:
          tx.type === "credit"
            ? "deposit"
            : tx.type === "debit"
            ? "withdrawal"
            : "sent",
        date: new Date(tx.createdDate).toLocaleString(),
      }));

      setTransactions(mapped);
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
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto pb-15">
        <div className="pt-10">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">My Wallet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Easily manage your funds — add money, view balance, or withdraw anytime.
            </p>
          </div>

          <div className="border-t border-gray-200 my-10" />

          <WalletCard
            onAddMoney={() => console.log("Add Money")}
            onWithdraw={() => console.log("Withdraw")}
          />

          <div className="border-t border-gray-200 my-10" />

          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Transaction History
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              A detailed record of all your wallet activities — stay informed and in control.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            {loading && <p>Loading transactions...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && transactions.length === 0 && (
              <p>No transactions found.</p>
            )}
            {!loading &&
              transactions.map((txn) => (
                <TransactionItem key={txn.id} transaction={txn} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wallet;

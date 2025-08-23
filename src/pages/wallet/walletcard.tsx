import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Radio, message } from "antd";
import diamond from "../../assets/images/diamond.svg";
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from "feather-icons-react";
interface WalletCardProps {
  onWithdraw: () => void;
  onAddMoney: () => void;
}
const WalletCard: React.FC<WalletCardProps> = ({ onWithdraw }) => {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<number>(5000);
  const [loading, setLoading] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [transferSource, setTransferSource] = useState<"balance" | "other">(
    "balance",
  );
  const [transferLoading, setTransferLoading] = useState(false);
  const [recipientDetails, setRecipientDetails] = useState<any>(null);
  const [checkingRecipient, setCheckingRecipient] = useState(false);
  const ensureToken = async (): Promise<string | null> => {
    let token = localStorage.getItem("access_token");
    if (token) return token;
    const savedEmail = localStorage.getItem("user_email");
    const savedPassword = localStorage.getItem("user_password");
    if (!savedEmail || !savedPassword) {
      message.error("No login details found. Please log in again.");
      return null;
    }
    try {
      const res = await fetch(
        "https://arvicesapi.denateonlineservice.com/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: savedEmail,
            password: savedPassword,
          }),
        },
      );
      if (!res.ok) throw new Error(`Login failed: ${res.status}`);
      const data = await res.json();
      const accessToken = data?.access_token;
      if (!accessToken) throw new Error("No token received from login");
      localStorage.setItem("access_token", accessToken);
      return accessToken;
    } catch (err) {
      console.error("Auto-login failed", err);
      message.error("Login failed. Please log in again.");
      return null;
    }
  };
  const fetchWalletBalance = async () => {
    try {
      const token = await ensureToken();
      if (!token) return;
      const res = await fetch(
        "https://arvicesapi.denateonlineservice.com/wallet/getmywallet",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        },
      );
      const data = await res.json();
      if (res.ok && data?.status === 200) {
        setBalance(data.response?.balance ?? 0);
      } else {
        message.error("Unable to fetch wallet balance.");
      }
    } catch (err) {
      console.error("Error fetching wallet balance:", err);
      message.error("Error loading balance.");
    }
  };
  useEffect(() => {
    fetchWalletBalance();
  }, []);
  const checkRecipientEmail = async (email: string) => {
    if (!email) return;
    setCheckingRecipient(true);
    setRecipientDetails(null);
    try {
      const token = await ensureToken();
      if (!token) return;
      const res = await fetch(
        `https://arvicesapi.denateonlineservice.com/user/getaccountbyemail?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        },
      );
      const data = await res.json();
      if (res.ok && data?.status === 202) {
        setRecipientDetails(data.response);
        message.success(`Recipient found: ${data.response.fullName}`);
      } else {
        setRecipientDetails(null);
        message.error("No account found with that email.");
      }
    } catch (err) {
      console.error("Error checking recipient:", err);
      message.error("Error verifying recipient email.");
    } finally {
      setCheckingRecipient(false);
    }
  };
  const handleAddMoney = async () => {
    try {
      setLoading(true);
      const token = await ensureToken();
      if (!token) return;
      const res = await fetch(
        "https://arvicesapi.denateonlineservice.com/wallet/initialize-topup-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
          }),
        },
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      const paystackUrl = data?.response?.data?.authorization_url;
      if (paystackUrl) {
        window.location.href = paystackUrl;
      } else {
        message.success("Transaction initialized but no payment URL found.");
      }
    } catch (err) {
      console.error("Add money error:", err);
      message.error("Error adding money.");
    } finally {
      setLoading(false);
    }
  };
  const handleTransfer = async () => {
    try {
      setTransferLoading(true);
      const token = await ensureToken();
      if (!token) return;
      if (!recipientEmail || transferAmount <= 0) {
        message.error("Please enter a valid recipient email and amount.");
        return;
      }
      console.log({recipientDetails})
      if (transferSource === "balance") {
        if (!recipientDetails) {
          message.error("Recipient not found. Please verify email.");
          return;
        }
        const res = await fetch(
          "https://arvicesapi.denateonlineservice.com/wallet/initialize-transfer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: recipientDetails.id,
              amount: transferAmount,
              method: "Wallet"
            }),
          },
        );
        if (!res.ok) throw new Error(`Transfer failed: ${res.status}`);
        message.success("Transfer successful!");
        setIsTransferModalOpen(false);
        fetchWalletBalance();
      } else {
        const res = await fetch(
          "https://arvicesapi.denateonlineservice.com/wallet/initialize-topup-transaction",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: transferAmount,
            }),
          },
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();
        const paystackUrl = data?.response?.data?.authorization_url;
        if (paystackUrl) {
          window.location.href = paystackUrl;
        } else {
          message.success("Transaction initialized but no payment URL found.");
        }
      }
    } catch (err) {
      console.error("Transfer error:", err);
      message.error("Error during transfer.");
    } finally {
      setTransferLoading(false);
    }
  };
  return (
    <>
      {}
      <div className="relative rounded-2xl p-6 py-10 shadow-md bg-gradient-to-br from-royalblue-shade5 via-gray-900 to-royalblue-shade3 text-white w-full max-w-md">
        <div className="w-full absolute bottom-4 right-10">
          <img
            className="w-[35%] h-auto absolute bottom-0 right-0"
            src={diamond}
            alt="Diamond"
          />
        </div>

        <div className="mb-5">
          <p className="text-sm uppercase tracking-wider text-gray-400">
            Total Balance
          </p>
          <div className="flex items-start gap-1 mt-1">
            <span className="text-base mt-1">₦</span>
            <span className="text-3xl font-bold leading-tight">{balance}</span>
            <span className="text-sm mt-1">.00</span>
          </div>
        </div>

        <div className="mb-4">
          <Input
            type="number"
            min={100}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter amount"
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAddMoney}
            loading={loading}
            className="!h-12 flex-1 !bg-[transparent] !text-white border rounded border-gray-200 hover:bg-gray-200"
          >
            Add Money{" "}
            <ArrowDownLeft className="inline w-5 h-5 relative top-0.5" />
          </Button>
          <Button
            onClick={onWithdraw}
            className="!h-12 flex-1 bg-transparent border border-white text-white hover:bg-white hover:text-black"
          >
            Withdraw{" "}
            <ArrowUpRight className="inline w-5 h-5 relative top-0.5" />
          </Button>
          <Button
            onClick={() => setIsTransferModalOpen(true)}
            className="!h-12 flex-1 bg-yellow-500 border border-yellow-500 text-black hover:bg-yellow-600 hover:text-white"
          >
            Transfer <ArrowRight className="inline w-5 h-5 relative top-0.5" />
          </Button>
        </div>
      </div>

      {}
<Modal
  title={null}
  open={isTransferModalOpen}
  onCancel={() => setIsTransferModalOpen(false)}
  footer={null}
  centered
  className="rounded-2xl"
>
  <div className="space-y-4">
    <h2 className="text-lg font-medium text-gray-800">Transfer Funds</h2>

    {/* Recipient Email */}
    <Input
      type="email"
      value={recipientEmail}
      onChange={(e) => setRecipientEmail(e.target.value)}
      onBlur={() => checkRecipientEmail(recipientEmail)}
      placeholder="Recipient Email"
      className="h-12 rounded-lg border-gray-300 focus:border-gray-500 focus:ring-0"
    />

    {checkingRecipient && (
      <p className="text-sm text-gray-500">Checking recipient...</p>
    )}
    {recipientDetails && (
      <p className="text-sm text-green-600">
        Recipient: <strong>{recipientDetails.fullName}</strong>
      </p>
    )}
  <div className="pt-3" />
    {/* Amount */}
    <Input
      type="number"
      min={100}
      value={transferAmount}
      onChange={(e) => setTransferAmount(Number(e.target.value))}
      placeholder="Amount"
      className="h-12 rounded-lg border-gray-300 focus:border-gray-500 focus:ring-0"
    />

  <div className="pt-3" />
    {/* Transfer Source */}
    <Radio.Group
      onChange={(e) => setTransferSource(e.target.value)}
      value={transferSource}
      className="flex flex-col gap-2"
    >
      <Radio value="balance">Available Balance</Radio>
      <Radio value="other">Other Methods (Paystack)</Radio>
    </Radio.Group>

  <div className="pt-3" />
    {/* Actions */}
    <div className="flex justify-end gap-3 pt-4">
      <Button
        key="cancel"
        onClick={() => setIsTransferModalOpen(false)}
        className="!h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </Button>
      <Button
        key="transfer"
        type="primary"
        loading={transferLoading}
        onClick={handleTransfer}
        className="!h-12 px-4 rounded-lg bg-black text-white hover:bg-gray-800 border-none"
      >
        Confirm Transfer
      </Button>
    </div>
  </div>
</Modal>
    </>
  );
};
export default WalletCard;

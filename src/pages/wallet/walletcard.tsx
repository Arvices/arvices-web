import React from "react";
import { Button } from "antd";
import diamond from "../../assets/images/diamond.svg";
import { ArrowDownLeft, ArrowUpRight } from "feather-icons-react";

interface WalletCardProps {
  balance: number;
  onAddMoney: () => void;
  onWithdraw: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  balance,
  onAddMoney,
  onWithdraw,
}) => {
  return (
    <div className="relative rounded-2xl p-6 py-10 shadow-md bg-gradient-to-br from-royalblue-shade5 via-gray-900 to-royalblue-shade3 text-white w-full max-w-md">
      <div className="w-full absolute bottom-4 right-10">
        <img
          className="w-[35%] h-auto absolute bottom-0 right-0"
          src={diamond}
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

      <div className="flex gap-3">
        <Button
          onClick={onAddMoney}
          className="!h-12 flex-1 !bg-[transparent] !text-white border rounded border-gray-200 hover:bg-gray-200"
        >
          Add Money{" "}
          <ArrowDownLeft className="inline w-5 h-5 relative top-0.5" />
        </Button>
        <Button
          onClick={onWithdraw}
          className="!h-12 flex-1 bg-transparent border border-white text-white hover:bg-white hover:text-black"
        >
          Withdraw <ArrowUpRight className="inline w-5 h-5 relative top-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default WalletCard;

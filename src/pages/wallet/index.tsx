import React from "react";
import WalletCard from "./walletcard";
import { TransactionItem, transactions } from "./TransactionItem";
const Wallet = (): React.ReactNode => {
  return (
    <section className="min-h-screen pt-13 ">
      <div className="px-5 sm:px-8 md:px-16 lg:px-25 max-w-[1280px] mx-auto pb-15">
        {/* Page Starts*/}
        <div className="pt-10">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">My Wallet</h3>
            <p className="text-sm text-gray-500 mt-1">
              Easily manage your funds — add money, view balance, or withdraw
              anytime.
            </p>
          </div>
          <div className="border-t border-gray-200 my-10" />
          <div>
            <WalletCard
              balance={120932}
              onAddMoney={() => console.log("Add Money")}
              onWithdraw={() => console.log("Withdraw")}
            />
          </div>
          <div className="border-t border-gray-200 my-10" />

          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Transaction History
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              A detailed record of all your wallet activities — stay informed
              and in control.
            </p>
          </div>
          <div className="mt-6 space-y-2">
            {transactions.map((txn) => (
              <TransactionItem key={txn.id} transaction={txn} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wallet;

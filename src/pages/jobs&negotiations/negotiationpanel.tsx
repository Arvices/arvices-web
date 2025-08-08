import React, { useState } from "react";
import { Job } from "../../components/cards/appcards";
import { Offer } from "../../types/main.types";

interface NegotiationPanelProps {
  job: Job;
  offer: Offer;
  isClient: boolean;
  onCounter: (offerId: number, newPrice: string) => void;
  onAssign: (offerId: number) => void;
  onWithdraw: (offerId: number) => void;
  onUpdate: (offerId: number, newPrice: string) => void;
  onAccept: (offerId: number) => void;
}

const NegotiationPanel: React.FC<NegotiationPanelProps> = ({
  job,
  offer,
  isClient,
  onCounter,
  onAssign,
  onWithdraw,
  onUpdate,
  onAccept,
}) => {
  const [counterPrice, setCounterPrice] = useState(offer.price);

  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-5">
      <header>
        <h3 className="text-base font-medium text-gray-900">
          Negotiation Panel
        </h3>
        <p className="text-sm text-gray-500">
          Discuss terms and finalize the agreement
        </p>
      </header>


      {/* Counter / Update Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {isClient ? "Counter Offer Price" : "Update Offer Price"}
        </label>
        <input
          type="number"
          value={counterPrice}
          onChange={(e) => setCounterPrice(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {isClient ? (
          <>
            <button
              onClick={() => onCounter(offer.id, counterPrice)}
              className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Make Counter Offer
            </button>
            <button
              onClick={() => onAssign(offer.id)}
              className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Assign Job
            </button>
            <button
              onClick={() => onWithdraw(offer.id)}
              className="px-3 py-2 text-sm rounded-md border border-gray-300 text-red-600 hover:bg-gray-100 transition-colors"
            >
              Withdraw
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onUpdate(offer.id, counterPrice)}
              className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Propose New Offer
            </button>
            <button
              onClick={() => onAccept(offer.id)}
              className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Accept Job
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NegotiationPanel;

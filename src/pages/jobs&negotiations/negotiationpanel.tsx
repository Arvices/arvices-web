import React, { useState } from "react";
import { Job } from "../../components/cards/appcards";
import { Offer } from "../../types/main.types";
interface NegotiationPanelProps {
  job: Job;
  offer: Offer;
  isClient: boolean;
  onCounter: (price: number, description: string) => void;
  onCancel: (offerId: number) => void;
  onUpdate: (offerId: number, newPrice: string) => void;
  onAccept: (offerId: number) => void;
}
const NegotiationPanel: React.FC<NegotiationPanelProps> = ({
  offer,
  isClient,
  onCounter,
  onCancel,
}) => {
  const [counterPrice, setCounterPrice] = useState(offer.price);
  const [reason, setReason] = useState("");
  const makeCounter = () => {
    onCounter(Number(counterPrice), reason);
  };
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

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-5">
          {isClient ? "Counter Offer Price" : "Update Offer Price"}
        </label>
        <input
          type="number"
          value={counterPrice}
          onChange={(e) => setCounterPrice(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason For This Counter Offer
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {}
      <div className="flex gap-2 flex-wrap justify-end">
        <>
          <button
            onClick={makeCounter}
            className="cursor-pointer px-3 py-2 text-sm rounded-md border border-blue-300 hover:bg-royalblue-tint6 transition-colors"
          >
            Make Counter Offer
          </button>
          <button
            onClick={() => onCancel(offer.id)}
            className="cursor-pointer px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </>
      </div>
    </div>
  );
};
export default NegotiationPanel;

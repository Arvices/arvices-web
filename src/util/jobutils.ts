import { CounterOffer } from "../types/main.types";
export const getLatestCounterOffer = (
  offers: CounterOffer[],
): CounterOffer | null => {
  if (!offers || offers.length === 0) return null;
  return offers.reduce((latest, current) => {
    return new Date(current.createdDate) > new Date(latest.createdDate)
      ? current
      : latest;
  });
};

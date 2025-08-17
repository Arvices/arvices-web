import { UserAccount } from "../api-services/auth";
import { Job, OfferStatus } from "../components/cards/appcards";
export interface CounterOffer {
  id: number;
  price: string;
  description: string;
  type: "Client" | "Service Provider";
  accepted: boolean;
  createdDate: string;
}
export interface Offer {
  accepted: boolean;
  createdDate: string;
  description: string;
  id: number;
  price: string;
  serviceRequest: Job;
  user: UserAccount;
  status: OfferStatus;
  counterOffer: CounterOffer[];
  type: string;
}

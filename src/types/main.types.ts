import { UserAccount } from "../api-services/auth";
import { Job, OfferStatus } from "../components/cards/appcards";

/**
 * Interface representing an offer or proposal made for a service request.
 */
export interface Offer {
  accepted: boolean;
  createdDate: string; // ISO 8601 date string
  description: string; // Description of the offer itself
  id: number;
  price: string; // Price is a string in your example
  serviceRequest: Job; // The service request this offer is for
  user: UserAccount; // The user who made this offer
  status: OfferStatus;
}

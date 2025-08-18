export const UserFieldId = {
  Email: "email",
  FullName: "fullName",
  Username: "username",
  Address: "address",
  Password: "password",
  PhoneNumber: "phoneNumber",
  Picture: "picture",
  BusinessName: "businessName",
  Position: "position",
  Rating: "rating",
  NumberOfRating: "numberOfRating",
  AllRating: "allRating",
  MeanRating: "meanRating",
  AccountCreationDate: "accountCreationDate",
  AccountDisable: "accountDisable",
  AccountVerified: "accountVerified",
  Type: "type",
  Showcase: "showcase",
  ServiceRequests: "serviceRequests",
  Category: "category",
  Review: "review",
  ReviewedUser: "reviewedUser",
  Wallet: "wallet",
  Specialties: "specialties",
} as const;
export interface ServiceOfferingPayload {
  title: string;
  price: string;
  description: string;
  duration: string;
  timeUnit: string;
  id: number;
}

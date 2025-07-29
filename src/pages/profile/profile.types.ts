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

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  active: boolean;
}

interface profileData {
  // Personal Info
  fullName: string;
  profileImage: string;
  bio: string;
  profession: string;
  location: string;
  phone: string;
  email: string;
  website: string;

  // Professional Details
  experience: string;
  specialties: string[];
  languages: string[];

  // Services
  services: Service[];

  // Availability
  workingHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  bookingAdvance: string;
  mobileService: boolean;
  serviceRadius: string;

  // Business Settings
  depositRequired: boolean;
  depositPercentage: string;
  cancellationPolicy: string;
  autoConfirm: boolean;
}

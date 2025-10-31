// onboardingService.ts

import { appAxiosInstance, getConfig } from "./baseUrl";

/**
 * CREATE ONBOARDING
 * POST /onboarding/createonboarding
 * multipart/form-data
 */

export interface CreateOnboardingRequest {
  // Text fields (required)
  fullName: string;
  email: string;
  phoneNumber: string;
  businessName: string;
  serviceCategory: string;
  yearsOfExperience: string;
  serviceAreas: string;
  address: string;
  reference: string;
  accountNumber: string;
  bank: string;

  // Array of strings (availability slots, e.g. ["Weekdays", "Weekends"])
  availability: string[];

  // File uploads (optional)
  profilePicture?: File[];
  governmentIssuedID?: File[];
  businessRegistrationCertificate?: File[];
  portfolio?: File[];
}

async function createOnboarding(formData: FormData, token?: string) {
  const config = getConfig(
    "/onboarding/createonboarding",
    "POST",
    token,
    formData,
  );

  return appAxiosInstance(config);
}

/**
 * UPDATE ONBOARDING
 * PUT /onboarding/updateonboarding/{id}
 * application/json
 */
async function updateOnboarding(
  id: number | string,
  data: any,
  token?: string,
) {
  const config = getConfig(
    `/onboarding/updateonboarding/${id}`,
    "PUT",
    token,
    data,
  );

  return appAxiosInstance(config);
}

/**
 * GET SINGLE ONBOARDING
 * GET /onboarding/getonboarding/{id}
 */
async function getOnboardingById(id: number | string, token?: string) {
  const config = getConfig(`/onboarding/getonboarding/${id}`, "GET", token);

  return appAxiosInstance(config);
}

/**
 * GET ALL ONBOARDINGS
 * GET /onboarding/getallonboarding
 */
async function getAllOnboardings(token?: string) {
  const config = getConfig("/onboarding/getallonboarding", "GET", token);

  return appAxiosInstance(config);
}

/**
 * DELETE ONBOARDING
 * DELETE /onboarding/deleteonboarding/{id}
 */
async function deleteOnboarding(id: number | string, token?: string) {
  const config = getConfig(
    `/onboarding/deleteonboarding/${id}`,
    "DELETE",
    token,
  );

  return appAxiosInstance(config);
}

/**
 * REJECT ONBOARDING
 * POST /onboarding/rejectonboarding/{id}
 */
async function rejectOnboarding(id: number | string, token?: string) {
  const config = getConfig(`/onboarding/rejectonboarding/${id}`, "POST", token);

  return appAxiosInstance(config);
}

/**
 * ACCEPT ONBOARDING
 * POST /onboarding/acceptonboarding/{id}
 */
async function acceptOnboarding(id: number | string, token?: string) {
  const config = getConfig(`/onboarding/acceptonboarding/${id}`, "POST", token);

  return appAxiosInstance(config);
}

// ✅ Export all service functions
export {
  createOnboarding,
  updateOnboarding,
  getOnboardingById,
  getAllOnboardings,
  deleteOnboarding,
  rejectOnboarding,
  acceptOnboarding,
};

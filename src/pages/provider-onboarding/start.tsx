import React, { useState } from "react";
import { OnboardingStep1 } from "./onboarding-step-1";
import OnboardingStep2Page from "./onboarding-step-2";
import {
  createOnboarding,
} from "@/api-services/onboarding.service";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";
import { parseHttpError } from "@/api-services/parseReqError";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { OnboardingConfirmation } from "./onboarding-confirmation";

export interface Step1Data {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  experience: string;
  serviceAreas: string[];
  profileImage: File | null;
  availability: { [key: string]: boolean };
}

export interface Step2Data {
  govId: File | null;
  businessCert: File | null;
  portfolioImages: File[];
  termsAccepted: boolean;
}

export interface Step3Data {
  testimonials: string;
  selectedServices: string[];
  pricing: string;
  pricingType: string;
  bankAccount: string;
  bankName: string;
  paymentMethods: string[];
}

type OnboardingData = Step1Data & Step2Data & Step3Data;

export interface OnboardingPageProps {
  onNext?: () => void;
  onStepDataSubmit: (data: Partial<OnboardingData>) => void;
  onBack?: () => void;
  alldata: Partial<OnboardingData>;
}

// validation.ts
export type ValidationErrors = Record<string, string>;

// ---------- STEP 1 VALIDATION ----------
/* --------------------------- STEP 1 VALIDATION --------------------------- */
export function validateStep1(data: Step1Data) {
  const errors: ValidationErrors = {};

  if (!data.fullName.trim()) errors.fullName = "Full name is required.";
  if (!data.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Enter a valid email address.";

  if (!data.phone.trim()) errors.phone = "Phone number is required.";
  if (!data.businessName.trim())
    errors.businessName = "Business name is required.";
  if (!data.category.trim()) errors.category = "Category is required.";
  if (!data.experience.trim())
    errors.experience = "Experience field is required.";
  if (!data.serviceAreas || data.serviceAreas.length === 0)
    errors.serviceAreas = "At least one service area is required.";
  if (!data.profileImage) errors.profileImage = "Profile image is required.";

  const hasAvailability = Object.values(data.availability || {}).some(Boolean);
  if (!hasAvailability)
    errors.availability = "Please select at least one available day.";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/* --------------------------- STEP 2 VALIDATION --------------------------- */
export function validateStep2(data: Step2Data) {
  const errors: ValidationErrors = {};

  if (!data.govId) errors.govId = "Government-issued ID is required.";
  if (!data.businessCert)
    errors.businessCert = "Business certificate is required.";
  if (!data.portfolioImages || data.portfolioImages.length === 0)
    errors.portfolioImages = "Upload at least one portfolio image.";
  if (!data.termsAccepted)
    errors.termsAccepted = "You must accept the terms and conditions.";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/* --------------------------- STEP 3 VALIDATION --------------------------- */
export function validateStep3(data: Step3Data) {
  const errors: ValidationErrors = {};

  if (!data.testimonials.trim())
    errors.testimonials =
      "Please provide at least one testimonial or feedback.";
  if (!data.selectedServices || data.selectedServices.length === 0)
    errors.selectedServices = "Select at least one service.";
  if (!data.pricing.trim()) errors.pricing = "Pricing information is required.";
  if (!data.pricingType.trim()) errors.pricingType = "Select a pricing type.";
  if (!data.bankAccount.trim())
    errors.bankAccount = "Bank account number is required.";
  if (!data.bankName.trim()) errors.bankName = "Bank name is required.";
  if (!data.paymentMethods || data.paymentMethods.length === 0)
    errors.paymentMethods = "Select at least one payment method.";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

const OnboardingPage: React.FC = () => {
  const auth = useAuth();
  const { setLoading, setLoadingText } = useLoading();
  const [step, setStep] = useState<number>(1);
  const [globalData, setGlobalData] = useState<Partial<OnboardingData>>({});
  const notify = useNotificationContext();

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleStepDataSubmit = async (data: Partial<OnboardingData>) => {
    setGlobalData((prev) => ({
      ...prev,
      ...data,
    }));
    if(step === 2){
    await Promise.resolve(setTimeout(()=>{},200))
    await handleSubmit();
    }
  };

  console.log("GlobalData", globalData);

  // ---- Handle Submit ----
  const handleSubmit = async () => {
    const data = globalData;
    const formData = new FormData();

    // ---------- TEXT FIELDS ----------
    formData.append("fullName", data.fullName || "");
    formData.append("email", data.email || "");
    formData.append("phoneNumber", data.phone || "");
    formData.append("businessName", data.businessName || "");
    formData.append("serviceCategory", data.category || "");
    formData.append("yearsOfExperience", data.experience || "");

    // serviceAreas is an array → backend expects string (comma-separated)
    formData.append("serviceAreas", (data.serviceAreas || []).join(","));

    // address and reference (not collected in steps, set empty for now)
    formData.append("address", "");
    formData.append("reference", "");

    // ---------- BANKING ----------
    formData.append("accountNumber", "");
    formData.append("bank", "");

    // ---------- AVAILABILITY ----------
    const availableDays = Object.entries(data.availability || {})
      .filter(([_, value]) => value)
      .map(([key]) => key);

    availableDays.forEach((day) => {
      console.log("day", day)
      formData.append("availability", day);
    });

    // ---------- FILE UPLOADS ----------
    if (data.profileImage) formData.append("profilePicture", data.profileImage);

    if (data.govId) formData.append("governmentIssuedID", data.govId);
    if (data.businessCert)
      formData.append("businessRegistrationCertificate", data.businessCert);

    if (data.portfolioImages && data.portfolioImages.length > 0) {
      data.portfolioImages.forEach((file) => {
        formData.append("portfolio", file);
      });
    }
    try {
      setLoading(true);
      setLoadingText("Creating Onboarding Profile... Please Wait");
       await createOnboarding(formData, auth.token);
      notify.openNotification(
        "topRight",
        "Successful",
        "Data submitted Sucessfully",
        "success",
      );
      setStep(3)
    } catch (error) {
      const errMessage = parseHttpError(error);
      notify.openNotification("topRight", "Error", errMessage, "error");
    }
    finally {
      setLoading(false)
      setLoadingText("")
    }
    // ---------- SEND REQUEST ----------;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {step === 1 && (
        <OnboardingStep1
          onNext={handleNext}
          onStepDataSubmit={handleStepDataSubmit}
          alldata={globalData}
        />
      )}

      {step === 2 && (
        <OnboardingStep2Page
          onNext={()=>{}}
          onStepDataSubmit={handleStepDataSubmit}
          onBack={handleBack}
          alldata={globalData}
        />
      )}

      {step === 3 && (
        <OnboardingConfirmation onBack={handleBack} />
      )}

      <div className="mt-6 flex justify-center text-gray-500">
        Step {step} of 2
      </div>
    </div>
  );
};

export default OnboardingPage;

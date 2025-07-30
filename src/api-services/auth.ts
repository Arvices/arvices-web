import { AccountTypeVal } from "../contexts/AuthContext";
import { baseUrl } from "./baseUrl";
import axios from "axios";

// --- Interfaces for Request Bodies ---

export interface SignUpEmailAndPasswordBody {
  email: string;
  fullName: string;
  type: AccountTypeVal; // Assuming 'Vendor' might also be a type, if not, keep only 'Client'
  address: string;
  password: string;
  username: string;
}
export interface Wallet {
  id: number;
  name: string;
  accountName: string | null;
  accountNumber: string | null;
  bank: string | null;
  balance: number | null;
  createdDate: string; // ISO date string
}

export interface UserAccount {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  availableDays: string[] | null;
  availableFromTime: string | null;
  availableToTime: string | null;
  address: string;
  password: string;
  type: AccountTypeVal;
  accountCreationDate: string; // ISO date string
  accountVerified: boolean;
  accountDisable: number;
  picture: string | null;
  businessName: string | null;
  position: string; // "lat,long" format string
  rating: number | null;
  allRating: number;
  bio: string | null;
  numberOfRating: number;
  meanRating: number;
  category: number[]; // Could be a string array or a more complex object type if known
  categoryId: number;
  wallet: Wallet;
  website: string;
  specialties: string[] | null;
}
export interface LoginEmailAndPasswordBody {
  email_or_phonenumber: string;
  password: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface PasswordResetBody {
  password: string;
  token: string;
}

export interface VerifyAccountBody {
  email: string;
  verificationCode: number;
}

// --- Interfaces for Responses (example - adjust based on actual API responses) ---
// You'll need to define these based on what your API actually returns.
// For demonstration, I'll provide some common patterns.

export interface SuccessResponse {
  message: string;
  status: number;
  data: any; // Data can be anything, or a specific interface if known
}

export interface ErrorResponse {
  message: string;
  status: number;
  error: string;
}

export interface LoginSuccessResponse {
  message: string;
  response: {
    access_token: string;
    user: UserAccount;
  };
  status: number;
}
/**
 * Signs up a new user with email and password.
 * @param data The user's sign-up details.
 * @returns A promise that resolves with the API response.
 */
export const signUpEmailAndPassword = async (
  data: SignUpEmailAndPasswordBody,
): Promise<SuccessResponse | ErrorResponse> => {
  const urlPath = "/user/addaccount";
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post<SuccessResponse>(fullUrl, data);
    return response.data;
  } catch (error: any) {
    console.error("Error during sign up:", error);
    throw error?.response?.data;
  }
};

/**
 * Logs in a user with email/phone number and password.
 * @param data The user's login credentials.
 * @returns A promise that resolves with the login response including a token.
 */
export const loginEmailAndPassword = async (
  data: LoginEmailAndPasswordBody,
): Promise<LoginSuccessResponse> => {
  const urlPath = "/user/login";
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post(fullUrl, data);
    return response.data as LoginSuccessResponse;
  } catch (error: any) {
    console.error("Error during login:", error);
    throw error?.response?.data;
  }
};

/**
 * Initiates the Google sign-up process.
 * (Note: Google sign-up/login typically involves redirection to Google's OAuth flow,
 * so this function might just initiate that process on the backend or frontend.)
 * @returns A promise that resolves with the API response.
 */
export const signupGoogle = async (): Promise<
  SuccessResponse | ErrorResponse
> => {
  const urlPath = "/google"; // Assuming this endpoint handles the Google OAuth initiation
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    // For Google OAuth, you might just redirect the user to this URL
    // or the backend might initiate the OAuth flow and return a redirect URL.
    const response = await axios.post<SuccessResponse>(fullUrl);
    return response.data;
  } catch (error: any) {
    console.error("Error during Google sign up:", error);
    throw error?.response?.data;
  }
};

/**
 * Initiates the Google login process.
 * @returns A promise that resolves with the API response.
 */
export const loginGoogle = async (): Promise<
  SuccessResponse | ErrorResponse
> => {
  const urlPath = "/google"; // Assuming this endpoint handles the Google OAuth initiation
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    // Similar to signupGoogle, this often involves redirection.
    const response = await axios.post<SuccessResponse>(fullUrl);
    return response.data;
  } catch (error: any) {
    console.error("Error during Google login:", error);
    throw error?.response?.data;
  }
};

/**
 * Sends a password reset email to the specified email address.
 * @param data The email address for which to reset the password.
 * @returns A promise that resolves with the API response.
 */
export const forgotPassword = async (
  data: ForgotPasswordBody,
): Promise<SuccessResponse | ErrorResponse> => {
  const urlPath = "/user/forgetpassword";
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post<SuccessResponse>(fullUrl, data);
    return response.data;
  } catch (error: any) {
    console.error("Error during forgot password request:", error);
    throw error?.response?.data;
  }
};

/**
 * Resets the user's password using a provided token.
 * @param data The new password and the reset token.
 * @returns A promise that resolves with the API response.
 */
export const passwordReset = async (
  data: PasswordResetBody,
): Promise<SuccessResponse | ErrorResponse> => {
  const urlPath = "/user/resetpassword";
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post<SuccessResponse>(fullUrl, data);
    return response.data;
  } catch (error: any) {
    console.error("Error during password reset:", error);
    throw error?.response?.data;
  }
};

/**
 * Resends the account verification email.
 * (Note: The prompt did not provide a body for this. Assuming it might take an email, or nothing if user is logged in.)
 * If it requires an email, update the signature.
 * @param email The email address to resend verification to (optional, depending on API).
 * @returns A promise that resolves with the API response.
 */
export const resendAccountVerificationMail = async (
  email?: string,
): Promise<SuccessResponse | ErrorResponse> => {
  const urlPath = "/user/resendverification"; // Example path, please confirm with API docs
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post<SuccessResponse>(
      fullUrl,
      email ? { email } : {},
    );
    return response.data;
  } catch (error: any) {
    console.error("Error resending verification mail:", error);
    throw error?.response?.data;
  }
};

/**
 * Verifies a user's account with a verification code.
 * @param data The email and verification code.
 * @returns A promise that resolves with the API response.
 */
export const verifyAccount = async (
  data: VerifyAccountBody,
): Promise<SuccessResponse | ErrorResponse> => {
  const urlPath = "/user/verifyaccount";
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post<SuccessResponse>(fullUrl, data);
    return response.data;
  } catch (error: any) {
    console.error("Error verifying account:", error);
    throw error?.response?.data;
  }
};

/**
 * Generates a verification code for a given email.
 * @param email The email address for which to generate a verification code.
 * @returns A promise that resolves with the API response.
 */
export const generatVeficationCode = async (
  email: string,
): Promise<SuccessResponse | ErrorResponse> => {
  const urlPath = `/user/generateverificationcode/${email}`;
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    // This is a POST request, even though email is in path, a body might be empty or specific.
    // Assuming an empty body for this POST with path parameter.
    const response = await axios.post<SuccessResponse>(fullUrl);
    return response.data;
  } catch (error: any) {
    console.error("Error generating verification code:", error);
    throw error?.response?.data;
  }
};

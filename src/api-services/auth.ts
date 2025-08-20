import { AccountTypeVal } from "../contexts/AuthContext";
import { baseUrl } from "./baseUrl";
import axios from "axios";
import { Category } from "./categories.types";
export interface SignUpEmailAndPasswordBody {
  email: string;
  fullName: string;
  type: AccountTypeVal;
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
  createdDate: string;
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
  favourites: UserAccount[];
  followers: number[];
  password: string;
  type: AccountTypeVal;
  accountCreationDate: string;
  accountVerified: boolean;
  accountDisable: number;
  picture: string | null;
  businessName: string | null;
  position: string;
  rating: number | null;
  allRating: number;
  bio: string | null;
  numberOfRating: number;
  meanRating: number;
  category: Category[];
  categoryId: number;
  wallet?: Wallet;
  website: string;
  specialties: string[] | null;
  satisfiedClients: number;
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
export interface SuccessResponse {
  message: string;
  status: number;
  data: any;
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
export const signupGoogle = async (): Promise<
  SuccessResponse | ErrorResponse
> => {
  const urlPath = "/google";
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post<SuccessResponse>(fullUrl);
    return response.data;
  } catch (error: any) {
    console.error("Error during Google sign up:", error);
    throw error?.response?.data;
  }
};
export const loginGoogle = async (): Promise<
  SuccessResponse | ErrorResponse
> => {
  const urlPath = "/google";
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post<SuccessResponse>(fullUrl);
    return response.data;
  } catch (error: any) {
    console.error("Error during Google login:", error);
    throw error?.response?.data;
  }
};
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
export const resendAccountVerificationMail = async (
  email?: string,
): Promise<SuccessResponse | ErrorResponse> => {
  const urlPath = "/user/resendverification";
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post<SuccessResponse>(
      fullUrl,
      email
        ? {
            email,
          }
        : {},
    );
    return response.data;
  } catch (error: any) {
    console.error("Error resending verification mail:", error);
    throw error?.response?.data;
  }
};
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
export const generatVeficationCode = async (
  email: string,
): Promise<SuccessResponse | ErrorResponse> => {
  const urlPath = `/user/generateverificationcode/${email}`;
  const fullUrl = `${baseUrl}${urlPath}`;
  try {
    const response = await axios.post<SuccessResponse>(fullUrl);
    return response.data;
  } catch (error: any) {
    console.error("Error generating verification code:", error);
    throw error?.response?.data;
  }
};

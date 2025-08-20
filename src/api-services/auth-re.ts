import axios from "axios";
import { baseUrl } from "./baseUrl";
const addAccount = async (data: any) => {
  const config = {
    url: `${baseUrl}/user/addaccount`,
    method: "POST",
    data,
  };
  return axios(config);
};

const updateAccountById = async (data: FormData, id: number, token: string) => {
  const config = {
    url: `${baseUrl}/user/updateaccountbyid?id=${id}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};

const updateAccountByEmail = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/updateaccountbyemail`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};

const getAccountById = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/user/getaccountbyid`,
    method: "GET",
    params: {
      id,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const getAllUsers = async () => {
  const config = {
    url: `${baseUrl}/user/getallusers`,
    method: "GET",
  };
  return axios(config);
};
const getAccountByEmail = async (email: string) => {
  const config = {
    url: `${baseUrl}/user/getaccountbyemail`,
    method: "GET",
    params: {
      email,
    },
  };
  return axios(config);
};
const login = async (data: any) => {
  const config = {
    url: `${baseUrl}/user/login`,
    method: "POST",
    data,
  };
  return axios(config);
};
const disableAccountById = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/disableaccountbyid`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};
const disableAccountByEmail = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/disableaccountbyemail`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};
const enableAccountById = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/enableaccountbyid`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};
const enableAccountByEmail = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/enableaccountbyemail`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};
interface ChangePasswordData {
  old_password: string;
  new_password: string;
}
const changePassword = async (
  data: ChangePasswordData,
  id: number,
  token: string,
) => {
  const config = {
    url: `${baseUrl}/user/changepassword?id=${id}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data,
  };
  return axios(config);
};
const forgetPassword = async (data: any) => {
  const config = {
    url: `${baseUrl}/user/forgetpassword`,
    method: "POST",
    data,
  };
  return axios(config);
};
const resetPassword = async (data: any) => {
  const config = {
    url: `${baseUrl}/user/resetpassword`,
    method: "POST",
    data,
  };
  return axios(config);
};
const deleteAccountById = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/deleteaccountbyid`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};
const verifyAccount = async (data: any) => {
  const config = {
    url: `${baseUrl}/user/verifyaccount`,
    method: "POST",
    data,
  };
  return axios(config);
};
const generateVerificationCode = async (email: string) => {
  const config = {
    url: `${baseUrl}/user/generateverificationcode/${email}`,
    method: "POST",
  };
  return axios(config);
};
const rateUser = async (
  id: number,
  rating: number,
  reviewComment: string,
  token: string,
) => {
  const payload = {
    userId: id,
    rating: rating,
    review: reviewComment,
  };
  const config = {
    url: `${baseUrl}/user/rateuser`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };
  return axios(config);
};
const deleteReview = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/user/deletereview/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const getMyPersonalReviews = async (token: string) => {
  const config = {
    url: `${baseUrl}/user/getmypersonalreviews`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const getUserReviews = async (userId: number, token: string) => {
  const config = {
    url: `${baseUrl}/user/getuserreviews`,
    method: "GET",
    params: {
      userId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const getFile = async (filename: string) => {
  const config = {
    url: `${baseUrl}/user/getfile/${filename}`,
    method: "GET",
  };
  return axios(config);
};
const getReputableProfessionals = async () => {
  const config = {
    url: `${baseUrl}/user/getreputableprofessionals`,
    method: "GET",
  };
  return axios(config);
};
const getRecentShowcase = async () => {
  const config = {
    url: `${baseUrl}/user/getrecentshowcase`,
    method: "GET",
  };
  return axios(config);
};
const getTopProfessionals = async () => {
  const config = {
    url: `${baseUrl}/user/gettopprofessionals`,
    method: "GET",
  };
  return axios(config);
};
const getRisingTalent = async (token: string) => {
  const config = {
    url: `${baseUrl}/user/getrisingtalent`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
interface GetServiceProvidersParams {
  latitude: number;
  longitude: number;
  search?: string;
  category?: number[];
  startDate?: string;
  endDate?: string;
  orderBy?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}
const getServiceProvidersAroundMe = async (
  params: GetServiceProvidersParams,
) => {
  const config = {
    url: `${baseUrl}/user/getserviceprovidersaroundme`,
    method: "GET" as const,
    params: {
      ...params,
      category: params.category ? params.category.join(",") : undefined,
    },
  };
  return axios(config);
};
const getProfessionals = async (params: {
  search?: string;
  category?: string;
  professionalType?: string;
  orderBy?: string;
  page: number;
  limit: number;
}) => {
  const config = {
    url: `${baseUrl}/user/getprofessionals`,
    method: "GET",
    params,
  };
  return axios(config);
};
const followUser = async (userId: string, token: string) => {
  const config = {
    url: `${baseUrl}/user/followuser/${userId}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const unfollowUser = async (userId: string, token: string) => {
  const config = {
    url: `${baseUrl}/user/unfollowuser/${userId}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const getAllUserFollowing = async (token: string) => {
  const config = {
    url: `${baseUrl}/user/getalluserfollowing`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const getAllUserFollowers = async (token: string) => {
  const config = {
    url: `${baseUrl}/user/getalluserfollowers`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};

const addToFavourites = async (userId: string, token: string): Promise<any> => {
  const config = {
    url: `${baseUrl}/user/addtofavourites/${userId}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};

const removeFromFavourites = async (
  userId: string,
  token: string,
): Promise<any> => {
  const config = {
    url: `${baseUrl}/user/removefromfavourites/${userId}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};

export {
  addAccount,
  updateAccountById,
  updateAccountByEmail,
  getAccountById,
  getAllUsers,
  getAccountByEmail,
  login,
  disableAccountById,
  disableAccountByEmail,
  enableAccountById,
  enableAccountByEmail,
  changePassword,
  forgetPassword,
  resetPassword,
  deleteAccountById,
  verifyAccount,
  generateVerificationCode,
  rateUser,
  deleteReview,
  getMyPersonalReviews,
  getUserReviews,
  getFile,
  getReputableProfessionals,
  getRecentShowcase,
  getTopProfessionals,
  getRisingTalent,
  getServiceProvidersAroundMe,
  followUser,
  unfollowUser,
  getAllUserFollowing,
  getAllUserFollowers,
  getProfessionals,
  addToFavourites,
  removeFromFavourites,
};

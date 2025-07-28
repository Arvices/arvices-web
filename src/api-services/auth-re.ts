import axios from "axios";
import { baseUrl } from "./baseUrl";

// AUTH & ACCOUNT

const addAccount = async (data: any) => {
  const config = {
    url: `${baseUrl}/user/addaccount`,
    method: "POST",
    data,
  };
  return axios(config);
};

const updateAccountById = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/updateaccountbyid`,
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };
  return axios(config);
};

const updateAccountByEmail = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/updateaccountbyemail`,
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };
  return axios(config);
};

const getAccountById = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/user/getaccountbyid`,
    method: "GET",
    params: { id },
    headers: { Authorization: `Bearer ${token}` },
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
    params: { email },
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

// ACCOUNT STATE

const disableAccountById = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/disableaccountbyid`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };
  return axios(config);
};

const disableAccountByEmail = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/disableaccountbyemail`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };
  return axios(config);
};

const enableAccountById = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/enableaccountbyid`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };
  return axios(config);
};

const enableAccountByEmail = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/enableaccountbyemail`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    data,
  };
  return axios(config);
};

// PASSWORD & VERIFICATION

const changePassword = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/user/changepassword`,
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
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
    headers: { Authorization: `Bearer ${token}` },
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

// RATING & REVIEWS

const rateUser = async (id: string, rating: number, token: string) => {
  const config = {
    url: `${baseUrl}/user/rateuser/${id}/${rating}`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios(config);
};

const deleteReview = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/user/deletereview/${id}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios(config);
};

const getMyPersonalReviews = async (token: string) => {
  const config = {
    url: `${baseUrl}/user/getmypersonalreviews`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios(config);
};

const getUserReviews = async (userId: string) => {
  const config = {
    url: `${baseUrl}/user/getuserreviews`,
    method: "GET",
    params: { userId },
  };
  return axios(config);
};

// MEDIA & DISCOVERY

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

const getTopProfessionals = async (token: string) => {
  const config = {
    url: `${baseUrl}/user/gettopprofessionals`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

const getServiceProvidersAroundMe = async () => {
  const config = {
    url: `${baseUrl}/user/getserviceprovidersaroundme`,
    method: "GET",
  };
  return axios(config);
};

// FOLLOW SYSTEM

const followUser = async (userId: string, token: string) => {
  const config = {
    url: `${baseUrl}/user/followuser/${userId}`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios(config);
};

const unfollowUser = async (userId: string, token: string) => {
  const config = {
    url: `${baseUrl}/user/unfollowuser/${userId}`,
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios(config);
};

const getAllUserFollowing = async (token: string) => {
  const config = {
    url: `${baseUrl}/user/getalluserfollowing`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  };
  return axios(config);
};

const getAllUserFollowers = async (token: string) => {
  const config = {
    url: `${baseUrl}/user/getalluserfollowers`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
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
};

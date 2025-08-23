import axios from "axios";
import { baseUrl } from "./baseUrl";
const createProfileService = async (data: any, token: string) => {
  const config = {
    method: "post",
    url: `${baseUrl}/profileservice/createprofileservice`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return await axios(config);
};
const updateProfileService = async (
  id: string | number,
  data: any,
  token: string,
) => {
  const config = {
    method: "put",
    url: `${baseUrl}/profileservice/updateprofileservice/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return await axios(config);
};
const getProfileServiceById = async (id: string | number) => {
  const config = {
    method: "get",
    url: `${baseUrl}/profileservice/getprofileservice/${id}`,
  };
  return await axios(config);
};
const getAllProfileService = async (token: string, id: number) => {
  const config = {
    method: "get",
    url: `${baseUrl}/profileservice/getallprofileservice?userId=${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config);
};
const deleteProfileService = async (id: string | number, token: string) => {
  const config = {
    method: "delete",
    url: `${baseUrl}/profileservice/deleteprofileservice/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config);
};
export {
  createProfileService,
  updateProfileService,
  getProfileServiceById,
  getAllProfileService,
  deleteProfileService,
};

import axios from "axios";
import { baseUrl } from "./baseUrl";
const createCategory = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/category/createcategory`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data,
  };
  return axios(config);
};
const updateCategory = async (id: string, data: any, token: string) => {
  const config = {
    url: `${baseUrl}/category/updatecategory/${id}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data,
  };
  return axios(config);
};
const getCategoryById = async (id: string) => {
  const config = {
    url: `${baseUrl}/category/getcategory/${id}`,
    method: "GET",
  };
  return axios(config);
};
const getAllCategory = async () => {
  const config = {
    url: `${baseUrl}/category/getallcategory`,
    method: "GET",
  };
  return axios(config);
};
const deleteCategory = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/category/deletecategory/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
export {
  createCategory,
  updateCategory,
  getCategoryById,
  getAllCategory,
  deleteCategory,
};

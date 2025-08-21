import axios from "axios";
import { baseUrl } from "./baseUrl";

/* ==========================
   PRODUCT SERVICE
========================== */
const createProduct = async (data: any, token?: string) => {
  const config = {
    url: `${baseUrl}/product/createproduct`,
    method: "POST" as const,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    data,
  };
  return axios(config);
};

const updateProduct = async (id: number, data: any, token?: string) => {
  const config = {
    url: `${baseUrl}/product/updateproduct/${id}`,
    method: "PUT" as const,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    data,
  };
  return axios(config);
};

const getProductById = async (id: number, token?: string) => {
  const config = {
    url: `${baseUrl}/product/getproduct/${id}`,
    method: "GET" as const,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  return axios(config);
};

const getAllProducts = async (
  params?: {
    search?: string;
    userId?: number;
    startDate?: string;
    endDate?: string;
    orderBy?: string;
    page?: number;
    limit?: number;
  },
  token?: string,
) => {
  const config = {
    url: `${baseUrl}/product/getallproduct`,
    method: "GET" as const,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    params,
  };
  return axios(config);
};

const deleteProduct = async (id: number, token?: string) => {
  const config = {
    url: `${baseUrl}/product/deleteproduct/${id}`,
    method: "DELETE" as const,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  return axios(config);
};

export {
  createProduct,
  updateProduct,
  getProductById,
  getAllProducts,
  deleteProduct,
};

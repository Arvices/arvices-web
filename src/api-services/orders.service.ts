import axios from "axios";
import { baseUrl } from "./baseUrl";

interface OrderPayload {
  quantity: number;
  productId: number;
  status?: string;
}

const createOrder = async (payload: OrderPayload, token?: string) => {
  const config = {
    url: `${baseUrl}/order/createorder`,
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: payload,
  };

  return axios(config);
};

const updateOrder = async (id: number, payload: OrderPayload, token?: string) => {
  const config = {
    url: `${baseUrl}/order/updateorder/${id}`,
    method: "PUT" as const,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: payload,
  };

  return axios(config);
};

const getOrderById = async (id: number, token?: string) => {
  const config = {
    url: `${baseUrl}/order/getorder/${id}`,
    method: "GET" as const,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  return axios(config);
};

const getAllOrders = async (
  params?: {
    search?: string;
    status?: string;
    userId?: number;
    productId?: number;
    startDate?: string;
    endDate?: string;
    orderBy?: string;
    page?: number;
    limit?: number;
  },
  token?: string
) => {
  const config = {
    url: `${baseUrl}/order/getallorder`,
    method: "GET" as const,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    params,
  };

  return axios(config);
};

const deleteOrder = async (id: number, token?: string) => {
  const config = {
    url: `${baseUrl}/order/deleteorder/${id}`,
    method: "DELETE" as const,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  return axios(config);
};

export {
  createOrder,
  updateOrder,
  getOrderById,
  getAllOrders,
  deleteOrder,
};

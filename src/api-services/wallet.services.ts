import axios, { AxiosRequestConfig } from "axios";
import { baseUrl } from "./baseUrl";
interface AuthConfig {
  token?: string;
}
const createWallet = async (
  data: {
    name: string;
    userId: number;
  },
  { token }: AuthConfig,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/createwallet`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    data,
  };
  return axios(config);
};
const updateWallet = async (
  id: number,
  data: {
    accountNumber: string;
    bank: string;
    accountName: string;
  },
  { token }: AuthConfig,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/updatewallet/${id}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    data,
  };
  return axios(config);
};
const getWalletById = async (id: number, { token }: AuthConfig) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/getwallet/${id}`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const getMyWallet = async ({ token }: AuthConfig) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/getmywallet`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const getAllWallets = async ({ token }: AuthConfig) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/getallwallet`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const initializeServiceRequestTransaction = async (
  data: {
    servicerequestId: number;
    method: string;
  },
  { token }: AuthConfig,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/initialize-service-request-transaction`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    data,
  };
  return axios(config);
};
const initializeTopupTransaction = async (
  data: {
    amount: number;
  },
  { token }: AuthConfig,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/initialize-topup-transaction`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    data,
  };
  return axios(config);
};
const paystackWebhook = async ({ token }: AuthConfig) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/paystack-webhook`,
    method: "POST",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
interface GetTransactionsParams {
  search?: string;
  paid?: number;
  type?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: string;
  page: number;
  limit: number;
}
const getAllTransactions = async (
  params: GetTransactionsParams,
  { token }: AuthConfig,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/getalltransactions`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    params,
  };
  return axios(config);
};
const closeTransaction = async (reference: string, { token }: AuthConfig) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/closetransaction/${reference}`,
    method: "POST",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const initializeTransfer = async (
  data: {
    userId: number;
    amount: number;
    method: string;
  },
  { token }: AuthConfig,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/wallet/initialize-transfer`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    data,
  };
  return axios(config);
};
export {
  createWallet,
  updateWallet,
  getWalletById,
  getMyWallet,
  getAllWallets,
  initializeServiceRequestTransaction,
  initializeTopupTransaction,
  paystackWebhook,
  getAllTransactions,
  closeTransaction,
  initializeTransfer,
};

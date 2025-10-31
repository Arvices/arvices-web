import axios, { AxiosError, AxiosResponse } from "axios";

export const baseUrl = "https://arvicesapi.denateonlineservice.com";

export const appAxiosInstance = axios.create({
  baseURL: baseUrl,
});
// Interceptor handler
const handleResponse = (response: AxiosResponse) => response.data;

const handleError = (error: AxiosError) => {
  if (error.response) {
    return Promise.reject(error.response.data);
  }
  return Promise.reject({ message: "Network error or Server Not Reachable" });
};

// Attach interceptors
appAxiosInstance.interceptors.response.use(handleResponse, handleError);

export const getConfig = (
  url: string,
  method: string,
  token?: string,
  data?: any,
  params?: any,
) => {
  return {
    url,
    method,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(data && { data }),
    ...(params && { params }),
  };
};

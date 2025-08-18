import axios from "axios";
import { AxiosRequestConfig } from "axios";
import { baseUrl } from "./baseUrl";
interface GetAllServiceRequestParams {
  token: string;
  page: number;
  limit: number;
  search?: string;
  category?: number;
  user?: number;
  location?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: string;
}
export const getAllServiceRequests = ({
  token,
  page,
  limit,
  search,
  category,
  user,
  status,
  location,
  type,
  startDate,
  endDate,
  orderBy = "DESC",
}: GetAllServiceRequestParams) => {
  const params: Record<string, any> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (search) params.search = search;
  if (category) params.category = category;
  if (user) params.user = user;
  if (location) params.location = location;
  if (status) params.status = status;
  if (type) params.type = type;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (orderBy) params.orderBy = orderBy;
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/getallservicerequest`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  };
  console.log({
    config,
  });
  return axios(config);
};
export const getServiceRequest = (id: string, token: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/getservicerequest`,
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
export const closeServiceRequest = (params: { [key: string]: any }) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/closeservicerequest`,
    method: "GET",
    params,
  };
  return axios(config);
};
export const deleteServiceRequest = (id: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/deleteservicerequest/${id}`,
    method: "DELETE",
  };
  return axios(config);
};
export const createServiceRequest = (data: any, token: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/createservicerequest`,
    method: "POST",
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
export const updateServiceRequest = (id: string, data: any, token: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/updateservicerequest/${id}`,
    method: "PUT",
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
export const getRecommendedServiceRequest = () => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/getrecommendedservicerequest`,
    method: "GET",
  };
  return axios(config);
};

export const getServiceRequestAroundMe = (
  token: string,
  params: {
    latitude: number;
    longitude: number;
    search?: string;
    category?: number[];
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  },
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/getservicerequestaroundme`,
    method: "GET",
    params: {
      latitude: params.latitude,
      longitude: params.longitude,
      search: params.search,
      category: params.category?.join(","), // Join array into a comma-separated string
      startDate: params.startDate,
      endDate: params.endDate,
      orderBy: "DESC",
      page: params.page,
      limit: params.limit,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};

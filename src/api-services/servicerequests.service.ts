// src/services/servicerequest.ts
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
  type,
  startDate,
  endDate,
  orderBy,
}: GetAllServiceRequestParams) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/getallservicerequest`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
      ...(search && { search }),
      ...(category && { category }),
      ...(user && { user }),
      ...(status && { status }),
      ...(type && { type }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(orderBy && { orderBy }),
    },
  };

  return axios(config);
};
export const getServiceRequest = (
  params: { [key: string]: any },
  token: string,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/getservicerequest`,
    method: "GET",
    params,
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

export const updateServiceRequest = (id: string, data: any) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/updateservicerequest/${id}`,
    method: "PUT",
    data,
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

export const getServiceRequestAroundMe = () => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/getservicerequestaroundme`,
    method: "GET",
  };
  return axios(config);
};

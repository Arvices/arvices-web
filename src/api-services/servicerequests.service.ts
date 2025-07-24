// src/services/servicerequest.ts
import axios from "axios";
import { AxiosRequestConfig } from "axios";

import { baseUrl } from "./baseUrl";

export const getAllServiceRequests = (token: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/servicerequest/getallservicerequest`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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

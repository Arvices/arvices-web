import axios from "axios";
import { baseUrl } from "./baseUrl";

export const createOffer = async (
  token: string,
  data: {
    description: string;
    price: string;
    servicerequestId: number;
  },
) => {
  const config = {
    method: "post",
    url: `${baseUrl}/offer/createoffer`,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config);
};

export const getAllOffers = async (
  token: string,
  params: {
    search?: string;
    servicerequest?: number;
    user?: number;
    startDate?: string;
    endDate?: string;
    accepted?: number;
    orderBy?: string;
    page: number;
    limit: number;
  },
) => {
  console.log({ params });

  const config = {
    method: "get",
    url: `${baseUrl}/offer/getalloffer`,
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return await axios(config);
};

export const getOfferById = async (token: string, id: number) => {
  const config = {
    method: "get",
    url: `${baseUrl}/offer/getoffer`,
    params: { id },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config);
};

export const getAcceptedOfferForRequest = async (
  token: string,
  servicerequestId: number,
) => {
  const config = {
    method: "get",
    url: `${baseUrl}/offer/getservicerequestacceptedoffer`,
    params: { servicerequestId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config);
};

export const deleteOffer = async (token: string, id: number) => {
  const config = {
    method: "delete",
    url: `${baseUrl}/offer/deleteoffer/${id}`,
    params: { id },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config);
};

export const updateOffer = async (
  token: string,
  id: number,
  data: {
    price: string;
    description: string;
    accepted: boolean;
  },
) => {
  const config = {
    method: "put",
    url: `${baseUrl}/offer/updateoffer/${id}?id=${id}`,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config);
};

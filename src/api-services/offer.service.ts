import axios from "axios";
import { baseUrl } from "./baseUrl";
import { Offer } from "../types/main.types";

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
    url: `${baseUrl}/offer/getoffer/${id}`,
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
    price?: string;
    description?: string;
    accepted?: boolean;
    counterOffer?: {
      price: number;
      description: string;
      offerId: number;
    };
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

export const createCounterOffer = async (
  token: string,
  data: {
    description: string;
    price: string;
    offerId: number;
  },
) => {
  const config = {
    method: "post",
    url: `${baseUrl}/offer/createcounteroffer`,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return await axios(config);
};

export const getAllCounterOffers = async (
  token: string,
  params: {
    search?: string;
    type?: string;
    offer?: number;
    user?: number;
    startDate?: string; // ISO date-time string
    endDate?: string; // ISO date-time string
    accepted?: number;
    orderBy?: string; // e.g., "ASC" | "DESC"
    page: number;
    limit: number;
  },
) => {
  const config = {
    method: "get",
    url: `${baseUrl}/offer/getallcounteroffer`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params, // Axios will automatically serialize this into query params
  };
  return await axios(config);
};

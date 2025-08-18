import axios, { AxiosRequestConfig } from "axios";
import { baseUrl } from "./baseUrl";
interface CreateNotificationPayload {
  header: string;
  message: string;
  userId: number;
  servicerequestId: number;
}
const createNotification = async (
  data: CreateNotificationPayload,
  token?: string,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/notification/createnotification`,
    method: "POST",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    data,
  };
  return axios(config);
};
const getAllNotifications = async (token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/notification/getallnotifications`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const getNotificationById = async (id: string, token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/notification/getnotification/${id}`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
interface GetAllUserNotificationsParams {
  token?: string;
  search?: string;
  type?: string;
  read?: number;
  startDate?: string;
  endDate?: string;
  orderBy?: string;
  page: number;
  limit: number;
}
const getAllUserNotifications = async ({
  token,
  search,
  type,
  read,
  startDate,
  endDate,
  orderBy,
  page,
  limit,
}: GetAllUserNotificationsParams) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/notification/getallusernotification`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    params: {
      ...(search && {
        search,
      }),
      ...(type && {
        type,
      }),
      ...(read !== undefined && {
        read,
      }),
      ...(startDate && {
        startDate,
      }),
      ...(endDate && {
        endDate,
      }),
      ...(orderBy && {
        orderBy,
      }),
      page,
      limit,
    },
  };
  console.log({
    notifConfig: config,
  });
  return axios(config);
};
const updateNotificationToRead = async (id: number, token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/notification/updatenotificationtoread/${id}`,
    method: "PUT",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const deleteNotification = async (id: number, token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/notification/deletenotification/${id}`,
    method: "DELETE",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
export {
  createNotification,
  getAllNotifications,
  getNotificationById,
  getAllUserNotifications,
  updateNotificationToRead,
  deleteNotification,
};

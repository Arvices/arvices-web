import axios, { AxiosRequestConfig } from "axios";
import { baseUrl } from "./baseUrl";
const createMessage = async (data: any, token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/message/createmessage`,
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
const getAllMessages = async (token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/message/getallmessage`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const getMessageById = async (id: string, token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/message/getmessage/${id}`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const getAllUserMessages = async (userId: number, token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/message/getallusermessage/${userId}`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const updateMessageToRead = async (id: number, token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/message/updatemessagetoread/${id}`,
    method: "PUT",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const deleteMessage = async (id: number, token?: string) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/message/deletemessage/${id}`,
    method: "DELETE",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const getAllUserConversations = async (
  userId: number,
  search?: string,
  token?: string,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/message/getalluserconversation/${userId}`,
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
    },
  };
  return axios(config);
};
const getUserConversation = async (
  userId: number,
  toUserId: number,
  token?: string,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/message/getuserconversation/${userId}/${toUserId}`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
  return axios(config);
};
const getAllMessagesInUserConversation = async (
  userId: number,
  userConversationId: number,
  options?: {
    search?: string;
    startDate?: string;
    endDate?: string;
    orderBy?: string;
    page?: number;
    limit?: number;
  },
  token?: string,
) => {
  const config: AxiosRequestConfig = {
    url: `${baseUrl}/message/getallmessagesinuserconversation/${userId}/${userConversationId}`,
    method: "GET",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    params: {
      ...(options?.search && {
        search: options.search,
      }),
      ...(options?.startDate && {
        startDate: options.startDate,
      }),
      ...(options?.endDate && {
        endDate: options.endDate,
      }),
      ...(options?.orderBy && {
        orderBy: options.orderBy,
      }),
      page: options?.page ?? 1,
      limit: options?.limit ?? 10,
    },
  };
  return axios(config);
};
export {
  createMessage,
  getAllMessages,
  getMessageById,
  getAllUserMessages,
  updateMessageToRead,
  deleteMessage,
  getAllUserConversations,
  getAllMessagesInUserConversation,
  getUserConversation,
};

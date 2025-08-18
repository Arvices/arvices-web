import axios from "axios";
import { baseUrl } from "./baseUrl";
const createShowcase = async (data: FormData, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/createshowcase`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};
const updateShowcase = async (id: string, data: any, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/updateshowcase/${id}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};
const getShowcase = async (id: string) => {
  const config = {
    url: `${baseUrl}/showcase/getshowcase/${id}`,
    method: "GET",
  };
  return axios(config);
};
const getAllShowcase = async () => {
  const config = {
    url: `${baseUrl}/showcase/getallshowcase`,
    method: "GET",
  };
  return axios(config);
};
const deleteShowcase = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/deleteshowcase/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const likeShowcase = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/likeshowcase/${id}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const unlikeShowcase = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/unlikeshowcase/${id}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const saveShowcase = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/saveshowcase/${id}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const getSavedShowcase = async (token: string) => {
  const config = {
    url: `${baseUrl}/showcase/getsavedshowcase`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const deleteShowcaseAttachment = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/deleteshowcaseattachment/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const deleteShowcaseCommentAttachment = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/deleteshowcasecommentattachment/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const createShowcaseComment = async (data: any, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/createshowcasecomment`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};
const updateShowcaseComment = async (id: string, data: any, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/updateshowcasecomment/${id}`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data,
  };
  return axios(config);
};
const getShowcaseComment = async (id: string) => {
  const config = {
    url: `${baseUrl}/showcase/getshowcasecomment/${id}`,
    method: "GET",
  };
  return axios(config);
};
const getAllShowcaseComment = async () => {
  const config = {
    url: `${baseUrl}/showcase/getallshowcasecomment`,
    method: "GET",
  };
  return axios(config);
};
const deleteShowcaseComment = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/deleteshowcasecomment/${id}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const likeShowcaseComment = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/likeshowcasecomment/${id}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const unlikeShowcaseComment = async (id: string, token: string) => {
  const config = {
    url: `${baseUrl}/showcase/unlikeshowcasecomment/${id}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios(config);
};
const getShowcaseTimeline = async () => {
  const config = {
    url: `${baseUrl}/showcase/getshowcasetimeline`,
    method: "GET",
  };
  return axios(config);
};
export {
  createShowcase,
  updateShowcase,
  getShowcase,
  getAllShowcase,
  deleteShowcase,
  likeShowcase,
  unlikeShowcase,
  saveShowcase,
  getSavedShowcase,
  deleteShowcaseAttachment,
  deleteShowcaseCommentAttachment,
  createShowcaseComment,
  updateShowcaseComment,
  getShowcaseComment,
  getAllShowcaseComment,
  deleteShowcaseComment,
  likeShowcaseComment,
  unlikeShowcaseComment,
  getShowcaseTimeline,
};

import axios from "axios";
import { baseUrl } from "./baseUrl";
import { BookingData } from "../pages/profile/bookingcarlendar";
const createBooking = async (data: BookingData, token?: string) => {
  const config = {
    url: `${baseUrl}/bookings/createbookings`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    data,
  };
  return axios(config);
};
const updateBooking = async (id: number, data: any, token?: string) => {
  const config = {
    url: `${baseUrl}/bookings/updatebookings/${id}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    data,
  };
  return axios(config);
};
const getBookingById = async (id: number, token?: string) => {
  const config = {
    url: `${baseUrl}/bookings/getbookings/${id}`,
    method: "GET",
    headers: {
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  };
  return axios(config);
};
const getAllBookings = async (
  params?: {
    search?: string;
    userId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    orderBy?: string;
    page?: number;
    limit?: number;
  },
  token?: string,
) => {
  const config = {
    url: `${baseUrl}/bookings/getallbookings`,
    method: "GET",
    headers: {
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    params,
  };
  return axios(config);
};
const getAllMadeBookings = async (
  params?: {
    search?: string;
    userId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    orderBy?: string;
    page?: number;
    limit?: number;
  },
  token?: string,
) => {
  const config = {
    url: `${baseUrl}/bookings/getallmadebookings`,
    method: "GET",
    headers: {
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    params,
  };
  return axios(config);
};
const deleteBooking = async (id: number, token?: string) => {
  const config = {
    url: `${baseUrl}/bookings/deletebookings/${id}`,
    method: "DELETE",
    headers: {
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
  };
  return axios(config);
};
export {
  createBooking,
  updateBooking,
  getBookingById,
  getAllBookings,
  getAllMadeBookings,
  deleteBooking,
};

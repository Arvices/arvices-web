import { AxiosError } from "axios";
export const parseHttpError = (error: unknown): string => {
  console.error(error);
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosError = error as AxiosError<any>;
    const deepMessage =
      axiosError?.response?.data?.error?.message ||
      axiosError?.response?.data?.message ||
      axiosError?.response?.data?.error ||
      axiosError?.message ||
      "An unexpected error occurred";
    console.log({
      deepMessage,
    });
    return deepMessage;
  }
  if (error instanceof Error) {
    console.log({
      errMsg: error.message,
    });
    return error.message;
  }
  return "An unknown error occurred";
};

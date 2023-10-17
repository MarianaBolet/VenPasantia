import axios, { AxiosRequestConfig } from "axios";

const { VITE_API_URL } = import.meta.env;

export const axiosConfig: (token: string) => AxiosRequestConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default axios.create({
  baseURL: VITE_API_URL ? VITE_API_URL : "http://localhost:3080",
  timeout: 8000,
});

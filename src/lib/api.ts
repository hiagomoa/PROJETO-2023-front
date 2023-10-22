import { API_HOST } from "@/common/utils/config";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : API_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

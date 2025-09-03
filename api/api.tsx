import axios from 'axios';
export const api = axios.create({
  baseURL: "",
  timeout: 10_000,
});
const DEV_TOKEN = "";
api.interceptors.request.use((config) => {
  if (DEV_TOKEN) {
    config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
  }
  return config;
});

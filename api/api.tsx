import axios from 'axios';
export const api = axios.create({
  baseURL: "",  //https://cobee-server-108875465480.asia-northeast3.run.app",
  timeout: 10_000,
});
const DEV_TOKEN = "";
api.interceptors.request.use((config) => {
  if (DEV_TOKEN) {
    config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
  }
  return config;
});

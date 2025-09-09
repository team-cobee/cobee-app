import axios from 'axios';
export const api = axios.create({
  baseURL: "https://cobee-server-108875465480.asia-northeast3.run.app",
  timeout: 10_000,
});
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTc1NzUzNDczNX0.cNMg3yBoHdl_YyF23MDze5zUtXoC9RD6JKSQFVPi9hs"
api.interceptors.request.use((config) => {
  if (DEV_TOKEN) {
    config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
  }
  return config;
});

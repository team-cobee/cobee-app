import axios from 'axios';
export const api = axios.create({
  baseURL: "http://172.20.5.103:8080",  //https://cobee-server-108875465480.asia-northeast3.run.app",
  timeout: 10_000,
});
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTc1NzMyNjc5NX0.7i1y6AH2bqCKa1ReQR1Umc7mfMzHbZDY1oTyEGM-inQ";
api.interceptors.request.use((config) => {
  if (DEV_TOKEN) {
    config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
  }
  return config;
});

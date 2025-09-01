// import axios from 'axios';

// export const api = axios.create({
//   baseURL: 'http://192.168.200.166:8080',
//   timeout: 10_000,
// });

// // 토큰 가져오기 (임시: localStorage/AsyncStorage에 저장했다고 가정)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken'); // RN이면 AsyncStorage 사용
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

//import { API_BASE_URL, DEV_TOKEN } from '@env';
import axios from 'axios';

export const api = axios.create({
  baseURL: "http://172.20.5.113:8080",
  timeout: 10_000,
});
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTc1Njc0MDU5MH0.xaZojqLSqXeS_Nv7V6WjWGLUDKaSKP8MYp31VQife14";
api.interceptors.request.use((config) => {
  if (DEV_TOKEN) {
    config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
  }
  return config;
});

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
  baseURL: "http://192.168.200.105:8080", //https://cobee-server-400237407831.asia-northeast3.run.app",
  timeout: 10_000,
});
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTc1Njg5ODgxM30.w9I-_r0fyBToD8VMaCPPeAJFH8KzNQ2uSy5F5bLATew";
api.interceptors.request.use((config) => {
  if (DEV_TOKEN) {
    config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
  }
  return config;
});

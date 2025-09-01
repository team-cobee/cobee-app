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

import { API_BASE_URL, DEV_TOKEN } from '@env';
import axios from 'axios';

export const api = axios.create({
  baseURL: API_BASE_URL, // 맥북 IP
  timeout: 10_000,
});

// 개발/테스트용: 로그인해서 받은 토큰을 직접 넣어두기
api.interceptors.request.use((config) => {
  if (DEV_TOKEN) {
    config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
  }
  return config;
});


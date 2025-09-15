import axios from 'axios';
export const BASE_URL = 'https://cobee-server-108875465480.asia-northeast3.run.app';
export const api = axios.create({
  baseURL: "https://cobee-server-108875465480.asia-northeast3.run.app",
  timeout: 10_000,
});
const DEV_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1IiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTc1ODA0Njg4M30.cmvsqPxbyqft5ZIrMZysC3N3ecp87odgVZNlQ85mcqk"
api.interceptors.request.use((config) => {
  if (DEV_TOKEN) {
    config.headers.Authorization = `Bearer ${DEV_TOKEN}`;
  }
  return config;
});


// api.ts - 소셜 연동됐을떄 경우 
// import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
// import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './tokenStorage';

// export const BASE_URL = 'https://cobee-server-108875465480.asia-northeast3.run.app';

// export const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10_000,
// });

// // --- 요청 인터셉터: AsyncStorage에서 토큰 읽어서 붙이기
// api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
//   const token = await getAccessToken();

//   // headers가 객체든 AxiosHeaders든 모두 포용
//   const headers = new AxiosHeaders(config.headers);

//   if (token) {
//     headers.set('Authorization', `Bearer ${token}`);
//   }

//   config.headers = headers;
//   return config;
// });

// // --- 응답 인터셉터: 401이면 자동 갱신 후 재시도
// let isRefreshing = false;
// let refreshPromise: Promise<string | null> | null = null;

// api.interceptors.response.use(
//   (res) => res,
//   async (error: AxiosError) => {
//     const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
//     const status = error.response?.status;

//     if (status === 401 && !original._retry) {
//       original._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;
//         refreshPromise = (async () => {
//           const refreshToken = await getRefreshToken();
//           if (!refreshToken) throw error;

//           // 백엔드 규약에 맞춰 수정: body/param/쿠키 중 무엇을 쓰는지
//           const { data } = await axios.post(
//             `${BASE_URL}/auth/refresh`,
//             { refreshToken },
//             { timeout: 10_000 }
//           );

//           // 응답 포맷: { success, data: { accessToken, refreshToken } }
//           const newAt: string = data?.data?.accessToken;
//           const newRt: string = data?.data?.refreshToken ?? refreshToken;

//           if (!newAt) throw new Error('No accessToken from refresh');

//           await saveTokens({ accessToken: newAt, refreshToken: newRt });
//           isRefreshing = false;
//           return newAt;
//         })().catch(async (e) => {
//           isRefreshing = false;
//           refreshPromise = null;
//           await clearTokens();
//           throw e;
//         });
//       }

//       const newAccess = await refreshPromise!;
//       // ✅ 여기서도 AxiosHeaders로 설정
//       const headers = new AxiosHeaders(original.headers);
//       headers.set('Authorization', `Bearer ${newAccess}`);
//       original.headers = headers;

//       return api(original);
//     }

//     return Promise.reject(error);
//   }
// );

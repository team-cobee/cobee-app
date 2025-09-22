// authService.ts (또는 컴포넌트 파일 상단)
import { Alert } from 'react-native';
import { BASE_URL, api } from '@/api/api';
import { saveTokens } from '@/api/tokenStorage';

// 공통 처리: 서버 응답 파싱 보조 (content-type이 text/plain으로 와도 파싱)
async function parseJSONResponse(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Unexpected response: ${text.slice(0, 200)}`);
  }
}

export async function handleKakaoLogin() {
  const redirectUri = `${BASE_URL}/oauth2/callback?mode=api`;
  const authUrl = `${BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(redirectUri)}`;

  try {
    // 주의: OAuth는 보통 리다이렉트/사용자 입력이 필요하므로
    // "웹뷰에서 로그인 후 최종 콜백이 JSON"일 때에만 fetch가 성공합니다.
    const response = await fetch(authUrl, { method: 'GET' , credentials: 'include' });
    const tokenInfo = await parseJSONResponse(response);
   // const tokenInfo = await response.json();
      console.log('Token:', tokenInfo);

    if (!tokenInfo?.success) throw new Error(tokenInfo?.message ?? 'Login failed');

    const { accessToken, refreshToken } = tokenInfo.data.data ?? {};
    if (!accessToken || !refreshToken) throw new Error('Token missing');

    await saveTokens({ accessToken, refreshToken });

    Alert.alert('카카오 로그인 성공!');
    // 이후 필요하면 화면 이동, 사용자 프로필 로드 등
  } catch (err: any) {
    console.error(err);
    Alert.alert('카카오 로그인 중 오류가 발생했습니다.', String(err?.message ?? err));
    throw err;
  }
}

export async function handleGoogleLogin() {
  const redirectUri = `${BASE_URL}/oauth2/callback?mode=api`;
  const authUrl = `${BASE_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}`;

  try {
    const res = await fetch(authUrl, { method: 'GET' });
    const json = await parseJSONResponse(res);

    if (!json?.success) throw new Error(json?.message ?? 'Login failed');

    const { accessToken, refreshToken } = json.data ?? {};
    if (!accessToken || !refreshToken) throw new Error('Token missing');

    await saveTokens({ accessToken, refreshToken });

    Alert.alert('구글 로그인 성공!');
  } catch (err: any) {
    console.error(err);
    Alert.alert('구글 로그인 중 오류가 발생했습니다.', String(err?.message ?? err));
    throw err;
  }
}

// import React, { useRef, useState, useCallback } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, Image, Alert
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { BASE_URL } from '@/api/api';
// import { saveTokens } from '@/api/tokenStorage';

// interface LoginScreenProps {
//   onLogin?: () => void;
//   onSkip?: () => void;
//   onSignup?: () => void;
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, justifyContent: 'center',
//     paddingHorizontal: 24, paddingVertical: 48, backgroundColor: '#ffffff',
//   },
//   logoContainer: { alignItems: 'center', marginBottom: 40 },
//   logo: { width: 160, height: 128, resizeMode: 'contain' },
//   subtitle: { marginTop: 8, textAlign: 'center', fontSize: 14, color: '#6b7280' },
//   buttonContainer: { gap: 16 },
//   skipContainer: { marginTop: 32, paddingTop: 16 },
//   skipButton: { alignItems: 'center', paddingVertical: 12 },
//   skipText: { fontSize: 16, color: '#6b7280' },
//   kakaoLoginButton: { width: '100%', height: 48, resizeMode: 'contain' },
//   googleLoginButton: { width: '100%', height: 48, resizeMode: 'contain' },

//   // --- WebView overlay (페이지 전환처럼 보이게)
//   webviewWrap: { position: 'absolute', inset: 0, backgroundColor: '#fff' },
//   webviewHeader: {
//     height: 52, paddingHorizontal: 16, borderBottomColor: '#e5e7eb', borderBottomWidth: 1,
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
//   },
//   headerTitle: { fontSize: 16, fontWeight: '600' },
//   headerBtn: { padding: 8 },
// });

// export default function LoginScreen({ onSkip, onSignup, onLogin }: LoginScreenProps) {
//   const [webUrl, setWebUrl] = useState<string | null>(null);
//   const [loadingUrl, setLoadingUrl] = useState<string | null>(null);
//   const webRef = useRef<WebView>(null);

//   // 서버가 JSON만 내려주는 콜백 (성공/실패 모두 여기로 오게 하는 걸 권장)
//   const redirectUri = `${BASE_URL}/oauth2/callback?mode=api`;

//   // 콜백 페이지에서 body의 JSON을 RN으로 보내는 주입 스크립트
//   const postBodyTextToRN = `
//     (function() {
//       try {
//         var txt = document.body ? document.body.innerText : '';
//         window.ReactNativeWebView.postMessage(txt || '');
//       } catch (e) {
//         window.ReactNativeWebView.postMessage(JSON.stringify({ error: 'postMessage-failed' }));
//       }
//     })();
//     true;
//   `;

//   // 허용할 최상위 네비게이션(탑레벨) 도메인 (리소스 로드엔 영향 없음)
//   const allowedTopNavPrefixes = [
//     BASE_URL,
//     'https://kauth.kakao.com',
//     'https://accounts.google.com',
//   ];

//   // 버튼 → 새 페이지처럼 풀스크린 WebView 열기
//   const openKakao = () => {
//     const authUrl = `${BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(redirectUri)}`;
//     setWebUrl(authUrl);
//     setLoadingUrl(authUrl);
//   };
//   const openGoogle = () => {
//     const authUrl = `${BASE_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
//     setWebUrl(authUrl);
//     setLoadingUrl(authUrl);
//   };

//   // 콜백 도달 시 JSON 회수
//   const onLoadEnd = useCallback((e: any) => {
//     const url: string = e?.nativeEvent?.url ?? '';
//     setLoadingUrl(null);
//     if (url.startsWith(redirectUri)) {
//       webRef.current?.injectJavaScript(postBodyTextToRN);
//     }
//   }, [redirectUri]);

//   // 콜백에서 온 JSON 수신 → 토큰 저장 → 닫기
//   const onMessage = useCallback(async (e: any) => {
//     try {
//       const raw = e?.nativeEvent?.data || '';
//       if (!/^\s*\{/.test(raw)) return;       // JSON 모양만 처리 (중간 HTML 페이지 무시)
//       const json = JSON.parse(raw);

//       if (!json?.success) {
//         // 서버가 실패 JSON을 내려줄 때 UX
//         Alert.alert('로그인 실패', json?.message ?? '로그인에 실패했습니다.');
//         setWebUrl(null);
//         return;
//       }

//       const { accessToken, refreshToken } = json.data ?? {};
//       if (!accessToken || !refreshToken) throw new Error('Token missing');

//       await saveTokens({ accessToken, refreshToken });
//       setWebUrl(null);
//       Alert.alert('로그인 성공!');
//       onLogin?.();
//     } catch {
//       // JSON이 아니면 무시
//     }
//   }, [onLogin]);

//   // 탑레벨 네비게이션 필터링 (localhost 차단 등)
//   const onShouldStartLoadWithRequest = useCallback((req: any) => {
//     const url: string = req?.url ?? '';

//     // 1) localhost로 가는 리다이렉트는 앱에서 접근 불가 → 차단하고 UX 처리
//     if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
//       Alert.alert(
//         '로그인 오류',
//         '앱에서 localhost로 리다이렉트되어 연결이 거부되었습니다.\n' +
//         '서버의 성공/실패 리다이렉트를 기기에서 접근 가능한 도메인이나 JSON 콜백으로 변경해주세요.'
//       );
//       setWebUrl(null);
//       return false;
//     }

//     // 2) 콜백 URL은 허용 (도달 시 onLoadEnd에서 JSON 회수)
//     if (url.startsWith(redirectUri)) return true;

//     // 3) 그 외 최상위 네비게이션은 화이트리스트 허용
//     if (allowedTopNavPrefixes.some(p => url.startsWith(p))) return true;

//     // 필요 시 추가 허용/차단 로직
//     return true;
//   }, [redirectUri]);

//   // 네트워크 에러 UX
//   const onError = useCallback((e: any) => {
//     const { description, url } = e.nativeEvent || {};
//     if (url?.startsWith('http://localhost') || url?.startsWith('http://127.0.0.1')) {
//       // 위에서 이미 차단했겠지만 혹시 모를 케이스
//       Alert.alert(
//         '로그인 오류',
//         '앱에서 localhost로 리다이렉트되어 연결이 거부되었습니다.'
//       );
//       setWebUrl(null);
//       return;
//     }
//     Alert.alert('페이지 로드 오류', description || '네트워크 오류가 발생했습니다.');
//   }, []);

//   const handleSignup = () => onSignup?.();

//   return (
//     <View style={styles.container}>
//       {/* 기존 디자인 유지 */}
//       <View style={styles.logoContainer}>
//         <Image source={require('../assets/images/cobee-logo.png')} style={styles.logo} />
//         <Text style={styles.subtitle}>완벽한 룸메이트를 찾아보세요</Text>
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity onPress={openKakao} activeOpacity={0.8}>
//           <Image source={require('../assets/images/kakao-login.png')} style={styles.kakaoLoginButton} />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={openGoogle} activeOpacity={0.8}>
//           <Image source={require('../assets/images/google-login.png')} style={styles.googleLoginButton} />
//         </TouchableOpacity>

//         <View style={styles.skipContainer}>
//           <TouchableOpacity style={styles.skipButton} onPress={handleSignup}>
//             <Text style={styles.skipText}>회원가입하기</Text>
//           </TouchableOpacity>
//         </View>

//         {onSkip && (
//           <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
//             <Text style={styles.skipText}>다음에 하기</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* 🔥 새 페이지처럼 보이는 풀스크린 WebView 오버레이 */}
//       {webUrl && (
//         <View style={styles.webviewWrap}>
//           <View style={styles.webviewHeader}>
//             <Text style={styles.headerTitle}>소셜 로그인</Text>
//             <TouchableOpacity style={styles.headerBtn} onPress={() => setWebUrl(null)}>
//               <Text>닫기</Text>
//             </TouchableOpacity>
//           </View>

//           <WebView
//             ref={webRef}
//             source={{ uri: webUrl }}
//             onLoadEnd={onLoadEnd}
//             onMessage={onMessage}
//             onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
//             onError={onError}
//             startInLoadingState
//             javaScriptEnabled
//             sharedCookiesEnabled
//             thirdPartyCookiesEnabled
//             // 필요 시: 카카오 페이지 내 http 리소스가 섞여 있으면 아래 주석 해제
//             // mixedContentMode="always"
//           />
//         </View>
//       )}
//     </View>
//   );
// }

/* 일단은 사용자 api 확인 있는 버전 - 니증에 수정하기 */
// import React, { useRef, useState, useCallback } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, Image, Alert
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { BASE_URL } from '@/api/api';
// import { saveTokens } from '@/api/tokenStorage';

// interface LoginScreenProps {
//   onLogin?: () => void;
//   onSkip?: () => void;
//   onSignup?: () => void;
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, justifyContent: 'center',
//     paddingHorizontal: 24, paddingVertical: 48, backgroundColor: '#ffffff',
//   },
//   logoContainer: { alignItems: 'center', marginBottom: 40 },
//   logo: { width: 160, height: 128, resizeMode: 'contain' },
//   subtitle: { marginTop: 8, textAlign: 'center', fontSize: 14, color: '#6b7280' },
//   buttonContainer: { gap: 16 },
//   skipContainer: { marginTop: 32, paddingTop: 16 },
//   skipButton: { alignItems: 'center', paddingVertical: 12 },
//   skipText: { fontSize: 16, color: '#6b7280' },
//   kakaoLoginButton: { width: '100%', height: 48, resizeMode: 'contain' },
//   googleLoginButton: { width: '100%', height: 48, resizeMode: 'contain' },

//   // --- WebView overlay (페이지 전환처럼 보이게)
//   webviewWrap: { position: 'absolute', inset: 0, backgroundColor: '#fff' },
//   webviewHeader: {
//     height: 52, paddingHorizontal: 16, borderBottomColor: '#e5e7eb', borderBottomWidth: 1,
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
//   },
//   headerTitle: { fontSize: 16, fontWeight: '600' },
//   headerBtn: { padding: 8 },
// });

// export default function LoginScreen({ onSkip, onSignup, onLogin }: LoginScreenProps) {
//   const [webUrl, setWebUrl] = useState<string | null>(null);
//   const [loadingUrl, setLoadingUrl] = useState<string | null>(null);
//   const webRef = useRef<WebView>(null);

//   // 서버가 JSON만 내려주는 콜백 (성공/실패 모두 여기로 오게 하는 걸 권장)
//   const redirectUri = `${BASE_URL}/oauth2/callback?mode=api`;

//   // 콜백 페이지에서 body의 JSON을 RN으로 보내는 주입 스크립트
//   const postBodyJsonToRN = `
//     (function() {
//       try {
//         var root = document.querySelector('pre') || document.body;
//         var txt = root ? root.innerText : '';
//         var s = txt.indexOf('{');
//         var e = txt.lastIndexOf('}');
//         var jsonText = (s !== -1 && e !== -1 && e > s) ? txt.slice(s, e+1) : txt;
//         window.ReactNativeWebView.postMessage(jsonText);
//       } catch (e) {
//         window.ReactNativeWebView.postMessage('{"error":"postMessage-failed"}');
//       }
//     })();
//     true;
//   `;

//   // 허용할 최상위 네비게이션(탑레벨) 도메인 (리소스 로드엔 영향 없음)
//   const allowedTopNavPrefixes = [
//     BASE_URL,
//     'https://kauth.kakao.com',
//     'https://accounts.google.com',
//   ];

//   // 버튼 → 새 페이지처럼 풀스크린 WebView 열기
//   const openKakao = () => {
//     const authUrl = `${BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(redirectUri)}`;
//     setWebUrl(authUrl);
//     setLoadingUrl(authUrl);
//   };
//   const openGoogle = () => {
//     const authUrl = `${BASE_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
//     setWebUrl(authUrl);
//     setLoadingUrl(authUrl);
//   };

//   // 콜백 도달 시 JSON 회수
//   const onLoadEnd = useCallback((e: any) => {
//     const url: string = e?.nativeEvent?.url ?? '';
//     if (url.startsWith(redirectUri)) {
//       webRef.current?.injectJavaScript(postBodyJsonToRN);
//     }
//   }, [redirectUri]);

//   // 콜백에서 온 JSON 수신 → 토큰 저장 → 닫기
//   const onMessage = useCallback(async (e: any) => {
//     try {
//       const raw = e?.nativeEvent?.data || '';
//       if (!/^\s*\{/.test(raw)) return;       // JSON 모양만 처리 (중간 HTML 페이지 무시)
//       const json = JSON.parse(raw);

//       if (!json?.success) {
//         // 서버가 실패 JSON을 내려줄 때 UX
//         Alert.alert('로그인 실패', json?.message ?? '로그인에 실패했습니다.');
//         setWebUrl(null);
//         return;
//       }

//       const { accessToken, refreshToken } = json.data ?? {};
//       if (!accessToken || !refreshToken) throw new Error('Token missing');

//       await saveTokens({ accessToken, refreshToken });
//       setWebUrl(null);
//       Alert.alert('로그인 성공!');
//       onLogin?.();
//     } catch {
//       // JSON이 아니면 무시
//     }
//   }, [onLogin]);

//   // 탑레벨 네비게이션 필터링 (localhost 차단 등)
//   const onShouldStartLoadWithRequest = useCallback((req: any) => {
//     const url: string = req?.url ?? '';

//     // 1) localhost로 가는 리다이렉트는 앱에서 접근 불가 → 차단하고 UX 처리
//     if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
//       Alert.alert(
//         '로그인 오류',
//         '앱에서 localhost로 리다이렉트되어 연결이 거부되었습니다.\n' +
//         '서버의 성공/실패 리다이렉트를 기기에서 접근 가능한 도메인이나 JSON 콜백으로 변경해주세요.'
//       );
//       setWebUrl(null);
//       return false;
//     }

//     // 2) 콜백 URL은 허용 (도달 시 onLoadEnd에서 JSON 회수)
//     if (url.startsWith(redirectUri)) return true;

//     // 3) 그 외 최상위 네비게이션은 화이트리스트 허용
//     if (allowedTopNavPrefixes.some(p => url.startsWith(p))) return true;

//     // 필요 시 추가 허용/차단 로직
//     return true;
//   }, [redirectUri]);

//   function pickTokens(payload: any) {
//     if (!payload) return null;
//     if (payload.accessToken && payload.refreshToken) {
//       return { accessToken: payload.accessToken, refreshToken: payload.refreshToken };
//     }
//     if (payload.data?.accessToken && payload.data?.refreshToken) {
//       return { accessToken: payload.data.accessToken, refreshToken: payload.data.refreshToken };
//     }
//     if (payload.data?.data?.accessToken && payload.data?.data?.refreshToken) {
//       return { accessToken: payload.data.data.accessToken, refreshToken: payload.data.data.refreshToken };
//     }
//     return null;
//   }

//   // 네트워크 에러 UX
//   const onError = useCallback((e: any) => {
//     const { description, url } = e.nativeEvent || {};
//     if (url?.startsWith('http://localhost') || url?.startsWith('http://127.0.0.1')) {
//       // 위에서 이미 차단했겠지만 혹시 모를 케이스
//       Alert.alert(
//         '로그인 오류',
//         '앱에서 localhost로 리다이렉트되어 연결이 거부되었습니다.'
//       );
//       setWebUrl(null);
//       return;
//     }
//     Alert.alert('페이지 로드 오류', description || '네트워크 오류가 발생했습니다.');
//   }, []);

//   const handleSignup = () => onSignup?.();

//   return (
//     <View style={styles.container}>
//       {/* 기존 디자인 유지 */}
//       <View style={styles.logoContainer}>
//         <Image source={require('../assets/images/cobee-logo.png')} style={styles.logo} />
//         <Text style={styles.subtitle}>완벽한 룸메이트를 찾아보세요</Text>
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity onPress={openKakao} activeOpacity={0.8}>
//           <Image source={require('../assets/images/kakao-login.png')} style={styles.kakaoLoginButton} />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={openGoogle} activeOpacity={0.8}>
//           <Image source={require('../assets/images/google-login.png')} style={styles.googleLoginButton} />
//         </TouchableOpacity>

//         <View style={styles.skipContainer}>
//           <TouchableOpacity style={styles.skipButton} onPress={handleSignup}>
//             <Text style={styles.skipText}>회원가입하기</Text>
//           </TouchableOpacity>
//         </View>

//         {onSkip && (
//           <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
//             <Text style={styles.skipText}>다음에 하기</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* 🔥 새 페이지처럼 보이는 풀스크린 WebView 오버레이 */}
//       {webUrl && (
//         <View style={styles.webviewWrap}>
//           <View style={styles.webviewHeader}>
//             <Text style={styles.headerTitle}>소셜 로그인</Text>
//             <TouchableOpacity style={styles.headerBtn} onPress={() => setWebUrl(null)}>
//               <Text>닫기</Text>
//             </TouchableOpacity>
//           </View>

//           <WebView
//             ref={webRef}
//             source={{ uri: webUrl }}
//             onLoadEnd={onLoadEnd}
//             onMessage={onMessage}
//             onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
//             onError={onError}
//             startInLoadingState
//             javaScriptEnabled
//             sharedCookiesEnabled
//             thirdPartyCookiesEnabled
//             // 필요 시: 카카오 페이지 내 http 리소스가 섞여 있으면 아래 주석 해제
//             // mixedContentMode="always"
//           />
//         </View>
//       )}
//     </View>
//   );
// }


import React, { useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { BASE_URL } from '@/api/api';
import { saveTokens, getAccessToken, getRefreshToken } from '@/api/tokenStorage';

interface LoginScreenProps {
  onLogin?: () => void;
  onSkip?: () => void;
  onSignup?: () => void;  // ✅ 토큰 저장 후 여기로 이동
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48, backgroundColor: '#ffffff' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 160, height: 128, resizeMode: 'contain' },
  subtitle: { marginTop: 8, textAlign: 'center', fontSize: 14, color: '#6b7280' },
  buttonContainer: { gap: 16 },
  skipContainer: { marginTop: 32, paddingTop: 16 },
  skipButton: { alignItems: 'center', paddingVertical: 12 },
  skipText: { fontSize: 16, color: '#6b7280' },
  kakaoLoginButton: { width: '100%', height: 48, resizeMode: 'contain' },
  googleLoginButton: { width: '100%', height: 48, resizeMode: 'contain' },
  webviewWrap: { position: 'absolute', inset: 0, backgroundColor: '#fff' },
  webviewHeader: {
    height: 52, paddingHorizontal: 16, borderBottomColor: '#e5e7eb', borderBottomWidth: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  headerBtn: { padding: 8 },
});

export default function LoginScreen({ onSkip, onSignup }: LoginScreenProps) {
  const [webUrl, setWebUrl] = useState<string | null>(null);
  const webRef = useRef<WebView>(null);

  // ✅ 백엔드 콜백 (카카오 콘솔에도 동일 문자열로 등록되어야 합니다)
  const redirectUri = `${BASE_URL}/oauth2/callback?mode=api`;

  // ① 모든 페이지 로드 후 1차 자동 추출 스크립트 (섞인 텍스트에서도 첫 JSON만 보냄)
  const INJECT_AFTER_LOAD = `
    (function() {
      try {
        var root = document.querySelector('pre') || document.body;
        var txt = root ? root.innerText : '';
        var s = txt.indexOf('{');
        var e = txt.lastIndexOf('}');
        if (s !== -1 && e !== -1 && e > s) {
          window.ReactNativeWebView.postMessage(txt.slice(s, e+1));
        }
      } catch (e) {}
    })();
    true;
  `;

  // ② 콜백 도달 시 강제로 2차 추출
  const FORCE_EXTRACT = `
    (function() {
      try {
        var root = document.querySelector('pre') || document.body;
        var txt = root ? root.innerText : '';
        var s = txt.indexOf('{');
        var e = txt.lastIndexOf('}');
        var jsonText = (s !== -1 && e !== -1 && e > s) ? txt.slice(s, e+1) : '';
        window.ReactNativeWebView.postMessage(jsonText || '{"error":"empty"}');
      } catch (e) {
        window.ReactNativeWebView.postMessage('{"error":"postMessage-failed"}');
      }
    })();
    true;
  `;

  const allowedTopNavPrefixes = [
    BASE_URL,
    'https://kauth.kakao.com',
    'https://accounts.kakao.com',
    'https://accounts.google.com',
  ];

  // 카카오/구글 로그인 시작
  const openKakao = () => {
    const authUrl = `${BASE_URL}/oauth2/authorization/kakao?redirect_uri=${encodeURIComponent(redirectUri)}`;
    setWebUrl(authUrl);
  };
  const openGoogle = () => {
    const authUrl = `${BASE_URL}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
    setWebUrl(authUrl);
  };

  // 네비게이션 변화마다 콜백 URL이면 2차 주입 (약간의 지연을 줘 DOM 준비 보장)
  const onNavChange = useCallback((nav: any) => {
    const url: string = nav?.url ?? '';
    // 디버깅용 로그
    console.log('[WebView] nav url =', url);
    if (url.startsWith(redirectUri)) {
      setTimeout(() => webRef.current?.injectJavaScript(FORCE_EXTRACT), 50);
    }
  }, [redirectUri]);

  // 콜백 JSON 수신 → 토큰 저장 → 바로 회원가입 화면 이동
  const onMessage = useCallback(async (e: any) => {
    const raw = e?.nativeEvent?.data || '';
    console.log('[WebView] onMessage raw =', raw.slice(0, 120)); // 디버깅
    // 첫/마지막 중괄호만 다시 한 번 보정
    const s = raw.indexOf('{');
    const t = raw.lastIndexOf('}');
    const jsonText = (s !== -1 && t !== -1 && t > s) ? raw.slice(s, t + 1) : raw;

    let payload: any = null;
    try { payload = JSON.parse(jsonText); } catch { payload = null; }
    if (!payload) return; // JSON 아니면 무시

    // 주신 응답형: { success, data: { accessToken, refreshToken } }
    const at = payload?.data?.accessToken ?? payload?.accessToken;
    const rt = payload?.data?.refreshToken ?? payload?.refreshToken;
    if (!at || !rt) {
      Alert.alert('로그인 실패', '토큰을 찾지 못했습니다.');
      setWebUrl(null);
      return;
    }

    await saveTokens({ accessToken: at, refreshToken: rt });

    // ✅ 저장 확인용 로그 (원하면 나중에 제거)
    const atSaved = await getAccessToken();
    const rtSaved = await getRefreshToken();
    console.log('[TOKENS] saved access =', atSaved?.slice(0, 14), '..., refresh =', rtSaved?.slice(0, 14), '...');

    setWebUrl(null);   // WebView 닫기
    onSignup?.();      // 회원가입 화면으로
  }, [onSignup]);

  // localhost 리다이렉트 방지
  const onShouldStartLoadWithRequest = useCallback((req: any) => {
    const url: string = req?.url ?? '';
    if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
      Alert.alert('로그인 오류', '앱에서 localhost로 리다이렉트되었습니다. 서버 설정을 확인해주세요.');
      setWebUrl(null);
      return false;
    }
    if (url.startsWith(redirectUri)) return true;
    if (allowedTopNavPrefixes.some(p => url.startsWith(p))) return true;
    return true;
  }, [redirectUri]);

  const handleSignupBtn = () => onSignup?.();

  return (
    <View style={styles.container}>
      {/* 디자인 유지 */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/cobee-logo.png')} style={styles.logo} />
        <Text style={styles.subtitle}>완벽한 룸메이트를 찾아보세요</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={openKakao} activeOpacity={0.8}>
          <Image source={require('../assets/images/kakao-login.png')} style={styles.kakaoLoginButton} />
        </TouchableOpacity>

        <TouchableOpacity onPress={openGoogle} activeOpacity={0.8}>
          <Image source={require('../assets/images/google-login.png')} style={styles.googleLoginButton} />
        </TouchableOpacity>

        <View style={styles.skipContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSignupBtn}>
            <Text style={styles.skipText}>회원가입하기</Text>
          </TouchableOpacity>
        </View>

        {onSkip && (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>다음에 하기</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 풀스크린 WebView */}
      {webUrl && (
        <View style={styles.webviewWrap}>
          <View style={styles.webviewHeader}>
            <Text style={styles.headerTitle}>소셜 로그인</Text>
            <TouchableOpacity style={styles.headerBtn} onPress={() => setWebUrl(null)}>
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>

          <WebView
            ref={webRef}
            source={{ uri: webUrl }}
            // 🔑 모든 페이지 로드 후 1차 자동 추출
            injectedJavaScript={INJECT_AFTER_LOAD}
            // 🔑 콜백 URL 감지 시 2차 강제 추출
            onNavigationStateChange={onNavChange}
            onMessage={onMessage}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            startInLoadingState
            javaScriptEnabled
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            // mixedContentMode="always" // 필요 시
          />
        </View>
      )}
    </View>
  );
}


// import { useState, useEffect, useRef } from 'react';
// import * as ImagePicker from 'expo-image-picker';
// import { api } from '@/api/api';                
// import { getAccessToken } from '@/api/tokenStorage';  
// import { Dimensions } from 'react-native';
// import MultiSlider from '@ptomasroos/react-native-multi-slider';
// import Slider from '@react-native-community/slider';
// import { KeyboardAvoidingView, Platform } from 'react-native';

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
//   Image,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Card, CardContent, CardHeader } from './ui/card';
// import { Gender, Lifestyle, Personality, Pets, Smoking, Snoring, SocialType } from '@/types/enums';

// interface SignupScreenProps {
//   onSignup?: () => void;
//   onBack?: () => void;
//   onComplete?: () => void;
// }

// type OcrUserData = {
//   id: number;
//   name: string;
//   email: string;
//   birthDate: string;
//   gender: string;
//   socialType: SocialType
//   isCompleted: boolean;
//   ocrValidation: boolean;
//   isHost: boolean;
//   verificationMessage: string;
//   verificationStatus: string;

//   residentRegistrationNumber?: string; // "910321-1XXXXXX" or "9103211XXXXXX"
//   issueDate?: string; 
// };

// type OcrVerifyResponse = {
//   message: string;
//   code: string;
//   error?: string;
//   data: OcrUserData;
//   success: boolean;
// };

// // ===== 추가: 비동기 OCR 타입 & API 함수 (이 파일 안에서만 사용) =====
// type OcrTaskStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
// type OcrVerificationResponseDto = {
//   id : number,
//   name?: string;
//   email?: string;                          
//   birthDate?: string;  // 19990101 로 옴 
//   gender? : string;
//   socialType : SocialType;
//   isCompleted : boolean;
//   ocrValidation : boolean;
//   isHost : boolean;
//   verificationMessage : string;
//   verificationStatus : string;
// };
// type OcrTask = {
//   status: OcrTaskStatus;
//   result: OcrVerificationResponseDto | null;
//   errorMessage?: string | null;
// };
// type OcrStartResponse = { taskId: string };

// type createUserPreferencesRequest = {
//   preferredGender : Gender,
//   additionalInfo : string,
//   lifeStyle : Lifestyle,
//   Personality : Personality,
//   smokingPreference : boolean, 
//   snoringPreference : boolean,
//   cohabitantCount : number,
//   petPreference : boolean
// }

// type createPublicProfilesRequest = {
//   info : string,
//   lifestyle : Lifestyle,
//   personality : Personality,
//   isSmoking : Smoking,
//   isSnoring : Snoring,
//   hasPet : Pets
// }

// interface form {
//   preferredGender: Gender  | null,
//   ageMin: number| null,
//   ageMax: number| null,
//   lifestyle: Lifestyle | null,
//   personality: Personality| null,
//   smokingPreference: boolean,
//   snoringPreference: boolean,
//   maxRoommates: number| null,
//   petPreference: boolean
  
//   // 공개 프로필
//   myLifestyle: Lifestyle| null,
//   myPersonality: Personality| null,
//   mySmokingStatus: Smoking| null,
//   mySnoringStatus: Snoring| null,
//   myPetStatus: Pets| null,
//   info: string| null;
  
//   // 신분증 인증
//   idVerified: boolean| null;
//   idImageFile: string | null;
//   idImagePreview: string | null;
//   idImageDataUrl: string | null;
//   extractedName: string| null;
//   extractedBirthDate: string| null;
//   extractedGender: Gender| null;
// }

// const INITIAL_FORM: form = {
//   preferredGender: Gender.Female,
//   ageMin: 20,
//   ageMax: 80,
//   lifestyle: Lifestyle.Evening,
//   personality: Personality.Introvert,
//   smokingPreference: false,
//   snoringPreference: false,
//   maxRoommates: 2,
//   petPreference: false,

//   myLifestyle: Lifestyle.Evening,
//   myPersonality: Personality.Extrovert,
//   mySmokingStatus: Smoking.Impossible,
//   mySnoringStatus: Snoring.Impossible,
//   myPetStatus: Pets.Impossible,
//   info: '',

//   idVerified: false,
//   idImageFile: null,
//   idImagePreview: null,
//   idImageDataUrl: null,
//   extractedName: '',
//   extractedBirthDate: '',
//   extractedGender: Gender.Female,
// };

// export default function SignupScreen({ onSignup, onBack, onComplete }: SignupScreenProps) {
//   const [step, setStep] = useState(1);
//   const SLIDER_WIDTH = Dimensions.get('window').width - 48; // 좌우 padding 고려해 적당히
//   const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const [ocrSuccess, setOcrSuccess] = useState<boolean | null>(null);
//   const [preferInfo, setPreferInfo] = useState<createUserPreferencesRequest | null>(null);
//   const [formData, setFormData] = useState<form>(INITIAL_FORM);

//   //-- 공개 프로필 작성용 --//
//   const [openLifestyle, setOpenLifestyle]     = useState(false);
//   const [openPersonality, setOpenPersonality] = useState(false);
//   const [openSmoking, setOpenSmoking]         = useState(false);
//   const [openSnoring, setOpenSnoring]         = useState(false);
//   const [openPets, setOpenPets]               = useState(false);

// // ===== 옵션 소스 (필요시 옵션만 추가/수정하면 UI 자동 반영) =====
// const lifestyleOptions = [
//   { value: Lifestyle.Morning, label: '아침형' },
//   { value: Lifestyle.Evening, label: '저녁형' },
// ];

// const personalityOptions = [
//   { value: Personality.Introvert, label: '집순이' },
//   { value: Personality.Extrovert, label: '밖순이' },
// ];

// const smokingOptions = [
//   { value: Smoking.NotSmoke, label: '비흡연자' },
//   { value: Smoking.Smoke, label: '흡연자' },
// ];

// const snoringOptions = [
//   { value: Snoring.NoSnore, label: '안함' },
//   { value: Snoring.Snore, label: '코골이함' },
// ];

// const petOptions = [
//   { value: Pets.Have, label: '있음' },
//   { value: Pets.NotHave, label: '없음' },
// ];

// // ===== 재사용 가능한 셀렉트 박스 =====
// function SelectBox<T extends string>({
//   label,
//   placeholder,
//   value,
//   open,
//   setOpen,
//   options,
//   onSelect,
// }: {
//   label: string;
//   placeholder: string;
//   value?: string;
//   open: boolean;
//   setOpen: (v: boolean) => void;
//   options: { value: T; label: string }[];
//   onSelect: (v: T) => void;
// }) {
//   return (
//     <View style={{ marginBottom: 16 }}>
//       <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>{label}</Text>

//       <TouchableOpacity
//         onPress={() => setOpen(!open)}
//         style={{
//           borderWidth: 1,
//           borderColor: '#d1d5db',
//           borderRadius: 8,
//           paddingHorizontal: 12,
//           paddingVertical: 12,
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}
//       >
//         <Text style={{ fontSize: 16, color: value ? '#000' : '#9ca3af' }}>
//           {options.find(o => o.value === value)?.label || placeholder}
//         </Text>
//         <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#9ca3af" />
//       </TouchableOpacity>

//       {open && (
//         <View
//           style={{
//             borderWidth: 1,
//             borderColor: '#d1d5db',
//             borderRadius: 8,
//             marginTop: 8,
//             maxHeight: 220,     // 스크롤 영역 높이
//             overflow: 'hidden',
//             backgroundColor: 'white',
//           }}
//         >
//           <ScrollView>
//             {options.map(opt => (
//               <TouchableOpacity
//                 key={opt.value}
//                 onPress={() => {
//                   onSelect(opt.value);
//                   setOpen(false);
//                 }}
//                 style={{
//                   paddingVertical: 12,
//                   paddingHorizontal: 12,
//                   backgroundColor: value === opt.value ? '#FFF7E6' : 'white',
//                   borderBottomWidth: 1,
//                   borderBottomColor: '#f3f4f6',
//                 }}
//               >
//                 <Text style={{ fontSize: 16 }}>{opt.label}</Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         </View>
//       )}
//     </View>
//   );
// }

// // ===== 선택 영역을 묶어주는 섹션 래퍼 (디자인 정돈용) =====
// function SelectSection({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <Card>
//       <CardHeader>
//         <Text style={{ fontSize: 16, fontWeight: '500' }}>{title}</Text>
//       </CardHeader>
//       <CardContent style={{ gap: 16 }}>
//         {children}
//       </CardContent>
//     </Card>
//   );
// }



//   function maskRRN(v?: string) {
//   if (!v) return '';
//   const digits = v.replace(/\D/g, '');
//   if (digits.length < 7) return v; // 불완전하면 원문 반환
//   const left = digits.slice(0, 6);
//   const right = digits.slice(6);
//   return `${left}-${right[0]}${'*'.repeat(Math.max(0, right.length - 1))}`;
// }

// // 발급일: "YYYYMMDD" | "YYYY-MM-DD" | "YY.MM.DD" → "YYYY.MM.DD"
// function formatBirthDateAndAge(v?: string) {
//   if (!v) return '';
//   const digits = v.replace(/\D/g, '');
//   if (digits.length === 8) {
//     return `${digits.slice(0,4)}.${digits.slice(4,6)}.${digits.slice(6,8)}`;
//   }
//   return v; // 포맷을 모르면 원문 유지
// }

// const makeUserPreferences = async (input: createUserPreferencesRequest) => {
//   const token = await getAccessToken().catch(() => null);
//   const res = await api.post('/preferences', input, {
//     headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//   });
//   return res.data;
// };


// const makePublicProfile = async (input: createPublicProfilesRequest) => {
//   const token = await getAccessToken().catch(() => null);
//   const res = await api.post('/public-profiles', input, {
//     headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
//   });
//   //return res;
// };

// // 파일 업로드 → taskId 발급
// async function startOcrVerificationMultipart(file: { uri: string; name?: string; type?: string }) {
//   const token = await getAccessToken().catch(() => null);
//   const filename = file.name ?? `id-${Date.now()}.jpg`;
//   const mime = file.type ?? 'image/jpeg';

//   const form = new FormData();
//   form.append('image', { uri: file.uri, name: filename, type: mime } as any);

//   const res = await api.post<{ message: string; code: string; data: OcrStartResponse }>(
//     '/ocr/verify', // 컨트롤러의 basePath가 /ocr 라고 가정
//     form,
//     {
//       headers: {
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         'Content-Type': 'multipart/form-data',
//         Accept: 'application/json',
//       },
//     }
//   );
//   console.log(res.data.data);
//   return res.data.data; // { taskId }
// }

// // task 상태 조회
// async function getOcrVerificationStatus(taskId: string) {
//   const token = await getAccessToken().catch(() => null);
//   const res = await api.get<{ message: string; code: string; data: OcrTask }>(
//     `/ocr/verify/status/${taskId}`,
//     { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
//   );
//   console.log(res.data.data);
//   return res.data.data;
// }

// // 최종 서버 인증 상태 확인
// async function getOcrStatus() {
//   const token = await getAccessToken().catch(() => null);
//   const res = await api.get<{ message: string; code: string; data: { ocrVerified: boolean } }>(
//     '/ocr/status',
//     { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
//   );
//   return res.data.data; // { ocrVerified: boolean }
// }

// // ===== [추가] DTO 빌더 =====
// function buildUserPreferencesPayload(form: typeof formData): createUserPreferencesRequest {
//   return {
//     preferredGender: form?.preferredGender as Gender,
//     additionalInfo: form?.info as string, 
//     lifeStyle: form?.lifestyle as Lifestyle,
//     Personality: form?.personality as Personality,
//     smokingPreference: form?.smokingPreference as Smoking,
//     snoringPreference: form?.snoringPreference as Snoring,
//     cohabitantCount: form?.maxRoommates as number,
//     petPreference: form?.petPreference as Pets,
//   };
// }

// function buildPublicProfilePayload(form: typeof formData): createPublicProfilesRequest {
//   return {
//     info: form?.info as string,
//     lifestyle: form?.myLifestyle as Lifestyle,
//     personality: form?.myPersonality as Personality,
//     isSmoking: form?.mySmokingStatus as Smoking,
//     isSnoring: form?.mySnoringStatus as Snoring,
//     hasPet: form?.myPetStatus as Pets,
//   };
// }

// // ===== [추가] 최종 저장 핸들러 =====
// const handleFinishSignup = async () => {
//   console.log("시작")
//   try {
//     // 1) 매칭 선호도 저장
//     const prefPayload = buildUserPreferencesPayload(formData);
//     console.log(prefPayload);
//     await makeUserPreferences(prefPayload);

//     // 2) 공개 프로필 저장
//     const profilePayload = buildPublicProfilePayload(formData);
//     //console.log(profilePayload);
//     await makePublicProfile(profilePayload);

//     Alert.alert('완료', '설정과 프로필이 저장되었어요!');
//     onSignup?.();
//     onComplete?.();
//   } catch (e: any) {
//     Alert.alert('에러', e?.message ?? '저장 중 오류가 발생했습니다.');
//   }
// };

//   useEffect(() => {
//   return () => {
//       if (pollTimerRef.current) clearInterval(pollTimerRef.current);
//     };
//   }, []);

//   const [uploadState, setUploadState] = useState({
//     isUploading: false,
//     isProcessing: false,
//     error: null as string | null
//   });

//   const [ocrInfo, setOcrInfo] = useState<OcrVerificationResponseDto | null>(null);

//   const nextStep = () => setStep(step + 1);
//   const prevStep = () => setStep(step - 1);

//   // === 기존 ocrVerify 제거/대체: 비동기 작업 시작만 수행 (taskId 획득) ===
//   const ocrVerifyStart = async (file: { uri: string; name?: string; type?: string }) => {
//     try {
//       const data = await startOcrVerificationMultipart(file); 
//       return data.taskId;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         'OCR 업로드 실패';
//       throw new Error(msg);
//     }
//   };

//   const handleFileSelect = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('권한 필요', '사진 접근 권한을 허용해주세요.');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         base64: false,
//         quality: 0.9,
//         allowsEditing: false,
//       });
//       if (result.canceled) return;

//       const asset = result.assets[0];
//       const mime = asset.mimeType ?? 'image/jpeg';
//       const name = asset.fileName ?? `id-${Date.now()}.jpg`;

//       setFormData(prev => ({
//         ...prev,
//         idImageFile: asset.uri,
//         idImagePreview: asset.uri,
//       }));

//       setUploadState({ isUploading: false, isProcessing: true, error: null }); // 로딩 표시
//       await processOCR({ uri: asset.uri, name, type: mime });
//     } catch (e: any) {
//       Alert.alert('오류', e?.message ?? '이미지 선택 중 오류가 발생했습니다.');
//     }
//   };

//   // === 핵심: 업로드 → taskId → 폴링 → SUCCESS 시 데이터 반영/다음 버튼 활성화 ===
//   const processOCR = async (file: { uri: string; name?: string; type?: string }) => {
//   setUploadState({ isUploading: false, isProcessing: true, error: null });

//   const startedAt = Date.now();

//   try {
//     console.log('[OCR] 업로드 시작');
//     const taskId = await ocrVerifyStart(file);
//     if (!taskId) throw new Error('작업 ID를 받지 못했습니다.');
//     console.log('[OCR] 업로드 성공, taskId =', taskId);

//     const POLL_MS = 3000;
//     const MAX_ATTEMPTS = 80;
//     let attempts = 0;

//     const pollOnce = async () => {
//       attempts += 1;
//       const sinceStartSec = ((Date.now() - startedAt) / 1000).toFixed(1);
//       console.log(`[OCR] 폴링 시도 #${attempts} (${sinceStartSec}s 경과, 간격=${POLL_MS}ms), taskId=${taskId}`);

//       const t0 = Date.now();
//       try {
//         const t = await getOcrVerificationStatus(taskId);
//         const dt = Date.now() - t0;

//         console.log(`[OCR] 폴링 응답 #${attempts} (${dt}ms) status=${t.status}`,
//           t.status === 'FAILED' ? `, error="${t.errorMessage ?? ''}"` : '',
//           t.status === 'SUCCESS' ? `, resultKeys=${Object.keys(t.result ?? {})}` : ''
//         );

//         if (t.status === 'SUCCESS') {
//           if (pollTimerRef.current) clearInterval(pollTimerRef.current);
//           pollTimerRef.current = null;
//           setOcrSuccess(Boolean(t.result?.isCompleted));
//           setOcrInfo(t?.result);
//           console.log('[OCR] SUCCESS → 폴링 중단, onOcrSuccess 호출');
//           await onOcrSuccess(t);
//         } else if (t.status === 'FAILED') {
//           if (pollTimerRef.current) clearInterval(pollTimerRef.current);
//           pollTimerRef.current = null;
//           console.log('[OCR] FAILED → 폴링 중단');
//           throw new Error(t.errorMessage ?? 'OCR 인증에 실패했습니다.');
//         } else {
//           if (attempts >= MAX_ATTEMPTS) {
//             if (pollTimerRef.current) clearInterval(pollTimerRef.current);
//             pollTimerRef.current = null;
//             console.log('[OCR] MAX_ATTEMPTS 초과 → 폴링 중단');
//             throw new Error('처리가 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
//           }
//         }
//       } catch (err: any) {
//         if (pollTimerRef.current) clearInterval(pollTimerRef.current);
//         pollTimerRef.current = null;
//         console.log(`[OCR] 폴링 오류 #${attempts}:`, err?.message ?? err);
//         throw err;
//       }
//     };

//     pollTimerRef.current = setInterval(pollOnce, POLL_MS);
//     console.log('[OCR] 폴링 시작(setInterval)');
//     await pollOnce(); // 즉시 1회 실행 (여기서 PENDING이면 계속 돌아야 함)
//   } catch (err: any) {
//     setUploadState({
//       isUploading: false,
//       isProcessing: false,
//       error: err?.message ?? '인증 처리 중 오류가 발생했습니다.',
//     });
//     console.log('[OCR] 처리 실패:', err?.message ?? err);
//   }
// };


//   // SUCCESS 시 데이터 반영 + 서버 인증 상태 체크
//   const onOcrSuccess = async (task: OcrTask) => {
//     const r = task.result ?? null;

//     setFormData(prev => ({
//       ...prev,
//       idVerified: true,
//       extractedName: r?.name || '',
//       extractedBirthDate: r?.birthDate || '',
//       extractedGender: r?.gender === 'Male' || r?.gender === '남자'
//         ? Gender.Male
//         : r?.gender === 'Female' || r?.gender === '여자'
//         ? Gender.Female
//         : r?.gender === 'None' || r?.gender === '상관없음'
//         ? Gender.None
//         : null
//     }));

//     // 서버 최종 인증 상태 조회 (실패해도 치명적 X)
//     try {
//       const s = await getOcrStatus();
//       // 필요하면 s.ocrVerified를 어디 저장/표시
//     } catch {}

//     setUploadState({ isUploading: false, isProcessing: false, error: null });
//   };

//   const resetUpload = () => {
//     setFormData({
//       ...formData,
//       idImageFile: null,
//       idImagePreview: null,
//       idVerified: false,
//       extractedName: '',
//       extractedBirthDate: '',
//       extractedGender: Gender.Female,
//     });
//     setUploadState({
//       isUploading: false,
//       isProcessing: false,
//       error: null
//     });
//   };

//   const renderStep = () => {
//     switch (step) {
//       case 1:
//         return (
//           <View style={{ gap: 24 }}>
//             <View style={{ alignItems: 'center' }}>
//               <Text style={{ fontSize: 20, fontWeight: '600' }}>신분증 인증</Text>
//               <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
//                 안전한 서비스 이용을 위해 신분증 인증이 필요합니다
//               </Text>
//             </View>

//             <Card style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: '#F7B32B80' }}>
//               <CardContent style={{ padding: 32, alignItems: 'center' }}>
//                 {formData?.idVerified ? (
//                   <View style={{ gap: 16 }}>
//                     {/* 업로드된 이미지를 주민등록증 비율로 표시 */}
//                     {formData.idImagePreview && (
//                       <View style={{ marginTop: 16 }}>
//                         <View style={{
//                           width: '90%',
//                           maxWidth: 300,
//                           alignSelf: 'center',
//                           borderWidth: 1,
//                           borderColor: '#e5e7eb',
//                           borderRadius: 8,
//                           overflow: 'hidden',
//                           backgroundColor: '#f9fafb',
//                           aspectRatio: 85.6 / 54 // 주민등록증 비율 (가로 85.6㎜ × 세로 54㎜)
//                         }}>
//                           <Image 
//                             source={{ uri: formData?.idImagePreview }} 
//                             style={{ width: '100%', height: '100%' }}
//                             resizeMode="contain"
//                           />
//                         </View>
//                       </View>
//                     )}
                    
//                     {/* OCR 추출 정보 */}
//                     {formData.extractedName && (
//                       <View style={{ 
//                         backgroundColor: '#f0fdf4', 
//                         borderWidth: 1, 
//                         borderColor: '#bbf7d0', 
//                         borderRadius: 8, 
//                         padding: 16,
//                         alignItems: 'flex-start'
//                       }}>
//                         <Text style={{ fontSize: 14, fontWeight: '500', color: '#166534', marginBottom: 12 }}>추출된 정보</Text>
//                         <View style={{ gap: 8, width: '100%' }}>
//                           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Text style={{ color: '#15803d' }}>이름</Text>
//                             <Text style={{ fontWeight: '500', color: '#14532d' }}>{formData?.extractedName}</Text>
//                           </View>
//                           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Text style={{ color: '#15803d' }}>생년월일</Text>
//                             <Text style={{ fontWeight: '500', color: '#14532d' }}>{formData?.extractedBirthDate}</Text>
//                           </View>
//                           <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                             <Text style={{ color: '#15803d' }}>성별</Text>
//                             <Text style={{ fontWeight: '500', color: '#14532d' }}>{formData?.extractedGender}</Text>
//                           </View>
//                         </View>
//                       </View>
//                     )}

//                     {/* 인증 완료 메시지를 추출된 정보 아래로 이동 */}
//                     <View style={{ alignItems: 'center' }}>
//                       <Text style={{ fontWeight: '500', color: '#15803d' }}>신분증 인증 완료</Text>
//                       <Text style={{ fontSize: 14, color: '#16a34a', marginTop: 4 }}>신분증이 성공적으로 인증되었습니다</Text>
//                     </View>
                    
//                     <TouchableOpacity 
//                       onPress={resetUpload}
//                       style={{
//                         borderWidth: 1,
//                         borderColor: '#d1d5db',
//                         borderRadius: 8,
//                         paddingVertical: 8,
//                         paddingHorizontal: 16,
//                         alignItems: 'center',
//                         marginTop: 8
//                       }}
//                     >
//                       <Text style={{ fontSize: 14 }}>다시 업로드</Text>
//                     </TouchableOpacity>

//                     <View style={{ 
//                       backgroundColor: '#eff6ff', 
//                       borderWidth: 1, 
//                       borderColor: '#bfdbfe', 
//                       borderRadius: 8, 
//                       padding: 12,
//                       marginTop: 16
//                     }}>
//                       <Text style={{ fontSize: 12, color: '#2563eb' }}>
//                         <Text style={{ fontWeight: 'bold' }}>개인정보 보호:</Text> 추출된 정보는 본인 확인 용도로만 사용되며, 
//                         주민등록번호 뒷자리는 보안을 위해 마스킹 처리됩니다.
//                       </Text>
//                     </View>
//                   </View>
//                 ) : uploadState.isProcessing ? (
//                   <View style={{ gap: 16 }}>
//                     <View style={{ width: 64, height: 64, alignSelf: 'center' }}>
//                       <View style={{
//                         width: 64,
//                         height: 64,
//                         borderWidth: 4,
//                         borderColor: '#bfdbfe',
//                         borderTopColor: '#2563eb',
//                         borderRadius: 32,
//                         alignSelf: 'center'
//                       }} />
//                     </View>
//                     <View style={{ alignItems: 'center' }}>
//                       <Text style={{ fontWeight: '500', color: '#1d4ed8' }}>OCR 인증 중...</Text>
//                       <Text style={{ fontSize: 14, color: '#2563eb', marginTop: 4 }}>신분증 정보를 확인하고 있습니다</Text>
//                     </View>
//                     {formData?.idImagePreview && (
//                       <View style={{ marginTop: 16 }}>
//                         <View style={{
//                           width: 128,
//                           alignSelf: 'center',
//                           borderWidth: 1,
//                           borderColor: '#e5e7eb',
//                           borderRadius: 8,
//                           overflow: 'hidden',
//                           backgroundColor: '#f9fafb',
//                           opacity: 0.5,
//                           aspectRatio: 85.6 / 54 // 주민등록증 비율 (가로 85.6㎜ × 세로 54㎜)
//                         }}>
//                           <Image 
//                             source={{ uri: formData.idImagePreview }}
//                             style={{ width: '100%', height: '100%' }}
//                             resizeMode="contain"
//                           />
//                         </View>
//                       </View>
//                     )}
//                   </View>
//                 ) : (
//                   <View style={{ gap: 16 }}>
//                     {formData?.idImagePreview ? (
//                       <View style={{ gap: 16 }}>
//                         <View style={{
//                           width: 128,
//                           alignSelf: 'center',
//                           borderWidth: 1,
//                           borderColor: '#e5e7eb',
//                           borderRadius: 8,
//                           overflow: 'hidden',
//                           backgroundColor: '#f9fafb',
//                           aspectRatio: 85.6 / 54 // 주민등록증 비율 (가로 85.6㎜ × 세로 54㎜)
//                         }}>
//                           <Image 
//                             source={{ uri: formData.idImagePreview }}
//                             style={{ width: '100%', height: '100%' }}
//                             resizeMode="contain"
//                           />
//                         </View>
//                         {uploadState.error && (
//                           <View style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 8, padding: 12 }}>
//                             <Text style={{ fontSize: 14, color: '#dc2626' }}>{uploadState.error}</Text>
//                           </View>
//                         )}
//                         <View style={{ flexDirection: 'row', gap: 8 }}>
//                           <TouchableOpacity 
//                             onPress={resetUpload}
//                             style={{
//                               flex: 1,
//                               borderWidth: 1,
//                               borderColor: '#d1d5db',
//                               borderRadius: 8,
//                               paddingVertical: 8,
//                               paddingHorizontal: 16,
//                               alignItems: 'center'
//                             }}
//                           >
//                             <Text style={{ fontSize: 14 }}>다시 선택</Text>
//                           </TouchableOpacity>
//                           <TouchableOpacity 
//                             onPress={() => processOCR({ uri: formData.idImageFile!, name: `retry-${Date.now()}.jpg`, type: 'image/jpeg' })}
//                               disabled={uploadState.isProcessing}
//                             style={{
//                               flex: 1,
//                               backgroundColor: '#F7B32B',
//                               borderRadius: 8,
//                               paddingVertical: 8,
//                               paddingHorizontal: 16,
//                               alignItems: 'center'
//                             }}
//                           >
//                             <Text style={{ fontSize: 14, color: 'white' }}>다시 인증</Text>
//                           </TouchableOpacity>
//                         </View>
//                       </View>
//                     ) : (
//                       <View style={{ alignItems: 'center', gap: 16 }}>
//                         <Ionicons name="camera" size={64} color="#9ca3af" />
//                         <View style={{ alignItems: 'center' }}>
//                           <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>신분증 사진 업로드</Text>
//                           <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 16 }}>
//                             주민등록증 또는 운전면허증을 업로드해주세요{'\n'}OCR로 자동 인증됩니다
//                           </Text>
//                         </View>
//                         <View style={{ gap: 12, width: '100%' }}>
//                           <TouchableOpacity 
//                             onPress={handleFileSelect}
//                             disabled={uploadState.isUploading}
//                             style={{
//                               width: '100%',
//                               borderWidth: 1,
//                               borderColor: '#d1d5db',
//                               borderRadius: 8,
//                               paddingVertical: 12,
//                               paddingHorizontal: 16,
//                               alignItems: 'center',
//                               flexDirection: 'row',
//                               justifyContent: 'center',
//                               gap: 8
//                             }}
//                           >
//                             <Text style={{ fontSize: 16 }}>📤</Text>
//                             <Text style={{ fontSize: 16 }}>{uploadState.isUploading ? '업로드 중...' : '신분증 사진 선택'}</Text>
//                           </TouchableOpacity>
//                           <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
//                             JPG, PNG 파일 (최대 5MB){'\n'}개인정보는 안전하게 암호화되어 저장됩니다
//                           </Text>
//                         </View>
//                       </View>
//                     )}
                    
//                     {uploadState.error && !formData?.idImagePreview && (
//                       <View style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 8, padding: 12, marginTop: 16 }}>
//                         <Text style={{ fontSize: 14, color: '#dc2626' }}>{uploadState.error}</Text>
//                       </View>
//                     )}
//                   </View>
//                 )}
//               </CardContent>
//             </Card>

//             <TouchableOpacity 
//               onPress={nextStep}
//               disabled={!formData?.idVerified}
//               style={{
//                 width: '100%',
//                 paddingVertical: 16,
//                 borderRadius: 8,
//                 alignItems: 'center',
//                 backgroundColor: formData?.idVerified ? '#E6940C' : 'rgba(247, 179, 43, 0.5)'
//               }}
//             >
//               <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>다음</Text>
//             </TouchableOpacity>
//           </View>
//         );

//       case 2:
//         return (
//           <View style={{ gap: 24 }}>
//             <View style={{ alignItems: 'center' }}>
//               <Text style={{ fontSize: 20, fontWeight: '600' }}>매칭 선호도 설정</Text>
//               <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
//                 원하는 룸메이트 조건을 설정해주세요
//               </Text>
//             </View>

//             <View style={{ gap: 24 }}>
//               <View>
//                 <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>선호 성별</Text>
//                 <View style={{ flexDirection: 'row', gap: 8 }}>
//                   {[
//                     { value: Gender.Male, label: '남자' },
//                     { value: Gender.Female, label: '여자' },
//                     { value: Gender.None, label: '상관없음' }
//                   ].map((option) => (
//                     <TouchableOpacity
//                       key={option.value}
//                       onPress={() => setFormData({...formData, preferredGender: option.value})}
//                       style={{
//                         flex: 1,
//                         padding: 12,
//                         borderWidth: 1,
//                         borderColor: formData?.preferredGender === option.value ? '#F7B32B' : '#d1d5db',
//                         borderRadius: 8,
//                         alignItems: 'center',
//                         backgroundColor: formData?.preferredGender === option.value ? '#F7B32B' : 'transparent'
//                       }}
//                     >
//                       <Text style={{
//                         fontSize: 14,
//                         color: formData?.preferredGender === option.value ? 'white' : '#374151'
//                       }}>
//                         {option.label}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View>
//                 <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
//                   선호 나이대: {formData?.ageMin}세 - {formData?.ageMax}세
//                 </Text>

//                 <View style={{ alignItems: 'center' }}>
//                   <MultiSlider
//                     values={[
//                       formData?.ageMin ?? 20,
//                       formData?.ageMax ?? 80
//                     ]}
//                     min={20}
//                     max={100}
//                     step={1}
//                     sliderLength={SLIDER_WIDTH}
//                     onValuesChangeFinish={(vals) =>
//                       setFormData({ ...formData, ageMin: vals[0], ageMax: vals[1] })
//                     }
//                     selectedStyle={{ backgroundColor: '#E6940C' }}   // 선택된 구간 색
//                     unselectedStyle={{ backgroundColor: '#e5e7eb' }} // 비선택 구간 색
//                     trackStyle={{ height: 6, borderRadius: 3 }}
//                     markerStyle={{
//                       height: 24, width: 24, borderRadius: 12, backgroundColor: '#E6940C',
//                     }}
//                     pressedMarkerStyle={{ transform: [{ scale: 1.1 }] }}
//                   />
//                   <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: SLIDER_WIDTH }}>
//                     <Text style={{ fontSize: 12, color: '#6b7280' }}>20세</Text>
//                     <Text style={{ fontSize: 12, color: '#6b7280' }}>80세</Text>
//                   </View>
//                 </View>
//               </View>

//               <View>
//                 <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>생활 패턴</Text>
//                 <View style={{ flexDirection: 'row', gap: 8 }}>
//                   {[
//                     { value: Lifestyle.Morning, label: '아침형' },
//                     { value: Lifestyle.Evening, label: '저녁형' }
//                   ].map((option) => (
//                     <TouchableOpacity
//                       key={option.value}
//                       onPress={() => setFormData({...formData, lifestyle: option.value})}
//                       style={{
//                         flex: 1,
//                         padding: 12,
//                         borderWidth: 1,
//                         borderColor: formData?.lifestyle === option.value ? '#F7B32B' : '#d1d5db',
//                         borderRadius: 8,
//                         alignItems: 'center',
//                         backgroundColor: formData?.lifestyle === option.value ? '#F7B32B' : 'transparent'
//                       }}
//                     >
//                       <Text style={{
//                         fontSize: 14,
//                         color: formData?.lifestyle === option.value ? 'white' : '#374151'
//                       }}>
//                         {option.label}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View>
//                 <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>성격 유형</Text>
//                 <View style={{ flexDirection: 'row', gap: 8 }}>
//                   {[
//                     { value: Personality.Introvert, label: '집순이' },
//                     { value: Personality.Extrovert, label: '밖순이' }
//                   ].map((option) => (
//                     <TouchableOpacity
//                       key={option.value}
//                       onPress={() => setFormData({...formData, personality: option.value})}
//                       style={{
//                         flex: 1,
//                         padding: 12,
//                         borderWidth: 1,
//                         borderColor: formData?.personality === option.value ? '#F7B32B' : '#d1d5db',
//                         borderRadius: 8,
//                         alignItems: 'center',
//                         backgroundColor: formData?.personality === option.value ? '#F7B32B' : 'transparent'
//                       }}
//                     >
//                       <Text style={{
//                         fontSize: 14,
//                         color: formData?.personality === option.value ? 'white' : '#374151'
//                       }}>
//                         {option.label}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </View>

//             <View style={{ flexDirection: 'row', gap: 12 }}>
//               <TouchableOpacity 
//                 onPress={prevStep}
//                 style={{
//                   flex: 1,
//                   borderWidth: 1,
//                   borderColor: '#d1d5db',
//                   borderRadius: 8,
//                   paddingVertical: 16,
//                   alignItems: 'center'
//                 }}
//               >
//                 <Text style={{ fontSize: 16 }}>이전</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 onPress={nextStep}
//                 disabled={!formData?.preferredGender || !formData?.lifestyle || !formData?.personality}
//                 style={{
//                   flex: 1,
//                   borderRadius: 8,
//                   paddingVertical: 16,
//                   alignItems: 'center',
//                   backgroundColor: formData?.preferredGender && formData.lifestyle && formData.personality
//                     ? '#E6940C' 
//                     : 'rgba(247, 179, 43, 0.5)'
//                 }}
//               >
//                 <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>다음</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         );

//       case 3:
//         return (
//           <View style={{ gap: 24 }}>
//             <View style={{ alignItems: 'center' }}>
//               <Text style={{ fontSize: 20, fontWeight: '600' }}>상세 선호도</Text>
//               <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
//                 함께 살 때 중요한 조건들을 설정해주세요
//               </Text>
//             </View>

//             <View style={{ gap: 24 }}>
//               <View>
//                 <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>흡연 여부</Text>
//                 <View style={{ flexDirection: 'row', gap: 8 }}>
//                   {[
//                     { value: Smoking.Impossible, label: '흡연 불가' },
//                     { value: Smoking.None, label: '상관없음' }
//                   ].map((option) => (
//                     <TouchableOpacity
//                       key={option.value}
//                       onPress={() => setFormData({...formData, smokingPreference: option.value})}
//                       style={{
//                         flex: 1,
//                         padding: 12,
//                         borderWidth: 1,
//                         borderColor: formData?.smokingPreference === option.value ? '#F7B32B' : '#d1d5db',
//                         borderRadius: 8,
//                         alignItems: 'center',
//                         backgroundColor: formData?.smokingPreference === option.value ? '#F7B32B' : 'transparent'
//                       }}
//                     >
//                       <Text style={{
//                         fontSize: 14,
//                         color: formData?.smokingPreference === option.value ? 'white' : '#374151'
//                       }}>
//                         {option.label}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View>
//                 <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>코골이</Text>
//                 <View style={{ flexDirection: 'row', gap: 8 }}>
//                   {[
//                     { value: Snoring.None, label: '상관없음' },
//                     { value: Snoring.Impossible, label: '코골이 불가' }
//                   ].map((option) => (
//                     <TouchableOpacity
//                       key={option.value}
//                       onPress={() => setFormData({...formData, snoringPreference: option.value})}
//                       style={{
//                         flex: 1,
//                         padding: 12,
//                         borderWidth: 1,
//                         borderColor: formData?.snoringPreference === option.value ? '#F7B32B' : '#d1d5db',
//                         borderRadius: 8,
//                         alignItems: 'center',
//                         backgroundColor: formData?.snoringPreference === option.value ? '#F7B32B' : 'transparent'
//                       }}
//                     >
//                       <Text style={{
//                         fontSize: 14,
//                         color: formData?.snoringPreference === option.value ? 'white' : '#374151'
//                       }}>
//                         {option.label}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <View>
//                 <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
//                   동거 가능 인원 수 (본인 포함): {formData?.maxRoommates}명
//                 </Text>

//                 <Slider
//                   value={formData?.maxRoommates as number}
//                   onValueChange={(v) =>
//                     setFormData({ ...formData, maxRoommates: Math.round(v as number) })
//                   }
//                   minimumValue={2}
//                   maximumValue={10}
//                   step={1}
//                   minimumTrackTintColor="#E6940C"
//                   maximumTrackTintColor="#e5e7eb"
//                   thumbTintColor="#E6940C"
//                 />

//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                   <Text style={{ fontSize: 12, color: '#6b7280' }}>2명</Text>
//                   <Text style={{ fontSize: 12, color: '#6b7280' }}>10명</Text>
//                 </View>
//               </View>

//               <View>
//                 <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>반려동물</Text>
//                 <View style={{ flexDirection: 'row', gap: 8 }}>
//                   {[
//                     { value: Pets.Possible, label: '가능' },
//                     { value: Pets.Impossible, label: '불가능' },
//                    //{ value: 'any', label: '상관없음' }
//                   ].map((option) => (
//                     <TouchableOpacity
//                       key={option.value}
//                       onPress={() => setFormData({...formData, petPreference: option.value})}
//                       style={{
//                         flex: 1,
//                         padding: 12,
//                         borderWidth: 1,
//                         borderColor: formData?.petPreference === option.value ? '#F7B32B' : '#d1d5db',
//                         borderRadius: 8,
//                         alignItems: 'center',
//                         backgroundColor: formData?.petPreference === option.value ? '#F7B32B' : 'transparent'
//                       }}
//                     >
//                       <Text style={{
//                         fontSize: 14,
//                         color: formData?.petPreference === option.value ? 'white' : '#374151'
//                       }}>
//                         {option.label}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>
//             </View>

//             <View style={{ flexDirection: 'row', gap: 12 }}>
//               <TouchableOpacity 
//                 onPress={prevStep}
//                 style={{
//                   flex: 1,
//                   borderWidth: 1,
//                   borderColor: '#d1d5db',
//                   borderRadius: 8,
//                   paddingVertical: 16,
//                   alignItems: 'center'
//                 }}
//               >
//                 <Text style={{ fontSize: 16 }}>이전</Text>
//               </TouchableOpacity>
//               <TouchableOpacity 
//                 onPress={nextStep}
//                 disabled={!formData?.smokingPreference || !formData.snoringPreference || !formData.petPreference}
//                 style={{
//                   flex: 1,
//                   borderRadius: 8,
//                   paddingVertical: 16,
//                   alignItems: 'center',
//                   backgroundColor: formData?.smokingPreference && formData?.snoringPreference && formData?.petPreference
//                     ? '#E6940C' 
//                     : 'rgba(247, 179, 43, 0.5)'
//                 }}
//               >
//                 <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>다음</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         );

//       case 4:
//   return (
//     <View style={{ gap: 24 }}>
//       <View style={{ alignItems: 'center' }}>
//         <Text style={{ fontSize: 20, fontWeight: '600' }}>공개 프로필 작성</Text>
//         <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
//           다른 사용자에게 보여질 프로필을 작성해주세요
//         </Text>
//       </View>

//       {/* 기본 정보 (OCR 자동 입력) */}
//       <SelectSection title="기본 정보 (자동 입력됨)">
//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
//           <View style={{ flex: 1, minWidth: '45%' }}>
//             <Text style={{ fontSize: 14, color: '#6b7280' }}>이름</Text>
//             <Text style={{ fontSize: 14, fontWeight: '500' }}>
//               {ocrInfo?.name || formData?.extractedName}
//             </Text>
//           </View>
//           <View style={{ flex: 1, minWidth: '45%' }}>
//             <Text style={{ fontSize: 14, color: '#6b7280' }}>성별</Text>
//             <Text style={{ fontSize: 14, fontWeight: '500' }}>
//               {ocrInfo?.gender ? formData?.extractedGender : '희주'}
//             </Text>
//           </View>
//           <View style={{ flex: 1, minWidth: '45%' }}>
//             <Text style={{ fontSize: 14, color: '#6b7280' }}>나이</Text>
//             <Text style={{ fontSize: 14, fontWeight: '500' }}>
//               {ocrInfo?.birthDate ? formData?.extractedBirthDate : '희주'}
//             </Text>
//           </View>
//         </View>
//       </SelectSection>

//       {/* 공개 프로필 입력 섹션 */}
//       <SelectSection title="공개 프로필 입력">
//         <SelectBox
//           label="생활 패턴"
//           placeholder="선택해주세요"
//           value={formData?.myLifestyle as string}
//           open={openLifestyle}
//           setOpen={setOpenLifestyle}
//           options={lifestyleOptions}
//           onSelect={(v) => setFormData({ ...formData, myLifestyle: v })}
//         />
//         <SelectBox
//           label="성격 유형"
//           placeholder="선택해주세요"
//           value={formData?.myPersonality as string}
//           open={openPersonality}
//           setOpen={setOpenPersonality}
//           options={personalityOptions}
//           onSelect={(v) => setFormData({ ...formData, myPersonality: v })}
//         />
//         <SelectBox
//           label="흡연 여부"
//           placeholder="선택해주세요"
//           value={formData?.mySmokingStatus as string}
//           open={openSmoking}
//           setOpen={setOpenSmoking}
//           options={smokingOptions}
//           onSelect={(v) => setFormData(prev => ({ ...prev, mySmokingStatus: v }))}

//         />
//         <SelectBox
//           label="코골이"
//           placeholder="선택해주세요"
//           value={formData?.mySnoringStatus as string}
//           open={openSnoring}
//           setOpen={setOpenSnoring}
//           options={snoringOptions}
//           onSelect={(v) => setFormData({...formData, mySnoringStatus: v})}

//         />
//         <SelectBox
//           label="반려동물"
//           placeholder="선택해주세요"
//           value={formData?.myPetStatus as string}
//           open={openPets}
//           setOpen={setOpenPets}
//           options={petOptions}
//           onSelect={(v) => setFormData({ ...formData, myPetStatus: v })}
//         />

//         {/* 추가 내용 */}
//         <View>
//           <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>추가 내용 작성</Text>
//           <TextInput
//             multiline
//             numberOfLines={4}
//             placeholder="자신을 소개하는 글을 자유롭게 작성해주세요"
//             value={formData?.info as string}
//             onChangeText={(value) => setFormData({ ...formData, info: value })}
//             style={{
//               width: '100%',
//               padding: 12,
//               borderWidth: 1,
//               borderColor: '#d1d5db',
//               borderRadius: 8,
//               fontSize: 16,
//               textAlignVertical: 'top',
//               minHeight: 100,
//             }}
//           />
//         </View>
//       </SelectSection>

//       {/* 하단 버튼 */}
//       <View style={{ flexDirection: 'row', gap: 12 }}>
//         <TouchableOpacity
//           onPress={prevStep}
//           style={{
//             flex: 1,
//             borderWidth: 1,
//             borderColor: '#d1d5db',
//             borderRadius: 8,
//             paddingVertical: 16,
//             alignItems: 'center',
//           }}
//         >
//           <Text style={{ fontSize: 16 }}>이전</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={nextStep}
//           style={{
//             flex: 1,
//             borderRadius: 8,
//             paddingVertical: 16,
//             alignItems: 'center',
//             backgroundColor: '#E6940C',
//           }}
//         >
//           <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>다음</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );


//       case 5:
//         return (
//           <View style={{ gap: 24 }}>
//             <View style={{ alignItems: 'center' }}>
//               <Ionicons name="checkmark-circle" size={80} color="#10b981" style={{ marginBottom: 16 }} />
//               <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>회원가입 완료!</Text>
//               <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
//                 CoBee에 오신 것을 환영합니다{'\n'}완벽한 룸메이트를 찾아보세요
//               </Text>
//             </View>

//             <View style={{ backgroundColor: '#f9fafb', padding: 16, borderRadius: 8 }}>
//               <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>설정한 정보 요약</Text>
//               <View style={{ gap: 8 }}>
//                 {formData?.extractedName && (
//                   <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                     <Text style={{ color: '#6b7280' }}>이름</Text>
//                     <Text>{formData?.extractedName}</Text>
//                   </View>
//                 )}
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                   <Text style={{ color: '#6b7280' }}>선호 성별</Text>
//                   <Text>{
//                     formData?.preferredGender ===Gender.Male ? '남성' :
//                     formData?.preferredGender ===Gender.Female ? '여성' : '상관없음'
//                   }</Text>
//                 </View>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                   <Text style={{ color: '#6b7280' }}>선호 나이</Text>
//                   <Text>{formData?.ageMin}세 - {formData?.ageMax}세</Text>
//                 </View>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                   <Text style={{ color: '#6b7280' }}>동거 인원</Text>
//                   <Text>최대 {formData?.maxRoommates}명</Text>
//                 </View>
//                 {formData?.extractedGender && (
//                   <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                     <Text style={{ color: '#6b7280' }}>인증 성별</Text>
//                     <Text>{formData.extractedGender}</Text>
//                   </View>
//                 )}
//               </View>
//             </View>

//             <TouchableOpacity 
//               onPress={() => {
                
//                 handleFinishSignup();
//               }}
//               style={{
//                 width: '100%',
//                 paddingVertical: 16,
//                 borderRadius: 8,
//                 alignItems: 'center',
//                 backgroundColor: '#E6940C'
//               }}
//             >
//               <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>CoBee 시작하기</Text>
//             </TouchableOpacity>
//           </View>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <View style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e5e7eb',
//         paddingTop: 50
//       }}>
//         <TouchableOpacity onPress={step === 1 ? onBack : prevStep}>
//           <Ionicons name="arrow-back" size={24} color="#000000" />
//         </TouchableOpacity>
//         <Text style={{ fontSize: 18, fontWeight: '600' }}>
//           {step === 5 ? '회원가입 완료' : '회원가입'}
//         </Text>
//         <View style={{ width: 24, height: 24 }} />
//       </View>

//       <ScrollView 
//       style={{ flex: 1, padding: 24 }}
//       contentContainerStyle={{ paddingBottom: 48 }}
//       keyboardShouldPersistTaps="handled"
//       keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'} 
//       >
//         {step < 5 && (
//           <View style={{ marginBottom: 32 }}>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <View
//                   key={i}
//                   style={{
//                     width: 24,
//                     height: 24,
//                     borderRadius: 12,
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     backgroundColor: i <= step ? '#E6940C' : '#e5e7eb'
//                   }}
//                 >
//                   <Text style={{
//                     fontSize: 12,
//                     fontWeight: '500',
//                     color: i <= step ? 'white' : '#6b7280'
//                   }}>
//                     {i}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//             <View style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: 3, height: 6 }}>
//               <View
//                 style={{ 
//                   height: 6,
//                   borderRadius: 3,
//                   width: `${(step / 5) * 100}%`,
//                   backgroundColor: '#E6940C'
//                 }}
//               />
//             </View>
//           </View>
//         )}

//         {renderStep()}
//       </ScrollView>
//     </View>
//   );
  
// }


import { useState, useEffect, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { api } from '@/api/api';                
import { getAccessToken } from '@/api/tokenStorage';  
import { Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Slider from '@react-native-community/slider';
import { KeyboardAvoidingView, Platform } from 'react-native';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader } from './ui/card';
import { Gender, Lifestyle, Personality, Pets, Smoking, Snoring, SocialType } from '@/types/enums';

interface SignupScreenProps {
  onSignup?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

type OcrUserData = {
  id: number;
  name: string;
  email: string;
  birthDate: string;
  gender: string;
  socialType: SocialType
  isCompleted: boolean;
  ocrValidation: boolean;
  isHost: boolean;
  verificationMessage: string;
  verificationStatus: string;

  residentRegistrationNumber?: string; // "910321-1XXXXXX" or "9103211XXXXXX"
  issueDate?: string; 
};

type OcrVerifyResponse = {
  message: string;
  code: string;
  error?: string;
  data: OcrUserData;
  success: boolean;
};

// ===== 추가: 비동기 OCR 타입 & API 함수 (이 파일 안에서만 사용) =====
type OcrTaskStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
type OcrVerificationResponseDto = {
  id : number,
  name?: string;
  email?: string;                          
  birthDate?: string;  // 19990101 로 옴 
  gender? : string;
  socialType : SocialType;
  isCompleted : boolean;
  ocrValidation : boolean;
  isHost : boolean;
  verificationMessage : string;
  verificationStatus : string;
};
type OcrTask = {
  status: OcrTaskStatus;
  result: OcrVerificationResponseDto | null;
  errorMessage?: string | null;
};
type OcrStartResponse = { taskId: string };

type createUserPreferencesRequest = {
  preferredGender : Gender,
  additionalInfo : string,
  lifeStyle : Lifestyle,
  personality : Personality,
  smokingPreference : boolean, 
  snoringPreference : boolean,
  cohabitantCount : number,
  petPreference : boolean
}

type createPublicProfilesRequest = {
  info : string,
  lifestyle : Lifestyle,
  personality : Personality,
  isSmoking : Smoking,
  isSnoring : Snoring,
  hasPet : Pets
}

interface form {
  preferredGender: Gender  | null,
  ageMin: number| null,
  ageMax: number| null,
  lifestyle: Lifestyle | null,
  personality: Personality| null,
  smokingPreference: boolean,
  snoringPreference: boolean,
  maxRoommates: number| null,
  petPreference: boolean
  
  // 공개 프로필
  myLifestyle: Lifestyle| null,
  myPersonality: Personality| null,
  mySmokingStatus: Smoking| null,
  mySnoringStatus: Snoring| null,
  myPetStatus: Pets| null,
  info: string| null;
  
  // 신분증 인증
  idVerified: boolean| null;
  idImageFile: string | null;
  idImagePreview: string | null;
  idImageDataUrl: string | null;
  extractedName: string| null;
  extractedBirthDate: string| null;
  extractedGender: string| null;
}

// const INITIAL_FORM: form = {
//   preferredGender: Gender.Female,
//   ageMin: 20,
//   ageMax: 80,
//   lifestyle: Lifestyle.Evening,
//   personality: Personality.Introvert,
//   smokingPreference: false,
//   snoringPreference: false,
//   maxRoommates: 2,
//   petPreference: false,

//   myLifestyle: Lifestyle.Evening,
//   myPersonality: Personality.Extrovert,
//   mySmokingStatus: Smoking.Impossible,
//   mySnoringStatus: Snoring.Impossible,
//   myPetStatus: Pets.Impossible,
//   info: '',

//   idVerified: false,
//   idImageFile: null,
//   idImagePreview: null,
//   idImageDataUrl: null,
//   extractedName: '',
//   extractedBirthDate: '',
//   extractedGender: Gender.Female,
// };

const INITIAL_FORM: form = {
  preferredGender: null,
  ageMin: null,
  ageMax: null,
  lifestyle: null,
  personality: null,
  smokingPreference: false,
  snoringPreference: false,
  maxRoommates: null,
  petPreference: false,

  myLifestyle: null,
  myPersonality: null,
  mySmokingStatus: null,
  mySnoringStatus: null,
  myPetStatus: null,
  info: '',

  idVerified: false,
  idImageFile: null,
  idImagePreview: null,
  idImageDataUrl: null,
  extractedName: '',
  extractedBirthDate: '',
  extractedGender: null,
};


export default function SignupScreen({ onSignup, onBack, onComplete }: SignupScreenProps) {
  const [step, setStep] = useState(1);
  const SLIDER_WIDTH = Dimensions.get('window').width - 48; // 좌우 padding 고려해 적당히
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [ocrSuccess, setOcrSuccess] = useState<boolean | null>(null);
  const [preferInfo, setPreferInfo] = useState<createUserPreferencesRequest | null>(null);
  const [formData, setFormData] = useState<form>(INITIAL_FORM);

  //-- 공개 프로필 작성용 --//
  const [openLifestyle, setOpenLifestyle]     = useState(false);
  const [openPersonality, setOpenPersonality] = useState(false);
  const [openSmoking, setOpenSmoking]         = useState(false);
  const [openSnoring, setOpenSnoring]         = useState(false);
  const [openPets, setOpenPets]               = useState(false);

// ===== 옵션 소스 (필요시 옵션만 추가/수정하면 UI 자동 반영) =====
const lifestyleOptions = [
  { value: Lifestyle.Morning, label: '아침형' },
  { value: Lifestyle.Evening, label: '저녁형' },
];

const personalityOptions = [
  { value: Personality.Introvert, label: '집순이' },
  { value: Personality.Extrovert, label: '밖순이' },
];

// const smokingOptions = [
//   { value: Smoking.NotSmoke, label: '비흡연자' },
//   { value: Smoking.Smoke, label: '흡연자' },
// ];

// const snoringOptions = [
//   { value: Snoring.NoSnore, label: '안함' },
//   { value: Snoring.Snore, label: '코골이함' },
// ];

// const petOptions = [
//   { value: Pets.Have, label: '있음' },
//   { value: Pets.NotHave, label: '없음' },
// ];
  const smokingOptions = [
    { value: Smoking.None, label: '비흡연자' },        // None = 흡연 안함
    { value: Smoking.Impossible, label: '흡연자' },    // Impossible = 흡연 불가능(?)
  ];

  const snoringOptions = [
    { value: Snoring.None, label: '안함' },           // None = 코골이 안함
    { value: Snoring.Impossible, label: '코골이함' }, // Impossible = 코골이 불가능(?)
  ];

  const petOptions = [
    { value: Pets.Possible, label: '있음' },          // Possible = 펫 가능
    { value: Pets.Impossible, label: '없음' },        // Impossible = 펫 불가능
    // { value: Pets.None, label: '상관없음' },        // 필요시 추가
  ];


// ===== 재사용 가능한 셀렉트 박스 =====
function SelectBox<T extends string>({
  label,
  placeholder,
  value,
  open,
  setOpen,
  options,
  onSelect,
}: {
  label: string;
  placeholder: string;
  value?: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  options: { value: T; label: string }[];
  onSelect: (v: T) => void;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>{label}</Text>

      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, color: value ? '#000' : '#9ca3af' }}>
          {options.find(o => o.value === value)?.label || placeholder}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#9ca3af" />
      </TouchableOpacity>

      {open && (
        <View
          style={{
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            marginTop: 8,
            maxHeight: 220,     // 스크롤 영역 높이
            overflow: 'hidden',
            backgroundColor: 'white',
          }}
        >
          <ScrollView>
            {options.map(opt => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  backgroundColor: value === opt.value ? '#FFF7E6' : 'white',
                  borderBottomWidth: 1,
                  borderBottomColor: '#f3f4f6',
                }}
              >
                <Text style={{ fontSize: 16 }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ===== 선택 영역을 묶어주는 섹션 래퍼 (디자인 정돈용) =====
function SelectSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <Text style={{ fontSize: 16, fontWeight: '500' }}>{title}</Text>
      </CardHeader>
      <CardContent style={{ gap: 16 }}>
        {children}
      </CardContent>
    </Card>
  );
}



  function maskRRN(v?: string) {
  if (!v) return '';
  const digits = v.replace(/\D/g, '');
  if (digits.length < 7) return v; // 불완전하면 원문 반환
  const left = digits.slice(0, 6);
  const right = digits.slice(6);
  return `${left}-${right[0]}${'*'.repeat(Math.max(0, right.length - 1))}`;
}

// 발급일: "YYYYMMDD" | "YYYY-MM-DD" | "YY.MM.DD" → "YYYY.MM.DD"
function formatBirthDateAndAge(v?: string) {
  if (!v) return '';
  const digits = v.replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0,4)}.${digits.slice(4,6)}.${digits.slice(6,8)}`;
  }
  return v; // 포맷을 모르면 원문 유지
}

const makeUserPreferences = async (input: createUserPreferencesRequest) => {
  const token = await getAccessToken().catch(() => null);
  const res = await api.post('/preferences', input, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  return res.data;
};


const makePublicProfile = async (input: createPublicProfilesRequest) => {
  const token = await getAccessToken().catch(() => null);
  await api.post('/public-profiles', input, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  console.log('[PUBLIC] auth header?', !!token); // true 나와야 정상
};

// 파일 업로드 → taskId 발급
async function startOcrVerificationMultipart(file: { uri: string; name?: string; type?: string }) {
  const token = await getAccessToken().catch(() => null);
  const filename = file.name ?? `id-${Date.now()}.jpg`;
  const mime = file.type ?? 'image/jpeg';

  const form = new FormData();
  form.append('image', { uri: file.uri, name: filename, type: mime } as any);

  const res = await api.post<{ message: string; code: string; data: OcrStartResponse }>(
    '/ocr/verify', // 컨트롤러의 basePath가 /ocr 라고 가정
    form,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    }
  );
  console.log(res.data.data);
  return res.data.data; // { taskId }
}

// task 상태 조회
async function getOcrVerificationStatus(taskId: string) {
  const token = await getAccessToken().catch(() => null);
  const res = await api.get<{ message: string; code: string; data: OcrTask }>(
    `/ocr/verify/status/${taskId}`,
    { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
  );
  console.log(res.data.data);
  return res.data.data;
}

// 최종 서버 인증 상태 확인
async function getOcrStatus() {
  const token = await getAccessToken().catch(() => null);
  const res = await api.get<{ message: string; code: string; data: { ocrVerified: boolean } }>(
    '/ocr/status',
    { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } }
  );
  return res.data.data; // { ocrVerified: boolean }
}

// ===== [추가] DTO 빌더 =====
// function buildUserPreferencesPayload(form: typeof formData): createUserPreferencesRequest {
//   return {
//     preferredGender: form?.preferredGender as Gender,
//     additionalInfo: form?.info as string, 
//     lifeStyle: form?.lifestyle as Lifestyle,
//     Personality: form?.personality as Personality,
//     smokingPreference: form?.smokingPreference as Smoking,
//     snoringPreference: form?.snoringPreference as Snoring,
//     cohabitantCount: form?.maxRoommates as number,
//     petPreference: form?.petPreference as Pets,
//   };
// }

// function buildPublicProfilePayload(form: typeof formData): createPublicProfilesRequest {
//   return {
//     info: form?.info as string,
//     lifestyle: form?.myLifestyle as Lifestyle,
//     personality: form?.myPersonality as Personality,
//     isSmoking: form?.mySmokingStatus as Smoking,
//     isSnoring: form?.mySnoringStatus as Snoring,
//     hasPet: form?.myPetStatus as Pets,
//   };
// }

function buildUserPreferencesPayload(form: typeof formData): createUserPreferencesRequest {
  return {
    preferredGender: form.preferredGender as Gender,
    additionalInfo: form.info || "",
    lifeStyle: form.lifestyle as Lifestyle,
    personality: form.personality as Personality,
    smokingPreference: form.smokingPreference === true,  // boolean
    snoringPreference: form.snoringPreference === true,  // boolean
    cohabitantCount: form.maxRoommates ?? 2,
    petPreference: form.petPreference === true,
  };
}

// function buildPublicProfilePayload(form: typeof formData): createPublicProfilesRequest {
//   return {
//     info: form.info || "",
//     lifestyle: form.myLifestyle as Lifestyle,
//     personality: form.myPersonality as Personality,
//     isSmoking: form.mySmokingStatus as Smoking,
//     isSnoring: form.mySnoringStatus as Snoring,
//     hasPet: form.myPetStatus as Pets,
//   };
// }

// function buildPublicProfilePayload(form: typeof formData): createPublicProfilesRequest {
//   if (!form.myLifestyle || !form.myPersonality || !form.mySmokingStatus || !form.mySnoringStatus || !form.myPetStatus) {
//     throw new Error("공개 프로필 입력이 누락되었습니다.");
//   }
//   return {
//     info: form.info || "",
//     lifestyle: form.myLifestyle,
//     personality: form.myPersonality,
//     isSmoking: form.mySmokingStatus,
//     isSnoring: form.mySnoringStatus,
//     hasPet: form.myPetStatus,
//   };
// }

// function buildPublicProfilePayload(form: typeof formData) {
//   if (!form.myLifestyle || !form.myPersonality || form.mySmokingStatus == null || form.mySnoringStatus == null || form.myPetStatus == null) {
//     throw new Error('공개 프로필 입력이 누락되었습니다.');
//   }

//   return {
//     info: form.info || '',
//     lifestyle: form.myLifestyle,        // enum OK
//     personality: form.myPersonality,    // enum OK
//     isSmoking: form.mySmokingStatus === Smoking.Smoke,
//     isSnoring: form.mySnoringStatus === Snoring.Snore,
//     hasPet:    form.myPetStatus === Pets.Have,
//   };
// }

// buildPublicProfilePayload만 교체
// function buildPublicProfilePayload(form: typeof formData) {
//   if (
//     !form.myLifestyle ||
//     !form.myPersonality ||
//     form.mySmokingStatus == null ||
//     form.mySnoringStatus == null ||
//     form.myPetStatus == null
//   ) {
//     throw new Error('공개 프로필 입력이 누락되었습니다.');
//   }

//   return {
//     info: form.info || '',
//     lifestyle: form.myLifestyle,
//     personality: form.myPersonality,
//     isSmoking: form.mySmokingStatus === Smoking.Smoke,
//     isSnoring: form.mySnoringStatus === Snoring.Snore,
//     hasPet:    form.myPetStatus === Pets.Have,
//   };
// }

function buildPublicProfilePayload(form: typeof formData): createPublicProfilesRequest {
  if (
    !form.myLifestyle ||
    !form.myPersonality ||
    form.mySmokingStatus == null ||
    form.mySnoringStatus == null ||
    form.myPetStatus == null
  ) {
    throw new Error('공개 프로필 입력이 누락되었습니다.');
  }

  return {
    info: form.info || '',
    lifestyle: form.myLifestyle as Lifestyle,           // Lifestyle enum
    personality: form.myPersonality as Personality,       // Personality enum
    isSmoking: form.mySmokingStatus as Smoking,       // Smoking enum ✅
    isSnoring: form.mySnoringStatus as Snoring,       // Snoring enum ✅
    hasPet: form.myPetStatus as Pets,              // Pets enum ✅
  };
}


// ===== [추가] 최종 저장 핸들러 =====
const handleFinishSignup = async () => {
  console.log("시작")
  try {
    // 1) 매칭 선호도 저장
    const prefPayload = buildUserPreferencesPayload(formData);
    console.log(prefPayload);
    await makeUserPreferences(prefPayload);

    // 2) 공개 프로필 저장
    const profilePayload = buildPublicProfilePayload(formData);
    console.log('public-profile payload:', profilePayload);  // 디버깅용(권장)
    await makePublicProfile(profilePayload);


    Alert.alert('완료', '설정과 프로필이 저장되었어요!');
    onSignup?.();
    onComplete?.();
  } catch (e: any) {
    Alert.alert('에러', e?.message ?? '저장 중 오류가 발생했습니다.');
  }
};

  useEffect(() => {
  return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const [uploadState, setUploadState] = useState({
    isUploading: false,
    isProcessing: false,
    error: null as string | null
  });

  const [ocrInfo, setOcrInfo] = useState<OcrVerificationResponseDto | null>(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // === 기존 ocrVerify 제거/대체: 비동기 작업 시작만 수행 (taskId 획득) ===
  const ocrVerifyStart = async (file: { uri: string; name?: string; type?: string }) => {
    try {
      const data = await startOcrVerificationMultipart(file); 
      return data.taskId;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'OCR 업로드 실패';
      throw new Error(msg);
    }
  };

  const handleFileSelect = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '사진 접근 권한을 허용해주세요.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: false,
        quality: 0.9,
        allowsEditing: false,
      });
      if (result.canceled) return;

      const asset = result.assets[0];
      const mime = asset.mimeType ?? 'image/jpeg';
      const name = asset.fileName ?? `id-${Date.now()}.jpg`;

      setFormData(prev => ({
        ...prev,
        idImageFile: asset.uri,
        idImagePreview: asset.uri,
      }));

      setUploadState({ isUploading: false, isProcessing: true, error: null }); // 로딩 표시
      await processOCR({ uri: asset.uri, name, type: mime });
    } catch (e: any) {
      Alert.alert('오류', e?.message ?? '이미지 선택 중 오류가 발생했습니다.');
    }
  };

  // === 핵심: 업로드 → taskId → 폴링 → SUCCESS 시 데이터 반영/다음 버튼 활성화 ===
  const processOCR = async (file: { uri: string; name?: string; type?: string }) => {
  setUploadState({ isUploading: false, isProcessing: true, error: null });

  const startedAt = Date.now();

  try {
    console.log('[OCR] 업로드 시작');
    const taskId = await ocrVerifyStart(file);
    if (!taskId) throw new Error('작업 ID를 받지 못했습니다.');
    console.log('[OCR] 업로드 성공, taskId =', taskId);

    const POLL_MS = 3000;
    const MAX_ATTEMPTS = 80;
    let attempts = 0;

    const pollOnce = async () => {
      attempts += 1;
      const sinceStartSec = ((Date.now() - startedAt) / 1000).toFixed(1);
      console.log(`[OCR] 폴링 시도 #${attempts} (${sinceStartSec}s 경과, 간격=${POLL_MS}ms), taskId=${taskId}`);

      const t0 = Date.now();
      try {
        const t = await getOcrVerificationStatus(taskId);
        const dt = Date.now() - t0;

        console.log(`[OCR] 폴링 응답 #${attempts} (${dt}ms) status=${t.status}`,
          t.status === 'FAILED' ? `, error="${t.errorMessage ?? ''}"` : '',
          t.status === 'SUCCESS' ? `, resultKeys=${Object.keys(t.result ?? {})}` : ''
        );

        if (t.status === 'SUCCESS') {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
          setOcrSuccess(Boolean(t.result?.isCompleted));
          setOcrInfo(t?.result);
          console.log('[OCR] SUCCESS → 폴링 중단, onOcrSuccess 호출');
          await onOcrSuccess(t);
        } else if (t.status === 'FAILED') {
          if (pollTimerRef.current) clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
          console.log('[OCR] FAILED → 폴링 중단');
          throw new Error(t.errorMessage ?? 'OCR 인증에 실패했습니다.');
        } else {
          if (attempts >= MAX_ATTEMPTS) {
            if (pollTimerRef.current) clearInterval(pollTimerRef.current);
            pollTimerRef.current = null;
            console.log('[OCR] MAX_ATTEMPTS 초과 → 폴링 중단');
            throw new Error('처리가 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
          }
        }
      } catch (err: any) {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
        console.log(`[OCR] 폴링 오류 #${attempts}:`, err?.message ?? err);
        throw err;
      }
    };

    pollTimerRef.current = setInterval(pollOnce, POLL_MS);
    console.log('[OCR] 폴링 시작(setInterval)');
    await pollOnce(); // 즉시 1회 실행 (여기서 PENDING이면 계속 돌아야 함)
  } catch (err: any) {
    setUploadState({
      isUploading: false,
      isProcessing: false,
      error: err?.message ?? '인증 처리 중 오류가 발생했습니다.',
    });
    console.log('[OCR] 처리 실패:', err?.message ?? err);
  }
};


  // SUCCESS 시 데이터 반영 + 서버 인증 상태 체크
  const onOcrSuccess = async (task: OcrTask) => {
    const r = task.result ?? null;

    setFormData(prev => ({
      ...prev,
      idVerified: true,
      extractedName: r?.name || '',
      extractedBirthDate: r?.birthDate || '',
      extractedGender: r?.gender === 'Male' || r?.gender === '남자'
        ? Gender.Male
        : r?.gender === 'Female' || r?.gender === '여자'
        ? Gender.Female
        : r?.gender === 'None' || r?.gender === '상관없음'
        ? Gender.None
        : null
    }));

    // 서버 최종 인증 상태 조회 (실패해도 치명적 X)
    try {
      const s = await getOcrStatus();
      // 필요하면 s.ocrVerified를 어디 저장/표시
    } catch {}

    setUploadState({ isUploading: false, isProcessing: false, error: null });
  };

  const resetUpload = () => {
    setFormData({
      ...formData,
      idImageFile: null,
      idImagePreview: null,
      idVerified: false,
      extractedName: '',
      extractedBirthDate: '',
      extractedGender: Gender.Female,
    });
    setUploadState({
      isUploading: false,
      isProcessing: false,
      error: null
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={{ gap: 24 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>신분증 인증</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
                안전한 서비스 이용을 위해 신분증 인증이 필요합니다
              </Text>
            </View>

            <Card style={{ borderWidth: 2, borderStyle: 'dashed', borderColor: '#F7B32B80' }}>
              <CardContent style={{ padding: 32, alignItems: 'center' }}>
                {formData?.idVerified ? (
                  <View style={{ gap: 16 }}>
                    {/* 업로드된 이미지를 주민등록증 비율로 표시 */}
                    {formData.idImagePreview && (
                      <View style={{ marginTop: 16 }}>
                        <View style={{
                          width: '90%',
                          maxWidth: 300,
                          alignSelf: 'center',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          borderRadius: 8,
                          overflow: 'hidden',
                          backgroundColor: '#f9fafb',
                          aspectRatio: 85.6 / 54 // 주민등록증 비율 (가로 85.6㎜ × 세로 54㎜)
                        }}>
                          <Image 
                            source={{ uri: formData?.idImagePreview }} 
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                    )}
                    
                    {/* OCR 추출 정보 */}
                    {formData.extractedName && (
                      <View style={{ 
                        backgroundColor: '#f0fdf4', 
                        borderWidth: 1, 
                        borderColor: '#bbf7d0', 
                        borderRadius: 8, 
                        padding: 16,
                        alignItems: 'flex-start'
                      }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#166534', marginBottom: 12 }}>추출된 정보</Text>
                        <View style={{ gap: 8, width: '100%' }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#15803d' }}>이름</Text>
                            <Text style={{ fontWeight: '500', color: '#14532d' }}>{formData?.extractedName}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#15803d' }}>생년월일</Text>
                            <Text style={{ fontWeight: '500', color: '#14532d' }}>{formData?.extractedBirthDate}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#15803d' }}>성별</Text>
                            <Text style={{ fontWeight: '500', color: '#14532d' }}>{ocrInfo?.gender}</Text>
                          </View>
                        </View>
                      </View>
                    )}

                    {/* 인증 완료 메시지를 추출된 정보 아래로 이동 */}
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontWeight: '500', color: '#15803d' }}>신분증 인증 완료</Text>
                      <Text style={{ fontSize: 14, color: '#16a34a', marginTop: 4 }}>신분증이 성공적으로 인증되었습니다</Text>
                    </View>
                    
                    <TouchableOpacity 
                      onPress={resetUpload}
                      style={{
                        borderWidth: 1,
                        borderColor: '#d1d5db',
                        borderRadius: 8,
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        alignItems: 'center',
                        marginTop: 8
                      }}
                    >
                      <Text style={{ fontSize: 14 }}>다시 업로드</Text>
                    </TouchableOpacity>

                    <View style={{ 
                      backgroundColor: '#eff6ff', 
                      borderWidth: 1, 
                      borderColor: '#bfdbfe', 
                      borderRadius: 8, 
                      padding: 12,
                      marginTop: 16
                    }}>
                      <Text style={{ fontSize: 12, color: '#2563eb' }}>
                        <Text style={{ fontWeight: 'bold' }}>개인정보 보호:</Text> 추출된 정보는 본인 확인 용도로만 사용되며, 
                        주민등록번호 뒷자리는 보안을 위해 마스킹 처리됩니다.
                      </Text>
                    </View>
                  </View>
                ) : uploadState.isProcessing ? (
                  <View style={{ gap: 16 }}>
                    <View style={{ width: 64, height: 64, alignSelf: 'center' }}>
                      <View style={{
                        width: 64,
                        height: 64,
                        borderWidth: 4,
                        borderColor: '#bfdbfe',
                        borderTopColor: '#2563eb',
                        borderRadius: 32,
                        alignSelf: 'center'
                      }} />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontWeight: '500', color: '#1d4ed8' }}>OCR 인증 중...</Text>
                      <Text style={{ fontSize: 14, color: '#2563eb', marginTop: 4 }}>신분증 정보를 확인하고 있습니다</Text>
                    </View>
                    {formData?.idImagePreview && (
                      <View style={{ marginTop: 16 }}>
                        <View style={{
                          width: 128,
                          alignSelf: 'center',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          borderRadius: 8,
                          overflow: 'hidden',
                          backgroundColor: '#f9fafb',
                          opacity: 0.5,
                          aspectRatio: 85.6 / 54 // 주민등록증 비율 (가로 85.6㎜ × 세로 54㎜)
                        }}>
                          <Image 
                            source={{ uri: formData.idImagePreview }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={{ gap: 16 }}>
                    {formData?.idImagePreview ? (
                      <View style={{ gap: 16 }}>
                        <View style={{
                          width: 128,
                          alignSelf: 'center',
                          borderWidth: 1,
                          borderColor: '#e5e7eb',
                          borderRadius: 8,
                          overflow: 'hidden',
                          backgroundColor: '#f9fafb',
                          aspectRatio: 85.6 / 54 // 주민등록증 비율 (가로 85.6㎜ × 세로 54㎜)
                        }}>
                          <Image 
                            source={{ uri: formData.idImagePreview }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                          />
                        </View>
                        {uploadState.error && (
                          <View style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 8, padding: 12 }}>
                            <Text style={{ fontSize: 14, color: '#dc2626' }}>{uploadState.error}</Text>
                          </View>
                        )}
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity 
                            onPress={resetUpload}
                            style={{
                              flex: 1,
                              borderWidth: 1,
                              borderColor: '#d1d5db',
                              borderRadius: 8,
                              paddingVertical: 8,
                              paddingHorizontal: 16,
                              alignItems: 'center'
                            }}
                          >
                            <Text style={{ fontSize: 14 }}>다시 선택</Text>
                          </TouchableOpacity>
                          <TouchableOpacity 
                            onPress={() => processOCR({ uri: formData.idImageFile!, name: `retry-${Date.now()}.jpg`, type: 'image/jpeg' })}
                              disabled={uploadState.isProcessing}
                            style={{
                              flex: 1,
                              backgroundColor: '#F7B32B',
                              borderRadius: 8,
                              paddingVertical: 8,
                              paddingHorizontal: 16,
                              alignItems: 'center'
                            }}
                          >
                            <Text style={{ fontSize: 14, color: 'white' }}>다시 인증</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={{ alignItems: 'center', gap: 16 }}>
                        <Ionicons name="camera" size={64} color="#9ca3af" />
                        <View style={{ alignItems: 'center' }}>
                          <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>신분증 사진 업로드</Text>
                          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 16 }}>
                            주민등록증 또는 운전면허증을 업로드해주세요{'\n'}OCR로 자동 인증됩니다
                          </Text>
                        </View>
                        <View style={{ gap: 12, width: '100%' }}>
                          <TouchableOpacity 
                            onPress={handleFileSelect}
                            disabled={uploadState.isUploading}
                            style={{
                              width: '100%',
                              borderWidth: 1,
                              borderColor: '#d1d5db',
                              borderRadius: 8,
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              gap: 8
                            }}
                          >
                            <Text style={{ fontSize: 16 }}>📤</Text>
                            <Text style={{ fontSize: 16 }}>{uploadState.isUploading ? '업로드 중...' : '신분증 사진 선택'}</Text>
                          </TouchableOpacity>
                          <Text style={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
                            JPG, PNG 파일 (최대 5MB){'\n'}개인정보는 안전하게 암호화되어 저장됩니다
                          </Text>
                        </View>
                      </View>
                    )}
                    
                    {uploadState.error && !formData?.idImagePreview && (
                      <View style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 8, padding: 12, marginTop: 16 }}>
                        <Text style={{ fontSize: 14, color: '#dc2626' }}>{uploadState.error}</Text>
                      </View>
                    )}
                  </View>
                )}
              </CardContent>
            </Card>

            <TouchableOpacity 
              onPress={nextStep}
              disabled={!formData?.idVerified}
              style={{
                width: '100%',
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: formData?.idVerified ? '#E6940C' : 'rgba(247, 179, 43, 0.5)'
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>다음</Text>
            </TouchableOpacity>
          </View>
        );

      case 2:
        return (
          <View style={{ gap: 24 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>매칭 선호도 설정</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
                원하는 룸메이트 조건을 설정해주세요
              </Text>
            </View>

            <View style={{ gap: 24 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>선호 성별</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { value: Gender.Male, label: '남자' },
                    { value: Gender.Female, label: '여자' },
                    { value: Gender.None, label: '상관없음' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, preferredGender: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData?.preferredGender === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData?.preferredGender === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData?.preferredGender === option.value ? 'white' : '#374151'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>생활 패턴</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { value: Lifestyle.Morning, label: '아침형' },
                    { value: Lifestyle.Evening, label: '저녁형' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, lifestyle: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData?.lifestyle === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData?.lifestyle === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData?.lifestyle === option.value ? 'white' : '#374151'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>성격 유형</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { value: Personality.Introvert, label: '집순이' },
                    { value: Personality.Extrovert, label: '밖순이' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, personality: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData?.personality === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData?.personality === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData?.personality === option.value ? 'white' : '#374151'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                onPress={prevStep}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontSize: 16 }}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={nextStep}
                disabled={!formData?.preferredGender || !formData?.lifestyle || !formData?.personality}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: formData?.preferredGender && formData.lifestyle && formData.personality
                    ? '#E6940C' 
                    : 'rgba(247, 179, 43, 0.5)'
                }}
              >
                <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>다음</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={{ gap: 24 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>상세 선호도</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
                함께 살 때 중요한 조건들을 설정해주세요
              </Text>
            </View>

            <View style={{ gap: 24 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>흡연 여부</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { value: true, label: '허용' },
                    { value: false, label: '불가' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      onPress={() => setFormData({ ...formData, smokingPreference: option.value })}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData?.smokingPreference === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData?.smokingPreference === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData?.smokingPreference === option.value ? 'white' : '#374151'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}

                </View>
              </View>

              {/* <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>코골이</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { value: Snoring.None, label: '상관없음' },
                    { value: Snoring.Impossible, label: '코골이 불가' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, snoringPreference: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData?.snoringPreference === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData?.snoringPreference === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData?.snoringPreference === option.value ? 'white' : '#374151'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
                  동거 가능 인원 수 (본인 포함): {formData?.maxRoommates}명
                </Text>

                <Slider
                  value={formData?.maxRoommates as number}
                  onValueChange={(v) =>
                    setFormData({ ...formData, maxRoommates: Math.round(v as number) })
                  }
                  minimumValue={2}
                  maximumValue={10}
                  step={1}
                  minimumTrackTintColor="#E6940C"
                  maximumTrackTintColor="#e5e7eb"
                  thumbTintColor="#E6940C"
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>2명</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>10명</Text>
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>반려동물</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { value: Pets.Possible, label: '가능' },
                    { value: Pets.Impossible, label: '불가능' },
                   //{ value: 'any', label: '상관없음' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, petPreference: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData?.petPreference === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData?.petPreference === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData?.petPreference === option.value ? 'white' : '#374151'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View> */}
              {/* 코골이 */}
<View>
  <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>코골이</Text>
  <View style={{ flexDirection: 'row', gap: 8 }}>
    {[
      { value: true, label: '상관없음' },   // true = 허용
      { value: false, label: '코골이 불가' } // false = 불가
    ].map(option => {
      const selected = formData.snoringPreference === option.value;
      return (
        <TouchableOpacity
          key={String(option.value)}
          onPress={() => setFormData({ ...formData, snoringPreference: option.value })}
          style={{
            flex: 1,
            padding: 12,
            borderWidth: 1,
            borderColor: selected ? '#F7B32B' : '#d1d5db',
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor: selected ? '#F7B32B' : 'transparent',
          }}
        >
          <Text style={{
            fontSize: 14,
            color: selected ? 'white' : '#374151'
          }}>
            {option.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
</View>

{/* 동거 가능 인원 수 */}
<View>
  <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
    동거 가능 인원 수 (본인 포함): {formData.maxRoommates ?? 2}명
  </Text>

  <Slider
    value={formData.maxRoommates ?? 2}
    onValueChange={v => setFormData({ ...formData, maxRoommates: Math.round(v as number) })}
    minimumValue={2}
    maximumValue={10}
    step={1}
    minimumTrackTintColor="#E6940C"
    maximumTrackTintColor="#e5e7eb"
    thumbTintColor="#E6940C"
  />

  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text style={{ fontSize: 12, color: '#6b7280' }}>2명</Text>
    <Text style={{ fontSize: 12, color: '#6b7280' }}>10명</Text>
  </View>
</View>

{/* 반려동물 */}
<View>
  <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>반려동물</Text>
  <View style={{ flexDirection: 'row', gap: 8 }}>
    {[
      { value: true, label: '가능' },     // true = 허용
      { value: false, label: '불가능' }   // false = 불가
    ].map(option => {
      const selected = formData.petPreference === option.value;
      return (
        <TouchableOpacity
          key={String(option.value)}
          onPress={() => setFormData({ ...formData, petPreference: option.value })}
          style={{
            flex: 1,
            padding: 12,
            borderWidth: 1,
            borderColor: selected ? '#F7B32B' : '#d1d5db',
            borderRadius: 8,
            alignItems: 'center',
            backgroundColor: selected ? '#F7B32B' : 'transparent',
          }}
        >
          <Text style={{
            fontSize: 14,
            color: selected ? 'white' : '#374151'
          }}>
            {option.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
</View>

            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                onPress={prevStep}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontSize: 16 }}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={nextStep}
                disabled={!formData?.smokingPreference || !formData.snoringPreference || !formData.petPreference}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: formData?.smokingPreference && formData?.snoringPreference && formData?.petPreference
                    ? '#E6940C' 
                    : 'rgba(247, 179, 43, 0.5)'
                }}
              >
                <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>다음</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 4:
  return (
    <View style={{ gap: 24 }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>공개 프로필 작성</Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
          다른 사용자에게 보여질 프로필을 작성해주세요
        </Text>
      </View>

      {/* 기본 정보 (OCR 자동 입력) */}
      <SelectSection title="기본 정보 (자동 입력됨)">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flex: 1, minWidth: '45%' }}>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>이름</Text>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
              {ocrInfo?.name || formData?.extractedName}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: '45%' }}>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>성별</Text>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
              {ocrInfo?.gender}
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: '45%' }}>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>나이</Text>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
              {ocrInfo?.birthDate ? formData?.extractedBirthDate : '희주'}
            </Text>
          </View>
        </View>
      </SelectSection>

      {/* 공개 프로필 입력 섹션 */}
      <SelectSection title="공개 프로필 입력">
        <SelectBox
          label="생활 패턴"
          placeholder="선택해주세요"
          value={formData?.myLifestyle as Lifestyle}
          open={openLifestyle}
          setOpen={setOpenLifestyle}
          options={lifestyleOptions}
          onSelect={(v) => setFormData({ ...formData, myLifestyle: v })}
        />
        <SelectBox
          label="성격 유형"
          placeholder="선택해주세요"
          value={formData?.myPersonality as Personality}
          open={openPersonality}
          setOpen={setOpenPersonality}
          options={personalityOptions}
          onSelect={(v) => setFormData({ ...formData, myPersonality: v })}
        />
        <SelectBox
          label="흡연 여부"
          placeholder="선택해주세요"
          value={formData?.mySmokingStatus as Smoking}
          open={openSmoking}
          setOpen={setOpenSmoking}
          options={smokingOptions}
          onSelect={(v) => setFormData(prev => ({ ...prev, mySmokingStatus: v }))}

        />
        <SelectBox
          label="코골이"
          placeholder="선택해주세요"
          value={formData?.mySnoringStatus as Snoring}
          open={openSnoring}
          setOpen={setOpenSnoring}
          options={snoringOptions}
          onSelect={(v) => setFormData({...formData, mySnoringStatus: v})}

        />
        <SelectBox
          label="반려동물"
          placeholder="선택해주세요"
          value={formData?.myPetStatus as Pets}
          open={openPets}
          setOpen={setOpenPets}
          options={petOptions}
          onSelect={(v) => setFormData({ ...formData, myPetStatus: v })}
        />

        {/* 추가 내용 */}
        <View>
          <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>추가 내용 작성</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="자신을 소개하는 글을 자유롭게 작성해주세요"
            value={formData?.info as string}
            onChangeText={(value) => setFormData({ ...formData, info: value })}
            style={{
              width: '100%',
              padding: 12,
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 8,
              fontSize: 16,
              textAlignVertical: 'top',
              minHeight: 100,
            }}
          />
        </View>
      </SelectSection>

      {/* 하단 버튼 */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity
          onPress={prevStep}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 8,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16 }}>이전</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={nextStep}
          style={{
            flex: 1,
            borderRadius: 8,
            paddingVertical: 16,
            alignItems: 'center',
            backgroundColor: '#E6940C',
          }}
        >
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>다음</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={nextStep}
          disabled={
            !formData.myLifestyle ||
            !formData.myPersonality ||
            !formData.mySmokingStatus ||
            !formData.mySnoringStatus ||
            !formData.myPetStatus
          }
          style={{
            flex: 1,
            borderRadius: 8,
            paddingVertical: 16,
            alignItems: 'center',
            backgroundColor:
              formData.myLifestyle &&
              formData.myPersonality &&
              formData.mySmokingStatus &&
              formData.mySnoringStatus &&
              formData.myPetStatus
                ? '#E6940C'
                : 'rgba(247, 179, 43, 0.5)',
          }}
        >
          <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>다음</Text>
        </TouchableOpacity>

      </View>
    </View>
  );


      case 5:
        return (
          <View style={{ gap: 24 }}>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="checkmark-circle" size={80} color="#10b981" style={{ marginBottom: 16 }} />
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>회원가입 완료!</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
                CoBee에 오신 것을 환영합니다{'\n'}완벽한 룸메이트를 찾아보세요
              </Text>
            </View>

            <View style={{ backgroundColor: '#f9fafb', padding: 16, borderRadius: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>설정한 정보 요약</Text>
              <View style={{ gap: 8 }}>
                {formData?.extractedName && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#6b7280' }}>이름</Text>
                    <Text>{formData?.extractedName}</Text>
                  </View>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#6b7280' }}>선호 성별</Text>
                  <Text>{
                    formData?.preferredGender ===Gender.Male ? '남성' :
                    formData?.preferredGender ===Gender.Female ? '여성' : '상관없음'
                  }</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#6b7280' }}>선호 나이</Text>
                  <Text>{formData?.ageMin}세 - {formData?.ageMax}세</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#6b7280' }}>동거 인원</Text>
                  <Text>최대 {formData?.maxRoommates}명</Text>
                </View>
                {formData?.extractedGender && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#6b7280' }}>인증 성별</Text>
                    <Text>{formData.extractedGender}</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => {
                
                handleFinishSignup();
              }}
              style={{
                width: '100%',
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: '#E6940C'
              }}
            >
              <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>CoBee 시작하기</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingTop: 50
      }}>
        <TouchableOpacity onPress={step === 1 ? onBack : prevStep}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>
          {step === 5 ? '회원가입 완료' : '회원가입'}
        </Text>
        <View style={{ width: 24, height: 24 }} />
      </View>

      <ScrollView 
      style={{ flex: 1, padding: 24 }}
      contentContainerStyle={{ paddingBottom: 48 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'} 
      >
        {step < 5 && (
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: i <= step ? '#E6940C' : '#e5e7eb'
                  }}
                >
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: i <= step ? 'white' : '#6b7280'
                  }}>
                    {i}
                  </Text>
                </View>
              ))}
            </View>
            <View style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: 3, height: 6 }}>
              <View
                style={{ 
                  height: 6,
                  borderRadius: 3,
                  width: `${(step / 5) * 100}%`,
                  backgroundColor: '#E6940C'
                }}
              />
            </View>
          </View>
        )}

        {renderStep()}
      </ScrollView>
    </View>
  );
  
}

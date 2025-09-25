// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { getAccessToken } from '@/api/tokenStorage';
// import { Ionicons } from '@expo/vector-icons';
// import { api } from '@/api/api';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Avatar, AvatarFallback } from './ui/avatar';
// import { Gender, Lifestyle, Personality, Pets, Smoking, Snoring, SocialType } from '@/types/enums';

// interface PublicProfileViewScreenProps {
//   onBack?: () => void;
//   onEdit?: () => void;
//   userId?: string;
//   onNavigateToChat?: () => void;
// }

// export default function PublicProfileViewScreen({ onBack, onEdit, userId, onNavigateToChat }: PublicProfileViewScreenProps) {
// const [publicProfile, setPublicProfile] = useState<profile | null>(null);
// const [ocr, setOcr] = useState<verification | null>(null);
// const [userInfo, setUserInfo] = useState<userInfo | null>(null);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   let cancelled = false;

//   const fetchMyInfo = async () => {
//     try {
//       const res = await api.get('/auth'); 
//       if (!cancelled) setUserInfo(res.data?.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   fetchMyInfo();          

//   return () => {        
//     cancelled = true;
//   };
//   }, []); 


// useEffect(() => {
//   let cancelled = false;
//   const load = async () => {
//     try {
//       setLoading(true);
//       myPublicProfile();
//       const res1 = await api.get('/ocr/status');
//       setOcr(res1.data);
//       if (cancelled) return;
//       console.log(res1.data);
//     } finally {
//       if (!cancelled) setLoading(false);
//     }
//   };
//   load();
//   return () => { cancelled = true; };
// }, []);

// // ⬇️ 여기서 한 번만 가드(디자인 유지하고 싶으면 기존 헤더/컨테이너 감싼 채로 스피너나 "불러오는 중..." 넣어도 ok)
// if (loading || !publicProfile || !ocr) {
//   return <View style={{flex:1, backgroundColor:'red'}}>{/* 로딩/스켈레톤 */}</View>;
// }

// function getAge(birthdate: string): number {
//   const birthYear = parseInt(birthdate.substring(0, 4), 10);
//   const currentYear = new Date().getFullYear();
//   return currentYear - birthYear + 1;
// }
// const ageText = userInfo?.birthDate ? `${getAge(userInfo.birthDate)}세` : '';

//   interface profile {
//     userId : number,    
//     name : string, 
//     gender : Gender,
//     profileImg : string,
//     info : string, 
//     personality : Personality,
//     lifestyle : Lifestyle,
//     smoking : Smoking,
//     hasPet : Pets,
//     snoring : Snoring
//   }

//   interface verification {
//     ocrVerified : boolean;
//   }
//   interface userInfo {
//       id : number;
//       name : string;
//       email : string;
//       birthDate : string | null;
//       gender : Gender;
//       socialType : SocialType;
//       isCompleted : Boolean;
//       ocrValidation : Boolean;
//       isHost : Boolean;
//   };

//   const myPublicProfile = async() => {
//     const res = await api.get(`/public-profiles`, {
//       headers : {
//         Authorization: `Bearer ${getAccessToken}`
//       }
//     });
//     setPublicProfile(res.data.data);
//   }
//   const tGender = (g?: Gender) =>
//   g === Gender.Male ? '남성' :
//   g === Gender.Female ? '여성' :
//   '상관없음';

// const tLifestyle = (v?: Lifestyle) =>
//   v === Lifestyle.Morning ? '아침형' :
//   v === Lifestyle.Evening ? '저녁형' :
//   '상관없음'; // Lifestyle.Evening = 'NIGHT'임에 주의

// const tPersonality = (v?: Personality) =>
//   v === Personality.Introvert ? '집순이' :
//   v === Personality.Extrovert ? '밖순이' :
//   '상관없음';

// const tSmoking = (v?: Smoking) =>
//   v === Smoking.None ? '흡연' :
//   v === Smoking.Impossible ? '비흡연' : '상관없음'

// const tSnoring = (v?: Snoring) =>
//   v === Snoring.None ? '코골이 있음' :
//   v === Snoring.Impossible ? '코골이 없음' :
//   '상관없음';

// const tPets = (v?: Pets) =>
//   v === Pets.Possible ? '있음' :
//   v === Pets.None ? '없음' :
//   v === Pets.Impossible ? '불가능' :
//   '상관없음';


//   type LifestyleKey = 'lifestyle' | 'personality' | 'smoking' | 'hasPet' | 'snoring';



// // type LifestyleKey = 'lifestyle' | 'personality' | 'smoking' | 'hasPet' | 'snoring';


// // // ===== 아이콘 선택(키 기준) =====
// const getLifestyleIcon = (key: LifestyleKey) => {
//   switch (key) {
//     case 'lifestyle':   return <Ionicons name="sunny" size={16} color="#F59E0B" />;
//     case 'personality': return <Ionicons name="home" size={16} color="#6b7280" />;
//     case 'smoking':     return <Ionicons name="ban" size={16} color="#EF4444" />;
//     case 'hasPet':      return <Ionicons name="paw" size={16} color="#8B5CF6" />;
//     case 'snoring':     return <Ionicons name="volume-mute" size={16} color="#6b7280" />;
//   }
// };

// const getLifestyleLabel = (key: LifestyleKey) => {
//   switch (key) {
//     case 'lifestyle':   return '생활패턴';
//     case 'personality': return '성격';
//     case 'smoking':     return '흡연';
//     case 'hasPet':      return '반려동물';
//     case 'snoring':     return '코골이';
//   }
// };

// const lifestyleRows: { key: LifestyleKey; label: string; value: string }[] = [
//   { key: 'lifestyle',   label: getLifestyleLabel('lifestyle'),   value: tLifestyle(publicProfile.lifestyle) },
//   { key: 'personality', label: getLifestyleLabel('personality'), value: tPersonality(publicProfile.personality) },
//   { key: 'smoking',     label: getLifestyleLabel('smoking'),     value: tSmoking(publicProfile.smoking) },
//   { key: 'hasPet',      label: getLifestyleLabel('hasPet'),      value: tPets(publicProfile.hasPet) },
//   { key: 'snoring',     label: getLifestyleLabel('snoring'),     value: tSnoring(publicProfile.snoring) },
// ];



//   return (
//     <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
//       {/* 헤더 */}
//       <View style={{
//         backgroundColor: '#ffffff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e5e7eb',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         paddingTop: 50,
//       }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//           <TouchableOpacity onPress={onBack}>
//             <Ionicons name="arrow-back" size={24} color="#000000" />
//           </TouchableOpacity>
//           <Text style={{ fontSize: 18, fontWeight: '600' }}>공개프로필</Text>
//           <TouchableOpacity onPress={onEdit}>
//             <Ionicons name="pencil" size={16} color="#6b7280" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView style={{ padding: 16 }} contentContainerStyle={{ gap: 24 }}>
//         {/* 기본 정보 */}
//         <Card>
//           <CardContent style={{ padding: 24 }}>
//             <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
//               <Avatar style={{ width: 80, height: 80 }}>
//                 <AvatarFallback style={{ fontSize: 20 }}>{publicProfile.name}</AvatarFallback>
//               </Avatar>
//               <View style={{ flex: 1 }}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//                   <Text style={{ fontSize: 20, fontWeight: '600' }}>{publicProfile.name}</Text>
//                   <View style={{
//                     backgroundColor: '#22c55e',
//                     paddingHorizontal: 8,
//                     paddingVertical: 4,
//                     borderRadius: 12,
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     gap: 4,
//                   }}>
//                     <Text style={{ fontSize: 12, color: '#ffffff' }}>✓</Text>
//                     <Text style={{ fontSize: 12, color: '#ffffff' }}>인증완료</Text>
//                   </View>
//                 </View>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
//                   <Text style={{ fontSize: 14, color: '#6b7280' }}>{ageText}</Text>
//                   <Text style={{ fontSize: 14, color: '#6b7280' }}>•</Text>
//                   <Text style={{ fontSize: 14, color: '#6b7280' }}>{publicProfile.gender}</Text>
//                 </View>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//                   <Text style={{ fontSize: 14, color: '#6b7280' }}>{publicProfile.name}</Text>
//                 </View>
//               </View>
//             </View>
//           </CardContent>
//         </Card>

//         {/* 자기소개 */}
//         <Card>
//           <CardHeader>
//             <CardTitle style={{ fontSize: 16 }}>자기소개</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151' }}>
//               {publicProfile.info}
//             </Text>
//           </CardContent>
//         </Card>

//         {/* 생활 스타일 */}
//         <Card>
//   <CardHeader>
//     <CardTitle style={{ fontSize: 16 }}>생활 스타일</CardTitle>
//   </CardHeader>
//   <CardContent>
//     <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
//       {lifestyleRows.map(({ key, label, value }) => (
//         <View
//           key={`life-${key}`}   // ✅ 안정적인 고유 key
//           style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: '45%' }}
//         >
//           <View style={{ width: 16, height: 16 }}>
//             {getLifestyleIcon(key)}
//           </View>
//           <View>
//             <Text style={{ fontSize: 12, color: '#6b7280' }}>{label}</Text>
//             <Text style={{ fontSize: 14, fontWeight: '500' }}>{value}</Text>
//           </View>
//         </View>
//       ))}
//     </View>
//   </CardContent>
// </Card>


//         {/* 인증 현황 */}
//         <Card>
//           <CardHeader>
//             <CardTitle style={{ fontSize: 16 }}>인증 현황</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <View style={{ gap: 12 }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <Text style={{ fontSize: 14 }}>신분증 인증</Text>
//                 <View style={{
//                   backgroundColor: ocr.ocrVerified ? '#22c55e' : '#f3f4f6',
//                   paddingHorizontal: 8,
//                   paddingVertical: 4,
//                   borderRadius: 12,
//                 }}>
//                   <Text style={{
//                     fontSize: 12,
//                     color: ocr.ocrVerified? '#ffffff' : '#6b7280'
//                   }}>
//                     {userInfo?.ocrValidation ? '완료' : '미완료'}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </CardContent>
//         </Card>

//         {/* 수정 버튼 */}
//         <View style={{ paddingBottom: 24 }}>
//           <TouchableOpacity 
//             onPress={onEdit}
//             style={{
//               width: '100%',
//               paddingVertical: 16,
//               borderRadius: 8,
//               backgroundColor: '#F7B32B',
//               alignItems: 'center',
//               justifyContent: 'center',
//               flexDirection: 'row',
//               gap: 8,
//             }}
//           >
//             <Ionicons name="pencil" size={16} color="#ffffff" />
//             <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
//               수정하기
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { getAccessToken } from '@/api/tokenStorage';
// import { Ionicons } from '@expo/vector-icons';
// import { api } from '@/api/api';
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Avatar, AvatarFallback } from './ui/avatar';
// import { Gender, Lifestyle, Personality, Pets, Smoking, Snoring, SocialType } from '@/types/enums';

// interface PublicProfileViewScreenProps {
//   onBack?: () => void;
//   onEdit?: () => void;
//   userId?: string;
//   onNavigateToChat?: () => void;
// }

// export default function PublicProfileViewScreen({ onBack, onEdit, userId, onNavigateToChat}: PublicProfileViewScreenProps) {
// const [publicProfile, setPublicProfile] = useState<profile | null>(null);
// const [ocr, setOcr] = useState<verification | null>(null);
// const [userInfo, setUserInfo] = useState<userInfo | null>(null);
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   let cancelled = false;

//   const fetchMyInfo = async () => {
//     try {
//       const res = await api.get('/auth'); 
//       if (!cancelled) setUserInfo(res.data?.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   fetchMyInfo();          

//   return () => {        
//     cancelled = true;
//   };
//   }, []); 


// const getPublicProfile = async() => {
//   const token = await getAccessToken().catch(() => null);  
//   const res = await api.get('/public-profiles', {
//     headers : token ? { Authorization: `Bearer ${token}` } : {}
//   });
//   setPublicProfile(res.data.data);
// }
// useEffect(() => {
//   let cancelled = false;
//   const load = async () => {
//     try {
//       setLoading(true);
//       getPublicProfile();
//       // const [p, o] = await Promise.all([
//       //   api.get('/public-profiles'),
//       //   api.get('/ocr/status'),
//       // ]);
//       // if (cancelled) return;
//       // console.log(p.data);
//       // console.log(o.data);
//       // setPublicProfile(p.data?.data ?? p.data ?? null);
//       // setOcr(o.data?.data ?? o.data ?? null);
//     } finally {
//       if (!cancelled) setLoading(false);
//     }
//   };
//   load();
//   return () => { cancelled = true; };
// }, []);

// // ⬇️ 여기서 한 번만 가드(디자인 유지하고 싶으면 기존 헤더/컨테이너 감싼 채로 스피너나 "불러오는 중..." 넣어도 ok)
// if (loading || !publicProfile || !ocr) {
//   return <View style={{flex:1, backgroundColor:'red'}}>{/* 로딩/스켈레톤 */}</View>;
// }

// function getAge(birthdate: string): number {
//   const birthYear = parseInt(birthdate.substring(0, 4), 10);
//   const currentYear = new Date().getFullYear();
//   return currentYear - birthYear + 1;
// }
// const ageText = userInfo?.birthDate ? `${getAge(userInfo.birthDate)}세` : '';

//   interface profile {
//     userId: number,
//     name: number,
//     gender : string,
//     info: string,
//     mLifestyle: Lifestyle,
//     mPersonality: Personality,
//     mSmoking: Smoking,
//     mSnoring: Snoring,
//     mPet: Pets
//   }

//   interface verification {
//     ocrVerified : Boolean;
//   }

//   interface userInfo { // api 명세에 맞게 수정
//       id : number;
//       name : string;
//       email : string;
//       birthDate : string | null;
//       gender : Gender;
//       socialType : SocialType;
//       isCompleted : Boolean;
//       ocrValidation : Boolean;
//       isHost : Boolean;
//   };


//   const tGender = (g?: string) =>
//   g === "MALE" ? '남성' :
//   g === "FEMALE" ? '여성' :
//   '상관없음';

// const tLifestyle = (v?: Lifestyle) =>
//   v === Lifestyle.Morning ? '아침형' :
//   v === Lifestyle.Evening ? '저녁형' :
//   '상관없음'; // Lifestyle.Evening = 'NIGHT'임에 주의

// const tPersonality = (v?: Personality) =>
//   v === Personality.Introvert ? '집순이' :
//   v === Personality.Extrovert ? '밖순이' :
//   '상관없음';

// const tSmoking = (v?: Smoking) =>
//   v === Smoking.None ? '흡연' :
//   v === Smoking.Impossible ? '비흡연' : '상관없음'

// const tSnoring = (v?: Snoring) =>
//   v === Snoring.None ? '코골이 있음' :
//   v === Snoring.Impossible ? '코골이 없음' :
//   '상관없음';

// const tPets = (v?: Pets) =>
//   v === Pets.Possible ? '있음' :
//   v === Pets.None ? '없음' :
//   v === Pets.Impossible ? '불가능' :
//   '상관없음';


//   type LifestyleKey = 'lifestyle' | 'personality' | 'smoking' | 'hasPet' | 'snoring';



// // type LifestyleKey = 'lifestyle' | 'personality' | 'smoking' | 'hasPet' | 'snoring';


// // // ===== 아이콘 선택(키 기준) =====
// const getLifestyleIcon = (key: LifestyleKey) => {
//   switch (key) {
//     case 'lifestyle':   return <Ionicons name="sunny" size={16} color="#F59E0B" />;
//     case 'personality': return <Ionicons name="home" size={16} color="#6b7280" />;
//     case 'smoking':     return <Ionicons name="ban" size={16} color="#EF4444" />;
//     case 'hasPet':      return <Ionicons name="paw" size={16} color="#8B5CF6" />;
//     case 'snoring':     return <Ionicons name="volume-mute" size={16} color="#6b7280" />;
//   }
// };

// const getLifestyleLabel = (key: LifestyleKey) => {
//   switch (key) {
//     case 'lifestyle':   return '생활패턴';
//     case 'personality': return '성격';
//     case 'smoking':     return '흡연';
//     case 'hasPet':      return '반려동물';
//     case 'snoring':     return '코골이';
//   }
// };

// const lifestyleRows: { key: LifestyleKey; label: string; value: string }[] = [
//   { key: 'lifestyle',   label: getLifestyleLabel('lifestyle'),   value: tLifestyle(publicProfile.mLifestyle) },
//   { key: 'personality', label: getLifestyleLabel('personality'), value: tPersonality(publicProfile.mPersonality) },
//   { key: 'smoking',     label: getLifestyleLabel('smoking'),     value: tSmoking(publicProfile.mSmoking) },
//   { key: 'hasPet',      label: getLifestyleLabel('hasPet'),      value: tPets(publicProfile.mPet) },
//   { key: 'snoring',     label: getLifestyleLabel('snoring'),     value: tSnoring(publicProfile.mSnoring) },
// ];



//   return (
//     <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
//       {/* 헤더 */}
//       <View style={{
//         backgroundColor: '#ffffff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e5e7eb',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         paddingTop: 50,
//       }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//           <TouchableOpacity onPress={onBack}>
//             <Ionicons name="arrow-back" size={24} color="#000000" />
//           </TouchableOpacity>
//           <Text style={{ fontSize: 18, fontWeight: '600' }}>공개프로필</Text>
//           <TouchableOpacity onPress={onEdit}>
//             <Ionicons name="pencil" size={16} color="#6b7280" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView style={{ padding: 16 }} contentContainerStyle={{ gap: 24 }}>
//         {/* 기본 정보 */}
//         <Card>
//           <CardContent style={{ padding: 24 }}>
//             <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
//               <Avatar style={{ width: 80, height: 80 }}>
//                 <AvatarFallback style={{ fontSize: 20 }}>{publicProfile.name}</AvatarFallback>
//               </Avatar>
//               <View style={{ flex: 1 }}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//                   <Text style={{ fontSize: 20, fontWeight: '600' }}>{publicProfile.name}</Text>
//                   <View style={{
//                     backgroundColor: '#22c55e',
//                     paddingHorizontal: 8,
//                     paddingVertical: 4,
//                     borderRadius: 12,
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     gap: 4,
//                   }}>
//                     <Text style={{ fontSize: 12, color: '#ffffff' }}>✓</Text>
//                     <Text style={{ fontSize: 12, color: '#ffffff' }}>인증완료</Text>
//                   </View>
//                 </View>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
//                   <Text style={{ fontSize: 14, color: '#6b7280' }}>{ageText}</Text>
//                   <Text style={{ fontSize: 14, color: '#6b7280' }}>•</Text>
//                   <Text style={{ fontSize: 14, color: '#6b7280' }}>{publicProfile.gender}</Text>
//                 </View>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//                   <Text style={{ fontSize: 14, color: '#6b7280' }}>{publicProfile.name}</Text>
//                 </View>
//               </View>
//             </View>
//           </CardContent>
//         </Card>

//         {/* 자기소개 */}
//         <Card>
//           <CardHeader>
//             <CardTitle style={{ fontSize: 16 }}>자기소개</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151' }}>
//               {publicProfile.info}
//             </Text>
//           </CardContent>
//         </Card>

//         {/* 생활 스타일 */}
//         <Card>
//   <CardHeader>
//     <CardTitle style={{ fontSize: 16 }}>생활 스타일</CardTitle>
//   </CardHeader>
//   <CardContent>
//     <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
//       {lifestyleRows.map(({ key, label, value }) => (
//         <View
//           key={`life-${key}`}   // ✅ 안정적인 고유 key
//           style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: '45%' }}
//         >
//           <View style={{ width: 16, height: 16 }}>
//             {getLifestyleIcon(key)}
//           </View>
//           <View>
//             <Text style={{ fontSize: 12, color: '#6b7280' }}>{label}</Text>
//             <Text style={{ fontSize: 14, fontWeight: '500' }}>{value}</Text>
//           </View>
//         </View>
//       ))}
//     </View>
//   </CardContent>
// </Card>


//         {/* 인증 현황 */}
//         <Card>
//           <CardHeader>
//             <CardTitle style={{ fontSize: 16 }}>인증 현황</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <View style={{ gap: 12 }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <Text style={{ fontSize: 14 }}>신분증 인증</Text>
//                 <View style={{
//                   backgroundColor: ocr.ocrVerified ? '#22c55e' : '#f3f4f6',
//                   paddingHorizontal: 8,
//                   paddingVertical: 4,
//                   borderRadius: 12,
//                 }}>
//                   <Text style={{
//                     fontSize: 12,
//                     color: ocr.ocrVerified? '#ffffff' : '#6b7280'
//                   }}>
//                     {userInfo?.ocrValidation ? '완료' : '미완료'}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </CardContent>
//         </Card>

//         {/* 수정 버튼 */}
//         <View style={{ paddingBottom: 24 }}>
//           <TouchableOpacity 
//             onPress={onEdit}
//             style={{
//               width: '100%',
//               paddingVertical: 16,
//               borderRadius: 8,
//               backgroundColor: '#F7B32B',
//               alignItems: 'center',
//               justifyContent: 'center',
//               flexDirection: 'row',
//               gap: 8,
//             }}
//           >
//             <Ionicons name="pencil" size={16} color="#ffffff" />
//             <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
//               수정하기
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }


import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAccessToken } from '@/api/tokenStorage';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Gender, Lifestyle, Personality, Pets, Smoking, Snoring, SocialType } from '@/types/enums';
import { authHeader } from '@/api/api';
interface PublicProfileViewScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
  userId?: string | number;
  onNavigateToChat?: () => void;
}

// 백엔드 응답에 맞는 인터페이스
interface PublicProfile {
  userId: number;
  name: string;
  gender: string;
  profileImageUrl: string;
  info: string;
  mLifestyle: Lifestyle;
  mPersonality: Personality;
  mSmoking: Smoking;
  mSnoring: Snoring;
  mPet: Pets;
}

interface UserInfo {
  id: number;
  name: string;
  email: string;
  birthDate: string | null;
  gender: Gender;
  socialType: SocialType;
  isCompleted: boolean;
  ocrValidation: boolean;
  isHost: boolean;
}

export default function PublicProfileViewScreen({ 
  onBack, 
  onEdit, 
  userId, 
  onNavigateToChat 
}: PublicProfileViewScreenProps) {
  const [publicProfile, setPublicProfile] = useState<PublicProfile | null>(null);
  const [loginUserInfo, setLoginUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  // 로그인 사용자 정보 가져오기
  useEffect(() => {
    
    let cancelled = false;

    const fetchLoginUserInfo = async () => {
      try {
        const token = await getAccessToken().catch(() => null);
        console.log('Fetching login user info...');
        const res = await api.get('/auth', {
          headers : {
            Authorization: `Bearer ${token}`, 
        }});
        console.log(res.data.data)
        if (!cancelled) {
          console.log('Login user info:', res.data?.data);
          setLoginUserInfo(res.data?.data);
        }
      } catch (error) {
        console.error('Failed to fetch login user info:', error);
        if (!cancelled) {
          setError('사용자 정보를 불러오는데 실패했습니다.');
        }
      }
    };

    fetchLoginUserInfo();
    return () => { cancelled = true; };
  }, []);

  // 공개 프로필 가져오기
  // useEffect(() => {
  //   let cancelled = false;

  //   const fetchPublicProfile = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
        
  //       console.log('Fetching public profile for userId:', loginUserInfo?.id);
  //       console.log('Login user ID:', loginUserInfo?.id);

  //       const token = await getAccessToken().catch(() => null);
        
  //       let res;
  //       // userId가 없거나 로그인 사용자와 같으면 본인 프로필 조회
  //       if (!userId) {
  //         console.log('Fetching own profile...');
  //         res = await api.get('/public-profiles', {
  //           headers: token ? { Authorization: `Bearer ${token}` } : {}
  //         });
  //         console.log("--------")
  //         console.log(res.data?? res.data.data)
  //       } else {
  //         // 다른 사용자 프로필 조회
  //         console.log('Fetching other user profile:', userId);
  //         res = await api.get(`/public-profiles/${userId}`, {
  //           headers: token ? { Authorization: `Bearer ${token}` } : {}
  //         });
  //       }

  //       if (!cancelled) {
  //         console.log('Public profile response:', res.data);
  //         if (res.data.data) {
  //           setPublicProfile(res.data.data);
  //         } else {
  //           throw new Error('프로필 데이터가 없습니다.');
  //         }
  //       }
  //     } catch (error: any) {
  //       console.error('Failed to fetch public profile:', error);
  //       if (!cancelled) {
  //         setError(error.response?.data?.message || '프로필을 불러오는데 실패했습니다.');
  //       }
  //     } finally {
  //       if (!cancelled) {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   // loginUserInfo가 로드된 후에 프로필을 가져옴
  //   if (loginUserInfo) {
  //     fetchPublicProfile();
  //   }

  //   return () => { cancelled = true; };
  // }, [userId, loginUserInfo]);


 const fetchPublicProfile = React.useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

       const headers = await authHeader();
       // userId가 없거나 로그인 유저와 같으면 "내 프로필"
       const isOwn = userId == null || (loginUserInfo && Number(userId) === Number(loginUserInfo.id));
       let res;
       if (isOwn) {
          console.log('Fetching own profile...');

         res = await api.get('/public-profiles', { headers });
        } else {

         console.log('Fetching other user profile:', userId);
         res = await api.get(`/public-profiles/${userId}`, { headers });
        }

       console.log('Public profile response:', res.data);
       const data = res.data?.data;
       if (!data) throw new Error(res.data?.message || '프로필 데이터가 없습니다.');
       setPublicProfile(data);
      } catch (error: any) {
        console.error('Failed to fetch public profile:', error);
       // 404 메시지 반영
       const msg = error?.response?.data?.message || error?.message || '프로필을 불러오는데 실패했습니다.';
       setError(msg);
      } finally {
       setLoading(false);
      }

 }, [userId, loginUserInfo]);

 useEffect(() => {
   if (loginUserInfo) fetchPublicProfile();
}, [loginUserInfo, fetchPublicProfile]);


  // 나이 계산 함수
  function getAge(birthdate: string): number {
    const birthYear = parseInt(birthdate.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear + 1;
  }

  // 본인 프로필인지 확인
  const isOwnProfile = loginUserInfo && publicProfile && 
    (Number(loginUserInfo.id) === Number(publicProfile.userId));

  console.log('Is own profile:', isOwnProfile, 'loginUserId:', loginUserInfo?.id, 'profileUserId:', publicProfile?.userId);

  // 텍스트 변환 함수들
  const tGender = (g?: string) =>
    g === "MALE" ? '남성' :
    g === "FEMALE" ? '여성' :
    '미정';

  const tLifestyle = (v?: Lifestyle) =>
    v === Lifestyle.Morning ? '아침형' :
    v === Lifestyle.Evening ? '저녁형' :
    '상관없음';

  const tPersonality = (v?: Personality) =>
    v === Personality.Introvert ? '집순이' :
    v === Personality.Extrovert ? '밖순이' :
    '상관없음';

  const tSmoking = (v?: Smoking) =>
    v === Smoking.None ? '비흡연' :
    v === Smoking.Impossible ? '흡연불가' :
    '상관없음';

  const tSnoring = (v?: Snoring) =>
    v === Snoring.None ? '코골이 없음' :
    v === Snoring.Impossible ? '코골이 불가' :
    '상관없음';

  const tPets = (v?: Pets) =>
    v === Pets.Possible ? '가능' :
    v === Pets.None ? '없음' :
    v === Pets.Impossible ? '불가능' :
    '상관없음';

  type LifestyleKey = 'lifestyle' | 'personality' | 'smoking' | 'hasPet' | 'snoring';

  // 아이콘 선택
  const getLifestyleIcon = (key: LifestyleKey) => {
    switch (key) {
      case 'lifestyle':   return <Ionicons name="sunny" size={16} color="#F59E0B" />;
      case 'personality': return <Ionicons name="home" size={16} color="#6b7280" />;
      case 'smoking':     return <Ionicons name="ban" size={16} color="#EF4444" />;
      case 'hasPet':      return <Ionicons name="paw" size={16} color="#8B5CF6" />;
      case 'snoring':     return <Ionicons name="volume-mute" size={16} color="#6b7280" />;
    }
  };

  const getLifestyleLabel = (key: LifestyleKey) => {
    switch (key) {
      case 'lifestyle':   return '생활패턴';
      case 'personality': return '성격';
      case 'smoking':     return '흡연';
      case 'hasPet':      return '반려동물';
      case 'snoring':     return '코골이';
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingTop: 50,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>공개프로필</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#F7B32B" />
          <Text style={{ marginTop: 16, color: '#6b7280' }}>프로필을 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 에러 상태
  if (error || !publicProfile) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingTop: 50,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>공개프로필</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Ionicons name="alert-circle" size={64} color="#ef4444" />
          <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 16, textAlign: 'center' }}>
            프로필을 불러올 수 없습니다
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
            {error || '알 수 없는 오류가 발생했습니다.'}
          </Text>
          <TouchableOpacity 
            onPress={() => window.location.reload()}
            style={{
              marginTop: 24,
              paddingHorizontal: 24,
              paddingVertical: 12,
              backgroundColor: '#F7B32B',
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600' }}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 생활 스타일 데이터 준비
  const lifestyleRows: { key: LifestyleKey; label: string; value: string }[] = [
    { key: 'lifestyle',   label: getLifestyleLabel('lifestyle'),   value: tLifestyle(publicProfile.mLifestyle) },
    { key: 'personality', label: getLifestyleLabel('personality'), value: tPersonality(publicProfile.mPersonality) },
    { key: 'smoking',     label: getLifestyleLabel('smoking'),     value: tSmoking(publicProfile.mSmoking) },
    { key: 'hasPet',      label: getLifestyleLabel('hasPet'),      value: tPets(publicProfile.mPet) },
    { key: 'snoring',     label: getLifestyleLabel('snoring'),     value: tSnoring(publicProfile.mSnoring) },
  ];

  const ageText = loginUserInfo?.birthDate ? `${getAge(loginUserInfo.birthDate)}세` : '';

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* 헤더 */}
      <View style={{
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 50,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>공개프로필</Text>
          {/* 본인 프로필인 경우만 수정 버튼 표시 */}
          {isOwnProfile ? (
            <TouchableOpacity onPress={onEdit}>
              <Ionicons name="pencil" size={16} color="#6b7280" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>
      </View>

      <ScrollView style={{ padding: 16 }} contentContainerStyle={{ gap: 24 }}>
        {/* 기본 정보 */}
        <Card>
          <CardContent style={{ padding: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
              <Avatar style={{ width: 80, height: 80 }}>
                {publicProfile.profileImageUrl ? (
                  <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6' }}>
                    {/* 이미지 컴포넌트로 교체 가능 */}
                    <AvatarFallback style={{ fontSize: 20 }}>
                      {publicProfile.name.charAt(0)}
                    </AvatarFallback>
                  </View>
                ) : (
                  <AvatarFallback style={{ fontSize: 20 }}>
                    {publicProfile.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Text style={{ fontSize: 20, fontWeight: '600' }}>{publicProfile.name}</Text>
                  <View style={{
                    backgroundColor: '#22c55e',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <Text style={{ fontSize: 12, color: '#ffffff' }}>✓</Text>
                    <Text style={{ fontSize: 12, color: '#ffffff' }}>인증완료</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  {ageText && (
                    <>
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>{ageText}</Text>
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>•</Text>
                    </>
                  )}
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>{tGender(publicProfile.gender)}</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 자기소개 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>자기소개</CardTitle>
          </CardHeader>
          <CardContent>
            <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151' }}>
              {publicProfile.info || '자기소개가 없습니다.'}
            </Text>
          </CardContent>
        </Card>

        {/* 생활 스타일 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>생활 스타일</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {lifestyleRows.map(({ key, label, value }) => (
                <View
                  key={`life-${key}`}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: '45%' }}
                >
                  <View style={{ width: 16, height: 16 }}>
                    {getLifestyleIcon(key)}
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>{label}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>{value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 인증 현황 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>인증 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14 }}>신분증 인증</Text>
                <View style={{
                  backgroundColor: loginUserInfo?.ocrValidation ? '#22c55e' : '#f3f4f6',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: loginUserInfo?.ocrValidation ? '#ffffff' : '#6b7280'
                  }}>
                    {loginUserInfo?.ocrValidation ? '완료' : '미완료'}
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <View style={{ paddingBottom: 24, gap: 12 }}>
          {isOwnProfile ? (
            // 본인 프로필인 경우: 수정하기 버튼
            <TouchableOpacity 
              onPress={onEdit}
              style={{
                width: '100%',
                paddingVertical: 16,
                borderRadius: 8,
                backgroundColor: '#F7B32B',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              <Ionicons name="pencil" size={16} color="#ffffff" />
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                수정하기
              </Text>
            </TouchableOpacity>
          ) : (
            // 다른 사용자 프로필인 경우: 채팅하기 버튼
            <TouchableOpacity 
              onPress={onNavigateToChat}
              style={{
                width: '100%',
                paddingVertical: 16,
                borderRadius: 8,
                backgroundColor: '#F7B32B',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              <Ionicons name="chatbubble-ellipses" size={16} color="#ffffff" />
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                채팅하기
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Gender, Lifestyle, Personality, Pets, Smoking, Snoring, SocialType } from '@/types/enums';

interface PublicProfileViewScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
  userId?: string;
  onNavigateToChat?: () => void;
}

export default function PublicProfileViewScreen({ onBack, onEdit, userId, onNavigateToChat }: PublicProfileViewScreenProps) {
const [publicProfile, setPublicProfile] = useState<profile | null>(null);
const [ocr, setOcr] = useState<verification | null>(null);
const [userInfo, setUserInfo] = useState<userInfo | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let cancelled = false;

  const fetchMyInfo = async () => {
    try {
      const res = await api.get('/auth'); 
      if (!cancelled) setUserInfo(res.data?.data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchMyInfo();          

  return () => {        
    cancelled = true;
  };
  }, []); 


useEffect(() => {
  let cancelled = false;
  const load = async () => {
    try {
      setLoading(true);
      const [p, o] = await Promise.all([
        api.get('/public-profiles'),
        api.get('/ocr/status'),
      ]);
      if (cancelled) return;
      console.log(p.data);
      console.log(o.data);
      setPublicProfile(p.data?.data ?? p.data ?? null);
      setOcr(o.data?.data ?? o.data ?? null);
    } finally {
      if (!cancelled) setLoading(false);
    }
  };
  load();
  return () => { cancelled = true; };
}, []);

// ⬇️ 여기서 한 번만 가드(디자인 유지하고 싶으면 기존 헤더/컨테이너 감싼 채로 스피너나 "불러오는 중..." 넣어도 ok)
if (loading || !publicProfile || !ocr) {
  return <View style={{flex:1, backgroundColor:'red'}}>{/* 로딩/스켈레톤 */}</View>;
}
function getAge(birthdate: string): number { 
  const birthYear = new Date(birthdate).getFullYear();
  const currentYear = new Date().getFullYear();
  
  return currentYear - birthYear + 1;
}
const ageText = userInfo?.birthDate ? `${getAge(userInfo.birthDate)}세` : '';

  interface profile {
    name : string, 
    age : number,
    gender : Gender,
    email : string,
    profileImg : string,
    info : string, 
    personality : Personality,
    lifestyle : Lifestyle,
    smoking : Smoking,
    hasPet : Pets,
    snoring : Snoring
  }

  interface verification {
    ocrVerified : Boolean;
  }

  interface userInfo { // api 명세에 맞게 수정
      id : number;
      name : string;
      email : string;
      birthDate : string | null;
      gender : Gender;
      socialType : SocialType;
      isCompleted : Boolean;
      ocrValidation : Boolean;
      isHost : Boolean;
  };


  const tGender = (g?: Gender) =>
  g === Gender.Male ? '남성' :
  g === Gender.Female ? '여성' :
  '상관없음';

const tLifestyle = (v?: Lifestyle) =>
  v === Lifestyle.Morning ? '아침형' :
  v === Lifestyle.Evening ? '저녁형' :
  '상관없음'; // Lifestyle.Evening = 'NIGHT'임에 주의

const tPersonality = (v?: Personality) =>
  v === Personality.Introvert ? '집순이' :
  v === Personality.Extrovert ? '밖순이' :
  '상관없음';

const tSmoking = (v?: Smoking) =>
  v === Smoking.Smoke ? '흡연' :
  v === Smoking.NotSmoke ? '비흡연' :
  v === Smoking.Impossible ? '흡연 불가' :
  '상관없음';

const tSnoring = (v?: Snoring) =>
  v === Snoring.Snore ? '코골이 있음' :
  v === Snoring.NoSnore ? '코골이 없음' :
  v === Snoring.Impossible ? '코골이 불가' :
  '상관없음';

const tPets = (v?: Pets) =>
  v === Pets.Have ? '있음' :
  v === Pets.NotHave ? '없음' :
  v === Pets.Possible ? '가능' :
  v === Pets.Impossible ? '불가능' :
  '상관없음';


  type LifestyleKey = 'lifestyle' | 'personality' | 'smoking' | 'hasPet' | 'snoring';



// type LifestyleKey = 'lifestyle' | 'personality' | 'smoking' | 'hasPet' | 'snoring';


// // ===== 아이콘 선택(키 기준) =====
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

const lifestyleRows: { key: LifestyleKey; label: string; value: string }[] = [
  { key: 'lifestyle',   label: getLifestyleLabel('lifestyle'),   value: tLifestyle(publicProfile.lifestyle) },
  { key: 'personality', label: getLifestyleLabel('personality'), value: tPersonality(publicProfile.personality) },
  { key: 'smoking',     label: getLifestyleLabel('smoking'),     value: tSmoking(publicProfile.smoking) },
  { key: 'hasPet',      label: getLifestyleLabel('hasPet'),      value: tPets(publicProfile.hasPet) },
  { key: 'snoring',     label: getLifestyleLabel('snoring'),     value: tSnoring(publicProfile.snoring) },
];



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
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="pencil" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ padding: 16 }} contentContainerStyle={{ gap: 24 }}>
        {/* 기본 정보 */}
        <Card>
          <CardContent style={{ padding: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
              <Avatar style={{ width: 80, height: 80 }}>
                <AvatarFallback style={{ fontSize: 20 }}>{publicProfile.name}</AvatarFallback>
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
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>{ageText}</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>•</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>{publicProfile.gender}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>{publicProfile.email}</Text>
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
              {publicProfile.info}
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
          key={`life-${key}`}   // ✅ 안정적인 고유 key
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
                  backgroundColor: ocr.ocrVerified ? '#22c55e' : '#f3f4f6',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: ocr.ocrVerified? '#ffffff' : '#6b7280'
                  }}>
                    {ocr.ocrVerified ? '완료' : '미완료'}
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 수정 버튼 */}
        <View style={{ paddingBottom: 24 }}>
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
        </View>
      </ScrollView>
    </View>
  );
}
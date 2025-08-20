import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';

interface PublicProfileViewScreenProps {
  onBack?: () => void;
  onEdit?: () => void;
  userId?: string;
  onNavigateToChat?: () => void;
}

export default function PublicProfileViewScreen({ onBack, onEdit, userId, onNavigateToChat }: PublicProfileViewScreenProps) {
  const publicProfile = {
    name: '김철수',
    age: 25,
    gender: '남성',
    location: '서울 강남구',
    avatar: '/avatar.jpg',
    introduction: '안녕하세요! 깔끔하고 조용한 환경을 선호하는 25세 직장인입니다. 서로 배려하며 편안하게 지낼 수 있는 룸메이트를 찾고 있어요. 궁금한 점이 있으시면 언제든 연락해주세요! 😊',
    interests: ['영화감상', '독서', '요리', '운동', '카페투어'],
    lifestyle: {
      sleepPattern: '아침형',
      personality: '집순이',
      smoking: '비흡연',
      drinking: '적당히',
      pet: '없음',
      cleanliness: '깔끔함',
      snoring: '안함'
    },
    jobInfo: {
      occupation: 'IT 개발자',
      workStyle: '재택근무',
      income: '3000만원 이상'
    },
    roomPreferences: {
      roomType: '원룸, 오피스텔',
      budget: '60-80만원',
      location: '강남구, 서초구',
      facilities: ['에어컨', '세탁기', '인터넷']
    },
    verification: {
      identity: true,
      income: true,
      background: false
    }
  };

  const getLifestyleIcon = (key: string) => {
    switch (key) {
      case 'sleepPattern':
        return publicProfile.lifestyle.sleepPattern === '아침형' ? 
          <Ionicons name="sunny" size={16} color="#F59E0B" /> : 
          <Ionicons name="moon" size={16} color="#6366F1" />;
      case 'personality':
        return <Ionicons name="home" size={16} color="#6b7280" />;
      case 'smoking':
        return <Ionicons name="ban" size={16} color="#EF4444" />;
      case 'pet':
        return <Ionicons name="paw" size={16} color="#8B5CF6" />;
      case 'snoring':
        return <Ionicons name="volume-mute" size={16} color="#6b7280" />;
      default:
        return <Ionicons name="heart" size={16} color="#EF4444" />;
    }
  };

  const getLifestyleLabel = (key: string) => {
    switch (key) {
      case 'sleepPattern': return '생활패턴';
      case 'personality': return '성격';
      case 'smoking': return '흡연';
      case 'drinking': return '음주';
      case 'pet': return '반려동물';
      case 'cleanliness': return '청결도';
      case 'snoring': return '코골이';
      default: return key;
    }
  };

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
                <AvatarFallback style={{ fontSize: 20 }}>{publicProfile.name[0]}</AvatarFallback>
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
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>{publicProfile.age}세</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>•</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>{publicProfile.gender}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>📍</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>{publicProfile.location}</Text>
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
              {publicProfile.introduction}
            </Text>
          </CardContent>
        </Card>

        {/* 관심사 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>관심사</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {publicProfile.interests.map((interest, index) => (
                <View key={index} style={{
                  backgroundColor: '#f3f4f6',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}>
                  <Text style={{ fontSize: 14 }}>{interest}</Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 생활 스타일 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>생활 스타일</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {Object.entries(publicProfile.lifestyle).map(([key, value]) => (
                <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minWidth: '45%' }}>
                  <View style={{ width: 16, height: 16 }}>
                    {getLifestyleIcon(key)}
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>{getLifestyleLabel(key)}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>{value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 직업 정보 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>직업 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>직업</Text>
                <Text style={{ fontSize: 14, fontWeight: '500' }}>{publicProfile.jobInfo.occupation}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>근무형태</Text>
                <Text style={{ fontSize: 14, fontWeight: '500' }}>{publicProfile.jobInfo.workStyle}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>소득수준</Text>
                <Text style={{ fontSize: 14, fontWeight: '500' }}>{publicProfile.jobInfo.income}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 선호 조건 */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>선호 조건</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 16 }}>
              <View>
                <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>희망 주거 형태</Text>
                <Text style={{ fontSize: 14, fontWeight: '500' }}>{publicProfile.roomPreferences.roomType}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>예산</Text>
                <Text style={{ fontSize: 14, fontWeight: '500' }}>{publicProfile.roomPreferences.budget}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>선호 지역</Text>
                <Text style={{ fontSize: 14, fontWeight: '500' }}>{publicProfile.roomPreferences.location}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>필수 시설</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {publicProfile.roomPreferences.facilities.map((facility, index) => (
                    <View key={index} style={{
                      borderWidth: 1,
                      borderColor: '#d1d5db',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}>
                      <Text style={{ fontSize: 12 }}>{facility}</Text>
                    </View>
                  ))}
                </View>
              </View>
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
                  backgroundColor: publicProfile.verification.identity ? '#22c55e' : '#f3f4f6',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: publicProfile.verification.identity ? '#ffffff' : '#6b7280'
                  }}>
                    {publicProfile.verification.identity ? '완료' : '미완료'}
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
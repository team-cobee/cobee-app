import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Slider } from './ui/slider';

interface ProfileEditScreenProps {
  onBack: () => void;
  onSave: () => void;
}

export default function ProfileEditScreen({ onBack, onSave }: ProfileEditScreenProps) {
  const [profileData, setProfileData] = useState({
    // 공개 프로필 정보
    nickname: "김민수",
    age: 25,
    lifestyle: "morning",
    personality: "homebody", 
    smokingStatus: "non-smoker",
    snoringStatus: "no-snoring",
    petStatus: "no-pets",
    bio: "깔끔하고 조용한 성격입니다. 매일 아침 7시에 출근하고 있어요!",
    // 매칭 선호도
    preferredGender: "any",
    ageMin: 22,
    ageMax: 100,
    preferredLifestyle: "any",
    preferredPersonality: "any",
    smokingPreference: "no-smoking",
    snoringPreference: "any",
    petPreference: "any",
    maxRoommates: 2
  });

  const [isChanged, setIsChanged] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsChanged(true);
  };

  const handleSliderChange = (values: number[], field: 'ageRange' | 'maxRoommates') => {
    if (field === 'maxRoommates') {
      setProfileData(prev => ({...prev, maxRoommates: values[0]}));
    } else if (field === 'ageRange') {
      setProfileData(prev => ({
        ...prev,
        ageMin: values[0],
        ageMax: values[1]
      }));
    }
    setIsChanged(true);
  };

  const handleSave = () => {
    // 프로필 저장 로직
    onSave();
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>프로필 수정</Text>
          </View>
          <TouchableOpacity 
            onPress={handleSave}
            disabled={!isChanged}
            style={{
              backgroundColor: isChanged ? '#F7B32B' : '#f3f4f6',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Ionicons name="save" size={16} color={isChanged ? '#ffffff' : '#9ca3af'} />
            <Text style={{ color: isChanged ? '#ffffff' : '#9ca3af', fontSize: 14 }}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ padding: 24 }} contentContainerStyle={{ gap: 24 }}>
        {/* 프로필 사진 */}
        <Card>
          <CardHeader>
            <Text style={{ fontWeight: '500', fontSize: 16 }}>프로필 사진</Text>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Avatar style={{ width: 80, height: 80 }}>
                <AvatarFallback>
                  {profileData.nickname.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <View>
                <TouchableOpacity 
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Ionicons name="camera" size={16} color="#ffffff" />
                  <Text style={{ fontSize: 14 }}>사진 변경</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                  JPG, PNG 파일 (최대 5MB)
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <Text style={{ fontWeight: '500', fontSize: 16 }}>기본 정보</Text>
          </CardHeader>
          <CardContent style={{ gap: 16 }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>닉네임</Text>
              <TextInput
                value={profileData.nickname}
                onChangeText={(value) => handleInputChange('nickname', value)}
                placeholder="닉네임을 입력하세요"
                maxLength={10}
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                2-10자 이내 (한글, 영문, 숫자)
              </Text>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>나이</Text>
              <TouchableOpacity 
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
                <Text style={{ fontSize: 16 }}>{profileData.age}세</Text>
                <Ionicons name="chevron-down" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* 생활 정보 */}
        <Card>
          <CardHeader>
            <Text style={{ fontWeight: '500', fontSize: 16 }}>생활 정보</Text>
          </CardHeader>
          <CardContent style={{ gap: 16 }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>생활 패턴</Text>
              <TouchableOpacity 
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
                <Text style={{ fontSize: 16 }}>
                  {profileData.lifestyle === 'morning' ? '아침형' : '저녁형'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>성격 유형</Text>
              <TouchableOpacity 
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
                <Text style={{ fontSize: 16 }}>
                  {profileData.personality === 'homebody' ? '집순이' : '밖순이'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>흡연 여부</Text>
              <TouchableOpacity 
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
                <Text style={{ fontSize: 16 }}>
                  {profileData.smokingStatus === 'non-smoker' ? '비흡연자' : '흡연자'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>코골이</Text>
              <TouchableOpacity 
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
                <Text style={{ fontSize: 16 }}>
                  {profileData.snoringStatus === 'snores' ? '코골이함' : '안함'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>반려동물</Text>
              <TouchableOpacity 
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
                <Text style={{ fontSize: 16 }}>
                  {profileData.petStatus === 'has-pets' ? '있음' : '없음'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* 매칭 선호도 */}
        <Card>
          <CardHeader>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="settings" size={18} color="#F7B32B" />
              <Text style={{ fontWeight: '500', fontSize: 16 }}>매칭 선호도</Text>
            </View>
          </CardHeader>
          <CardContent style={{ gap: 24 }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>선호 성별</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { value: 'male', label: '남성' },
                  { value: 'female', label: '여성' },
                  { value: 'any', label: '상관없음' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleInputChange('preferredGender', option.value)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderWidth: 1,
                      borderRadius: 8,
                      alignItems: 'center',
                      backgroundColor: profileData.preferredGender === option.value ? '#F7B32B' : '#ffffff',
                      borderColor: profileData.preferredGender === option.value ? '#F7B32B' : '#d1d5db',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      color: profileData.preferredGender === option.value ? '#ffffff' : '#111827'
                    }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
                선호 나이대: {profileData.ageMin}세 - {profileData.ageMax}세
              </Text>
              <View style={{ gap: 12 }}>
                <Slider
                  value={[profileData.ageMin, profileData.ageMax]}
                  onValueChange={(values) => handleSliderChange(values, 'ageRange')}
                  max={100}
                  min={18}
                  step={1}
                  style={{ width: '100%' }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>18세</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>100세</Text>
                </View>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>선호 생활 패턴</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { value: 'morning', label: '아침형' },
                  { value: 'evening', label: '저녁형' },
                  { value: 'any', label: '상관없음' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleInputChange('preferredLifestyle', option.value)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderWidth: 1,
                      borderRadius: 8,
                      alignItems: 'center',
                      backgroundColor: profileData.preferredLifestyle === option.value ? '#F7B32B' : '#ffffff',
                      borderColor: profileData.preferredLifestyle === option.value ? '#F7B32B' : '#d1d5db',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      color: profileData.preferredLifestyle === option.value ? '#ffffff' : '#111827'
                    }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>선호 성격 유형</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { value: 'homebody', label: '집순이' },
                  { value: 'outgoing', label: '밖순이' },
                  { value: 'any', label: '상관없음' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleInputChange('preferredPersonality', option.value)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderWidth: 1,
                      borderRadius: 8,
                      alignItems: 'center',
                      backgroundColor: profileData.preferredPersonality === option.value ? '#F7B32B' : '#ffffff',
                      borderColor: profileData.preferredPersonality === option.value ? '#F7B32B' : '#d1d5db',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      color: profileData.preferredPersonality === option.value ? '#ffffff' : '#111827'
                    }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>흡연 선호도</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { value: 'no-smoking', label: '흡연 불가' },
                  { value: 'any', label: '상관없음' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleInputChange('smokingPreference', option.value)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderWidth: 1,
                      borderRadius: 8,
                      alignItems: 'center',
                      backgroundColor: profileData.smokingPreference === option.value ? '#F7B32B' : '#ffffff',
                      borderColor: profileData.smokingPreference === option.value ? '#F7B32B' : '#d1d5db',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      color: profileData.smokingPreference === option.value ? '#ffffff' : '#111827'
                    }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
                동거 가능 인원 수 (본인 포함): {profileData.maxRoommates}명
              </Text>
              <Slider
                value={[profileData.maxRoommates]}
                onValueChange={(values) => handleSliderChange(values, 'maxRoommates')}
                max={10}
                min={2}
                step={1}
                style={{ width: '100%' }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>2명</Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>10명</Text>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>반려동물 선호도</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[
                  { value: 'possible', label: '가능' },
                  { value: 'impossible', label: '불가능' },
                  { value: 'any', label: '상관없음' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleInputChange('petPreference', option.value)}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderWidth: 1,
                      borderRadius: 8,
                      alignItems: 'center',
                      backgroundColor: profileData.petPreference === option.value ? '#F7B32B' : '#ffffff',
                      borderColor: profileData.petPreference === option.value ? '#F7B32B' : '#d1d5db',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      color: profileData.petPreference === option.value ? '#ffffff' : '#111827'
                    }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 자기소개 */}
        <Card>
          <CardHeader>
            <Text style={{ fontWeight: '500', fontSize: 16 }}>자기소개</Text>
          </CardHeader>
          <CardContent>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                textAlignVertical: 'top',
                minHeight: 120,
              }}
              multiline
              numberOfLines={6}
              value={profileData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              placeholder="자신을 소개하는 글을 자유롭게 작성해주세요"
              maxLength={500}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                다른 사용자에게 보여지는 소개글입니다
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                {profileData.bio.length}/500
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* 프로필 미리보기 */}
        <Card>
          <CardHeader>
            <Text style={{ fontWeight: '500', fontSize: 16 }}>프로필 미리보기</Text>
          </CardHeader>
          <CardContent>
            <View style={{ backgroundColor: '#f9fafb', padding: 16, borderRadius: 8, gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar style={{ width: 48, height: 48 }}>
                  <AvatarFallback>{profileData.nickname.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <View>
                  <Text style={{ fontWeight: '500', fontSize: 16 }}>{profileData.nickname}</Text>
                  <Text style={{ fontSize: 14, color: '#6b7280' }}>{profileData.age}세</Text>
                </View>
              </View>
              
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                <View style={{ flex: 1, minWidth: '45%' }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>생활패턴</Text>
                  <Text style={{ fontWeight: '500', fontSize: 14 }}>
                    {profileData.lifestyle === 'morning' ? '아침형' : '저녁형'}
                  </Text>
                </View>
                <View style={{ flex: 1, minWidth: '45%' }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>성격</Text>
                  <Text style={{ fontWeight: '500', fontSize: 14 }}>
                    {profileData.personality === 'homebody' ? '집순이' : '밖순이'}
                  </Text>
                </View>
                <View style={{ flex: 1, minWidth: '45%' }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>흡연</Text>
                  <Text style={{ fontWeight: '500', fontSize: 14 }}>
                    {profileData.smokingStatus === 'non-smoker' ? '비흡연자' : '흡연자'}
                  </Text>
                </View>
                <View style={{ flex: 1, minWidth: '45%' }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>반려동물</Text>
                  <Text style={{ fontWeight: '500', fontSize: 14 }}>
                    {profileData.petStatus === 'has-pets' ? '있음' : '없음'}
                  </Text>
                </View>
              </View>

              {profileData.bio && (
                <View>
                  <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>자기소개</Text>
                  <Text style={{ fontSize: 14 }}>{profileData.bio}</Text>
                </View>
              )}

              <View style={{ borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 12 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>매칭 선호도</Text>
                <View style={{ gap: 4 }}>
                  <Text style={{ fontSize: 12 }}>선호 나이: {profileData.ageMin}세 - {profileData.ageMax}세</Text>
                  <Text style={{ fontSize: 12 }}>최대 동거 인원: {profileData.maxRoommates}명</Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
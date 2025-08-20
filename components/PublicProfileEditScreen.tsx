import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';

interface PublicProfileEditScreenProps {
  onBack: () => void;
  onSave: () => void;
}

export default function PublicProfileEditScreen({ onBack, onSave }: PublicProfileEditScreenProps) {
  const [formData, setFormData] = useState({
    name: '김철수',
    age: '25',
    gender: '남성',
    location: '서울 강남구',
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
    }
  });

  // const [newInterest, setNewInterest] = useState('');
  // const [newFacility, setNewFacility] = useState('');

  // const availableInterests = ['영화감상', '독서', '요리', '운동', '카페투어', '여행', '음악감상', '게임', '등산', '사진촬영'];

  // const handleAddInterest = (interest: string) => {
  //   if (!formData.interests.includes(interest)) {
  //     setFormData({
  //       ...formData,
  //       interests: [...formData.interests, interest]
  //     });
  //   }
  // };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(item => item !== interest)
    });
  };


  const handleRemoveFacility = (facility: string) => {
    setFormData({
      ...formData,
      roomPreferences: {
        ...formData.roomPreferences,
        facilities: formData.roomPreferences.facilities.filter(item => item !== facility)
      }
    });
  };

  const handleSave = () => {
    Alert.alert('완료', '공개프로필이 저장되었습니다');
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
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>공개프로필 수정</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>
      </View>

      <ScrollView style={{ padding: 16, gap: 24 }}>
        {/* 프로필 사진 */}
        <Card style={{ marginBottom: 24 }}>
          <CardContent style={{ padding: 24, alignItems: 'center', gap: 16 }}>
            <View style={{ alignItems: 'center', gap: 16 }}>
              <View style={{ position: 'relative' }}>
                <Avatar style={{ width: 96, height: 96 }}>
                  <AvatarFallback style={{ fontSize: 24 }}>{formData.name[0]}</AvatarFallback>
                </Avatar>
                <TouchableOpacity style={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  width: 32,
                  height: 32,
                  backgroundColor: '#F7B32B',
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Ionicons name="camera" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
                프로필 사진을 변경하려면 클릭하세요
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* 기본 정보 */}
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>기본 정보</CardTitle>
          </CardHeader>
          <CardContent style={{ gap: 16 }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>이름</Text>
              <TextInput
                value={formData.name}
                onChangeText={(value) => setFormData({...formData, name: value})}
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
            </View>
            
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>나이</Text>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 16 }}>{formData.age}세</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>성별</Text>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 16 }}>{formData.gender}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>거주지역</Text>
              <TextInput
                value={formData.location}
                onChangeText={(value) => setFormData({...formData, location: value})}
                placeholder="ex) 서울 강남구"
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
            </View>
          </CardContent>
        </Card>

        {/* 자기소개 */}
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>자기소개</CardTitle>
          </CardHeader>
          <CardContent>
            <TextInput
              multiline
              numberOfLines={6}
              value={formData.introduction}
              onChangeText={(value) => setFormData({...formData, introduction: value})}
              placeholder="자신을 소개해주세요"
              maxLength={500}
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                textAlignVertical: 'top',
                minHeight: 120,
              }}
            />
            <View style={{ alignItems: 'flex-end', marginTop: 8 }}>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                {formData.introduction.length}/500
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* 관심사 */}
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>관심사</CardTitle>
          </CardHeader>
          <CardContent style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {formData.interests.map((interest, index) => (
                <View key={index} style={{
                  backgroundColor: '#f3f4f6',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  <Text style={{ fontSize: 14 }}>{interest}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveInterest(interest)}
                    style={{ padding: 2 }}
                  >
                    <Ionicons name="close" size={12} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 16, color: '#9ca3af' }}>관심사 추가</Text>
              <Text style={{ fontSize: 16, color: '#9ca3af' }}>▼</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* 생활 스타일 */}
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>생활 스타일</CardTitle>
          </CardHeader>
          <CardContent style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              <View style={{ flex: 1, minWidth: '45%' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>생활패턴</Text>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 16 }}>{formData.lifestyle.sleepPattern}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, minWidth: '45%' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>성격</Text>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 16 }}>{formData.lifestyle.personality}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, minWidth: '45%' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>흡연</Text>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 16 }}>{formData.lifestyle.smoking}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, minWidth: '45%' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>음주</Text>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 16 }}>{formData.lifestyle.drinking}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, minWidth: '45%' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>반려동물</Text>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 16 }}>{formData.lifestyle.pet}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, minWidth: '45%' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>청결도</Text>
                <TouchableOpacity style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{ fontSize: 16 }}>{formData.lifestyle.cleanliness}</Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 직업 정보 */}
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>직업 정보</CardTitle>
          </CardHeader>
          <CardContent style={{ gap: 16 }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>직업</Text>
              <TextInput
                value={formData.jobInfo.occupation}
                onChangeText={(value) => setFormData({
                  ...formData, 
                  jobInfo: {...formData.jobInfo, occupation: value}
                })}
                placeholder="ex) IT 개발자"
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>근무형태</Text>
              <TouchableOpacity style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 16 }}>{formData.jobInfo.workStyle}</Text>
                <Text style={{ fontSize: 16, color: '#9ca3af' }}>▼</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>소득수준</Text>
              <TouchableOpacity style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 16 }}>{formData.jobInfo.income}</Text>
                <Text style={{ fontSize: 16, color: '#9ca3af' }}>▼</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* 선호 조건 */}
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle style={{ fontSize: 16 }}>선호 조건</CardTitle>
          </CardHeader>
          <CardContent style={{ gap: 16 }}>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>희망 주거 형태</Text>
              <TextInput
                value={formData.roomPreferences.roomType}
                onChangeText={(value) => setFormData({
                  ...formData, 
                  roomPreferences: {...formData.roomPreferences, roomType: value}
                })}
                placeholder="ex) 원룸, 오피스텔"
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>예산</Text>
              <TextInput
                value={formData.roomPreferences.budget}
                onChangeText={(value) => setFormData({
                  ...formData, 
                  roomPreferences: {...formData.roomPreferences, budget: value}
                })}
                placeholder="ex) 60-80만원"
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>선호 지역</Text>
              <TextInput
                value={formData.roomPreferences.location}
                onChangeText={(value) => setFormData({
                  ...formData, 
                  roomPreferences: {...formData.roomPreferences, location: value}
                })}
                placeholder="ex) 강남구, 서초구"
                style={{
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  fontSize: 16,
                }}
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>필수 시설</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {formData.roomPreferences.facilities.map((facility, index) => (
                  <View key={index} style={{
                    backgroundColor: '#f3f4f6',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <Text style={{ fontSize: 14 }}>{facility}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveFacility(facility)}
                      style={{ padding: 2 }}
                    >
                      <Ionicons name="close" size={12} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 16, color: '#9ca3af' }}>필수 시설 추가</Text>
                <Text style={{ fontSize: 16, color: '#9ca3af' }}>▼</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* 저장 버튼 */}
        <View style={{ paddingBottom: 24 }}>
          <TouchableOpacity 
            onPress={handleSave}
            style={{
              width: '100%',
              paddingVertical: 16,
              borderRadius: 8,
              backgroundColor: '#F7B32B',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
              저장하기
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
import { useState } from 'react';
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

interface SignupScreenProps {
  onSignup?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

export default function SignupScreen({ onSignup, onBack, onComplete }: SignupScreenProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // 매칭 선호도 설정
    preferredGender: '',
    ageMin: 20,
    ageMax: 100,
    lifestyle: '',
    personality: '',
    smokingPreference: '',
    snoringPreference: '',
    maxRoommates: 2,
    petPreference: '',
    
    // 개인정보
    nickname: '',
    
    // 공개 프로필
    myAge: 25,
    myLifestyle: '',
    myPersonality: '',
    mySmokingStatus: '',
    mySnoringStatus: '',
    myPetStatus: '',
    bio: '',
    
    // 신분증 인증
    idVerified: false,
    idImageFile: null as string | null,
    idImagePreview: null as string | null,
    // OCR 추출 정보
    extractedName: '',
    extractedResidentNumber: '',
    extractedIssueDate: ''
  });

  const [uploadState, setUploadState] = useState({
    isUploading: false,
    isProcessing: false,
    error: null as string | null
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // const handleSliderChange = (values: number[], field: 'ageRange' | 'maxRoommates') => {
  //   if (field === 'maxRoommates') {
  //     setFormData({...formData, maxRoommates: values[0]});
  //   } else if (field === 'ageRange') {
  //     setFormData({
  //       ...formData,
  //       ageMin: values[0],
  //       ageMax: values[1]
  //     });
  //   }
  // };

  const handleFileSelect = () => {
    // React Native에서는 이미지 피커를 사용해야 함
    Alert.alert('알림', '이미지 선택 기능은 React Native 이미지 피커 라이브러리가 필요합니다.');
    
    // 시뮬레이션을 위한 임시 코드
    const mockImageUri = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD';
    setFormData({
      ...formData,
      idImageFile: mockImageUri,
      idImagePreview: mockImageUri
    });
    
    processOCR(mockImageUri);
    
    setUploadState({
      isUploading: true,
      isProcessing: false,
      error: null
    });
  };

  const processOCR = async (_imageUri: string) => {
    setUploadState({
      isUploading: false,
      isProcessing: true,
      error: null
    });

    // OCR 처리 시뮬레이션 (3초 대기)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 90% 확률로 성공
      if (Math.random() > 0.1) {
        // 모의 OCR 결과 데이터 생성 (랜덤하게 선택)
        const mockNames = ['김민수', '이지영', '박준호', '최서연', '정다은'];
        const mockBirthYears = ['90', '91', '92', '93', '94', '95'];
        const mockIssueDates = ['2023.05.15', '2023.08.22', '2024.01.10', '2023.11.03', '2024.03.08'];
        
        const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
        const randomBirthYear = mockBirthYears[Math.floor(Math.random() * mockBirthYears.length)];
        const randomIssueDate = mockIssueDates[Math.floor(Math.random() * mockIssueDates.length)];
        const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        
        const mockOcrData = {
          name: randomName,
          residentNumber: `${randomBirthYear}${randomMonth}${randomDay}-1******`, // 뒷자리 마스킹
          issueDate: randomIssueDate
        };

        setFormData(prev => ({
          ...prev,
          idVerified: true,
          extractedName: mockOcrData.name,
          extractedResidentNumber: mockOcrData.residentNumber,
          extractedIssueDate: mockOcrData.issueDate
        }));
        
        setUploadState({
          isUploading: false,
          isProcessing: false,
          error: null
        });
      } else {
        // 10% 확률로 실패
        setUploadState({
          isUploading: false,
          isProcessing: false,
          error: '신분증을 명확하게 촬영해주세요. 글자가 흐리거나 가려진 부분이 있습니다.'
        });
      }
    } catch (error) {
      setUploadState({
        isUploading: false,
        isProcessing: false,
        error: '인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
      });
    }
  };

  const resetUpload = () => {
    setFormData({
      ...formData,
      idImageFile: null,
      idImagePreview: null,
      idVerified: false,
      extractedName: '',
      extractedResidentNumber: '',
      extractedIssueDate: ''
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
                {formData.idVerified ? (
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
                            source={{ uri: formData.idImagePreview }} 
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
                            <Text style={{ fontWeight: '500', color: '#14532d' }}>{formData.extractedName}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#15803d' }}>주민등록번호</Text>
                            <Text style={{ fontWeight: '500', color: '#14532d' }}>{formData.extractedResidentNumber}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: '#15803d' }}>발급일자</Text>
                            <Text style={{ fontWeight: '500', color: '#14532d' }}>{formData.extractedIssueDate}</Text>
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
                    {formData.idImagePreview && (
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
                    {formData.idImagePreview ? (
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
                            onPress={() => processOCR(formData.idImageFile!)}
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
                    
                    {uploadState.error && !formData.idImagePreview && (
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
              disabled={!formData.idVerified}
              style={{
                width: '100%',
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: 'center',
                backgroundColor: formData.idVerified ? '#E6940C' : 'rgba(247, 179, 43, 0.5)'
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
                    { value: 'male', label: '남자' },
                    { value: 'female', label: '여자' },
                    { value: 'any', label: '상관없음' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, preferredGender: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData.preferredGender === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData.preferredGender === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData.preferredGender === option.value ? 'white' : '#374151'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
                  선호 나이대: {formData.ageMin}세 - {formData.ageMax}세
                </Text>
                <View style={{ gap: 12 }}>
                  <View style={{ 
                    height: 40, 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: 20, 
                    justifyContent: 'center',
                    paddingHorizontal: 16
                  }}>
                    <Text style={{ textAlign: 'center', color: '#6b7280' }}>
                      슬라이더 기능은 React Native 전용 라이브러리 필요
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>18세</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>100세</Text>
                  </View>
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>생활 패턴</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { value: 'morning', label: '아침형' },
                    { value: 'evening', label: '저녁형' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, lifestyle: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData.lifestyle === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData.lifestyle === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData.lifestyle === option.value ? 'white' : '#374151'
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
                    { value: 'homebody', label: '집순이' },
                    { value: 'outgoing', label: '밖순이' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, personality: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData.personality === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData.personality === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData.personality === option.value ? 'white' : '#374151'
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
                disabled={!formData.preferredGender || !formData.lifestyle || !formData.personality}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: formData.preferredGender && formData.lifestyle && formData.personality
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
                    { value: 'no-smoking', label: '흡연 불가' },
                    { value: 'any', label: '상관없음' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, smokingPreference: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData.smokingPreference === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData.smokingPreference === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData.smokingPreference === option.value ? 'white' : '#374151'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>코골이</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { value: 'any', label: '상관없음' },
                    { value: 'no-snoring', label: '코골이 불가' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, snoringPreference: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData.snoringPreference === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData.snoringPreference === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData.snoringPreference === option.value ? 'white' : '#374151'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
                  동거 가능 인원 수 (본인 포함): {formData.maxRoommates}명
                </Text>
                <View style={{ gap: 12 }}>
                  <View style={{ 
                    height: 40, 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: 20, 
                    justifyContent: 'center',
                    paddingHorizontal: 16
                  }}>
                    <Text style={{ textAlign: 'center', color: '#6b7280' }}>
                      슬라이더 기능은 React Native 전용 라이브러리 필요
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>2명</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>10명</Text>
                  </View>
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>반려동물</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[
                    { value: 'possible', label: '가능' },
                    { value: 'impossible', label: '불가능' },
                    { value: 'any', label: '상관없음' }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setFormData({...formData, petPreference: option.value})}
                      style={{
                        flex: 1,
                        padding: 12,
                        borderWidth: 1,
                        borderColor: formData.petPreference === option.value ? '#F7B32B' : '#d1d5db',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: formData.petPreference === option.value ? '#F7B32B' : 'transparent'
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        color: formData.petPreference === option.value ? 'white' : '#374151'
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
                disabled={!formData.smokingPreference || !formData.snoringPreference || !formData.petPreference}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: formData.smokingPreference && formData.snoringPreference && formData.petPreference
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
              <Text style={{ fontSize: 20, fontWeight: '600' }}>닉네임 설정</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
                다른 사용자에게 보여질 닉네임을 설정해주세요
              </Text>
            </View>

            <View style={{ gap: 16 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>닉네임</Text>
                <TextInput
                  placeholder="닉네임을 입력하세요 (2-10자)"
                  value={formData.nickname}
                  onChangeText={(value) => setFormData({...formData, nickname: value})}
                  maxLength={10}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 16
                  }}
                />
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  한글, 영문, 숫자 사용 가능 (특수문자 제외)
                </Text>
              </View>

              <View style={{ backgroundColor: '#f9fafb', padding: 16, borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>닉네임 사용 가이드</Text>
                <View style={{ gap: 4 }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>• 2-10자 이내로 설정해주세요</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>• 개인정보가 포함되지 않도록 주의해주세요</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>• 부적절한 단어는 사용할 수 없습니다</Text>
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
                disabled={!formData.nickname || formData.nickname.length < 2}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: formData.nickname && formData.nickname.length >= 2
                    ? '#E6940C' 
                    : 'rgba(247, 179, 43, 0.5)'
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
              <Text style={{ fontSize: 20, fontWeight: '600' }}>공개 프로필 작성</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
                다른 사용자에게 보여질 프로필을 작성해주세요
              </Text>
            </View>

            <Card>
              <CardHeader>
                <Text style={{ fontSize: 16, fontWeight: '500' }}>기본 정보 (자동 입력됨)</Text>
              </CardHeader>
              <CardContent style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                  <View style={{ flex: 1, minWidth: '45%' }}>
                    <Text style={{ fontSize: 14, color: '#6b7280' }}>닉네임</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>{formData.nickname}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: '45%' }}>
                    <Text style={{ fontSize: 14, color: '#6b7280' }}>성별</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>남성</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: '45%' }}>
                    <Text style={{ fontSize: 14, color: '#6b7280' }}>나이</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>25세</Text>
                  </View>
                </View>
              </CardContent>
            </Card>

            <View style={{ gap: 16 }}>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>생활 패턴</Text>
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
                  <Text style={{ fontSize: 16, color: formData.myLifestyle ? '#000' : '#9ca3af' }}>
                    {formData.myLifestyle === 'morning' ? '아침형' : 
                     formData.myLifestyle === 'evening' ? '저녁형' : '선택해주세요'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>성격 유형</Text>
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
                  <Text style={{ fontSize: 16, color: formData.myPersonality ? '#000' : '#9ca3af' }}>
                    {formData.myPersonality === 'homebody' ? '집순이' : 
                     formData.myPersonality === 'outgoing' ? '밖순이' : '선택해주세요'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>흡연 여부</Text>
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
                  <Text style={{ fontSize: 16, color: formData.mySmokingStatus ? '#000' : '#9ca3af' }}>
                    {formData.mySmokingStatus === 'non-smoker' ? '비흡연자' : 
                     formData.mySmokingStatus === 'smoker' ? '흡연자' : '선택해주세요'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>코골이</Text>
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
                  <Text style={{ fontSize: 16, color: formData.mySnoringStatus ? '#000' : '#9ca3af' }}>
                    {formData.mySnoringStatus === 'snores' ? '코골이함' : 
                     formData.mySnoringStatus === 'no-snoring' ? '안함' : '선택해주세요'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View>
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
                  <Text style={{ fontSize: 16, color: formData.myPetStatus ? '#000' : '#9ca3af' }}>
                    {formData.myPetStatus === 'has-pets' ? '있음' : 
                     formData.myPetStatus === 'no-pets' ? '없음' : '선택해주세요'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>추가 내용 작성</Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  placeholder="자신을 소개하는 글을 자유롭게 작성해주세요"
                  value={formData.bio}
                  onChangeText={(value) => setFormData({...formData, bio: value})}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    fontSize: 16,
                    textAlignVertical: 'top',
                    minHeight: 100
                  }}
                />
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
                style={{
                  flex: 1,
                  borderRadius: 8,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: '#E6940C'
                }}
              >
                <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>다음</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 6:
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
                {formData.extractedName && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#6b7280' }}>이름</Text>
                    <Text>{formData.extractedName}</Text>
                  </View>
                )}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#6b7280' }}>닉네임</Text>
                  <Text>{formData.nickname}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#6b7280' }}>선호 성별</Text>
                  <Text>{
                    formData.preferredGender === 'male' ? '남성' :
                    formData.preferredGender === 'female' ? '여성' : '상관없음'
                  }</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#6b7280' }}>선호 나이</Text>
                  <Text>{formData.ageMin}세 - {formData.ageMax}세</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#6b7280' }}>동거 인원</Text>
                  <Text>최대 {formData.maxRoommates}명</Text>
                </View>
                {formData.extractedIssueDate && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#6b7280' }}>신분증 발급일</Text>
                    <Text>{formData.extractedIssueDate}</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => {
                onSignup?.();
                onComplete?.();
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
          {step === 6 ? '회원가입 완료' : '회원가입'}
        </Text>
        <View style={{ width: 24, height: 24 }} />
      </View>

      <ScrollView style={{ flex: 1, padding: 24 }}>
        {step < 6 && (
          <View style={{ marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
                  width: `${(step / 6) * 100}%`,
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
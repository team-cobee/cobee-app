import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface SelectJobPostingScreenProps {
  onBack?: () => void;
  onComplete?: (roomId: string) => void;
  onSelect?: () => void;
}

interface JobPosting {
  id: string;
  title: string;
  location: string;
  recruitCount: number;
  depositMin: number;
  depositMax: number;
  monthlyRentMin: number;
  monthlyRentMax: number;
  status: string;
  roomType: string;
  timeAgo: string;
}

export default function SelectJobPostingScreen({ onBack, onComplete }: SelectJobPostingScreenProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // 내가 작성한 구인글 목록 (목 데이터)
  const myJobPostings: JobPosting[] = [
    {
      id: '1',
      title: '강남역 근처 깔끔한 원룸 룸메이트 구해요',
      location: '서울 강남구 역삼동',
      recruitCount: 3,
      depositMin: 800,
      depositMax: 1200,
      monthlyRentMin: 60,
      monthlyRentMax: 80,
      status: '모집중',
      roomType: '방 있음',
      timeAgo: '2시간 전'
    },
    {
      id: '2',
      title: '신촌 투룸에서 함께 살 분 구합니다',
      location: '서울 서대문구 신촌동',
      recruitCount: 2,
      depositMin: 1000,
      depositMax: 1000,
      monthlyRentMin: 55,
      monthlyRentMax: 55,
      status: '모집중',
      roomType: '방 있음',
      timeAgo: '1일 전'
    }
  ];

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleCreateRoom = () => {
    if (selectedJobId) {
      // 채팅방 생성 로직
      const roomId = 'room_' + Date.now();
      Alert.alert('완료', '채팅방이 생성되었습니다!');
      onComplete?.(roomId);
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
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>구인글 선택</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>
      </View>

      <ScrollView style={{ padding: 24 }}>
        {/* 진행률 */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#E6940C',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#ffffff' }}>1</Text>
            </View>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#E6940C',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#ffffff' }}>2</Text>
            </View>
          </View>
          <View style={{ width: '100%', height: 8, backgroundColor: '#e5e7eb', borderRadius: 4 }}>
            <View style={{
              width: '100%',
              height: 8,
              backgroundColor: '#E6940C',
              borderRadius: 4,
            }} />
          </View>
        </View>

        <View style={{ gap: 24 }}>
          {/* 설명 */}
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>구인글 선택</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
                채팅방을 만들 구인글을 선택해주세요.
              </Text>
              <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
                내가 작성한 구인글만 선택할 수 있습니다.
              </Text>
            </View>
          </View>

          {/* 구인글 목록 */}
          {myJobPostings.length > 0 ? (
            <View style={{ gap: 16 }}>
              {myJobPostings.map((job) => (
                <TouchableOpacity 
                  key={job.id}
                  onPress={() => handleSelectJob(job.id)}
                  activeOpacity={0.7}
                >
                  <Card style={{
                    borderWidth: selectedJobId === job.id ? 2 : 1,
                    borderColor: selectedJobId === job.id ? '#F7B32B' : '#e5e7eb',
                  }}>
                    <CardContent style={{ padding: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontWeight: '500', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>{job.title}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>📍</Text>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.location}</Text>
                          </View>
                        </View>
                        {selectedJobId === job.id && (
                          <View style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: '#F7B32B',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Text style={{ fontSize: 16, color: '#ffffff' }}>✓</Text>
                          </View>
                        )}
                      </View>

                      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>보증금</Text>
                          <Text style={{ fontWeight: '500', fontSize: 14 }}>
                            {job.depositMin === job.depositMax 
                              ? `${job.depositMin}만원`
                              : `${job.depositMin}~${job.depositMax}만원`
                            }
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>월세</Text>
                          <Text style={{ fontWeight: '500', fontSize: 14 }}>
                            {job.monthlyRentMin === job.monthlyRentMax 
                              ? `${job.monthlyRentMin}만원`
                              : `${job.monthlyRentMin}~${job.monthlyRentMax}만원`
                            }
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>방 여부</Text>
                          <Text style={{ fontWeight: '500', fontSize: 14 }}>{job.roomType}</Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>👥</Text>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.recruitCount}명</Text>
                          </View>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.timeAgo}</Text>
                        </View>
                        <Badge>
                          <Text style={{ fontSize: 12 }}>{job.status}</Text>
                        </Badge>
                      </View>
                    </CardContent>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Card>
              <CardContent style={{ padding: 32, alignItems: 'center' }}>
                <View style={{ gap: 16, alignItems: 'center' }}>
                  <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: 'rgba(156, 163, 175, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 32, color: '#9ca3af' }}>👥</Text>
                  </View>
                  <View style={{ gap: 8, alignItems: 'center' }}>
                    <Text style={{ fontWeight: '500', fontSize: 16 }}>작성한 구인글이 없습니다</Text>
                    <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
                      채팅방을 만들려면 먼저 구인글을 작성해야 합니다.
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          )}
        </View>

        {/* 완료 버튼 */}
        <View style={{ marginTop: 32 }}>
          <TouchableOpacity
            onPress={handleCreateRoom}
            disabled={!selectedJobId}
            style={{
              width: '100%',
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selectedJobId ? '#E6940C' : 'rgba(247, 179, 43, 0.5)',
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
              채팅방 만들기
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

interface ApplicantsScreenProps {
  jobId: string | null;
  onBack: () => void;
  onNavigateToProfile?: (userId: string) => void;
  onNavigateToChat?: (userId: string) => void;
}

interface Applicant {
  id: string;
  nickname: string;
  age: string;
  gender: string;
  bio: string;
  lifestyle: string;
  smoking: boolean;
  pets: boolean;
  location: string;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  rating: number;
  matchingScore: number;
}

export default function ApplicantsScreen({ jobId, onBack, onNavigateToProfile, onNavigateToChat }: ApplicantsScreenProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "1",
      nickname: "이지영",
      age: "20대 중반",
      gender: "여성",
      bio: "깔끔하고 조용한 성격입니다. 매일 아침 6시에 운동하러 나가요!",
      lifestyle: "아침형",
      smoking: false,
      pets: false,
      location: "서울 마포구",
      appliedAt: "2시간 전",
      status: "pending",
      rating: 4.8,
      matchingScore: 95
    },
    {
      id: "2",
      nickname: "박서현",
      age: "20대 후반",
      gender: "여성",
      bio: "요리를 좋아하고 집에서 영화보는 것을 즐깁니다.",
      lifestyle: "저녁형",
      smoking: false,
      pets: true,
      location: "서울 강남구",
      appliedAt: "5시간 전",
      status: "pending",
      rating: 4.6,
      matchingScore: 87
    },
    {
      id: "3",
      nickname: "김민정",
      age: "20대 초반",
      gender: "여성",
      bio: "대학생이고 조용하게 공부하는 시간이 많아요.",
      lifestyle: "아침형",
      smoking: false,
      pets: false,
      location: "서울 서대문구",
      appliedAt: "1일 전",
      status: "accepted",
      rating: 4.9,
      matchingScore: 92
    },
    {
      id: "4",
      nickname: "정유진",
      age: "20대 중반",
      gender: "여성",
      bio: "회사원이고 주말에는 여행을 즐깁니다.",
      lifestyle: "아침형",
      smoking: false,
      pets: false,
      location: "서울 송파구",
      appliedAt: "2일 전",
      status: "rejected",
      rating: 4.7,
      matchingScore: 89
    },
    {
      id: "5",
      nickname: "최은혜",
      age: "20대 후반", 
      gender: "여성",
      bio: "프리랜서로 일하고 있어서 집에 있는 시간이 많아요.",
      lifestyle: "저녁형",
      smoking: false,
      pets: false,
      location: "서울 성동구",
      appliedAt: "3일 전",
      status: "pending",
      rating: 4.5,
      matchingScore: 83
    }
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const jobTitle = "홍대 근처 투룸 쉐어하실 분!";

  const handleAccept = (applicantId: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.id === applicantId 
        ? { ...applicant, status: 'accepted' }
        : applicant
    ));
    const applicant = applicants.find(a => a.id === applicantId);
    Alert.alert('알림', `${applicant?.nickname}님의 지원을 승인했습니다!`);
  };

  const handleReject = (applicantId: string) => {
    setApplicants(prev => prev.map(applicant => 
      applicant.id === applicantId 
        ? { ...applicant, status: 'rejected' }
        : applicant
    ));
    const applicant = applicants.find(a => a.id === applicantId);
    Alert.alert('알림', `${applicant?.nickname}님의 지원을 거절했습니다.`);
  };

  const handleStartChat = (applicantId: string) => {
    const applicant = applicants.find(a => a.id === applicantId);
    Alert.alert('알림', `${applicant?.nickname}님과의 채팅을 시작합니다!`);
    onNavigateToChat?.(applicantId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'accepted':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return "검토중";
      case 'accepted':
        return "승인됨";
      case 'rejected':
        return "거절됨";
      default:
        return "알 수 없음";
    }
  };

  const filteredApplicants = applicants.filter(applicant => 
    selectedFilter === 'all' || applicant.status === selectedFilter
  );

  const getMatchingScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-gray-600";
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
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>지원자 목록</Text>
              <Text style={{ fontSize: 14, color: '#6b7280' }}>{jobTitle}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={{ padding: 16 }}>
        {/* 통계 */}
        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#F7B32B' }}>{applicants.length}</Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>총 지원자</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#d97706' }}>
                  {applicants.filter(a => a.status === 'pending').length}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>검토중</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#16a34a' }}>
                  {applicants.filter(a => a.status === 'accepted').length}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>승인됨</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#dc2626' }}>
                  {applicants.filter(a => a.status === 'rejected').length}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>거절됨</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 필터 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8, paddingRight: 16 }}>
            {[
              { key: 'all', label: '전체' },
              { key: 'pending', label: '검토중' },
              { key: 'accepted', label: '승인됨' },
              { key: 'rejected', label: '거절됨' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "default" : "outline"}
                onPress={() => setSelectedFilter(filter.key as any)}
                style={selectedFilter === filter.key ? { backgroundColor: '#F7B32B' } : {}}
              >
                {filter.label}
              </Button>
            ))}
          </View>
        </ScrollView>

        {/* 지원자 목록 */}
        <View style={{ gap: 16 }}>
          {filteredApplicants.map((applicant) => (
            <Card key={applicant.id}>
              <CardContent style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <Avatar style={{ width: 64, height: 64 }}>
                    <AvatarFallback>
                      {applicant.nickname.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <Text style={{ fontWeight: '600' }}>{applicant.nickname}</Text>
                          <Badge>
                            {getStatusText(applicant.status)}
                          </Badge>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                          <Text style={{ fontSize: 14, color: '#6b7280' }}>{applicant.gender} • {applicant.age}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>📍</Text>
                            <Text style={{ fontSize: 14, color: '#6b7280' }}>{applicant.location}</Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>🕐</Text>
                            <Text style={{ fontSize: 14, color: '#6b7280' }}>{applicant.appliedAt}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                          <Text style={{ fontSize: 16, color: '#eab308' }}>⭐</Text>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>{applicant.rating}</Text>
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: getMatchingScoreColor(applicant.matchingScore) === 'text-green-600' ? '#16a34a' : getMatchingScoreColor(applicant.matchingScore) === 'text-yellow-600' ? '#d97706' : '#6b7280' }}>
                          매칭 {applicant.matchingScore}%
                        </Text>
                      </View>
                    </View>

                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 12, lineHeight: 20 }}>
                      {applicant.bio}
                    </Text>

                    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
                      <View>
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>생활패턴: 
                          <Text style={{ fontWeight: '500', color: '#374151' }}> {applicant.lifestyle}</Text>
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>흡연: 
                          <Text style={{ fontWeight: '500', color: '#374151' }}> {applicant.smoking ? "흡연자" : "비흡연자"}</Text>
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>반려동물: 
                          <Text style={{ fontWeight: '500', color: '#374151' }}> {applicant.pets ? "있음" : "없음"}</Text>
                        </Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {applicant.status === 'pending' && (
                        <>
                          <Button
                            onPress={() => handleAccept(applicant.id)}
                            style={{ backgroundColor: '#16a34a', paddingHorizontal: 16, paddingVertical: 8 }}
                          >
                            <Text style={{ color: 'white', fontSize: 14 }}>✓ 승인</Text>
                          </Button>
                          <Button
                            variant="outline"
                            onPress={() => handleReject(applicant.id)}
                            style={{ borderColor: '#dc2626', paddingHorizontal: 16, paddingVertical: 8 }}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                              <Ionicons name="close" size={14} color="#dc2626" />
                              <Text style={{ color: '#dc2626', fontSize: 14 }}>거절</Text>
                            </View>
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="outline"
                        onPress={() => onNavigateToProfile?.(applicant.id)}
                        style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                      >
                        <Text style={{ fontSize: 14 }}>👤 프로필 보기</Text>
                      </Button>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        {filteredApplicants.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#f3f4f6',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 32, color: '#9ca3af' }}>👤</Text>
            </View>
            <Text style={{ fontWeight: '500', marginBottom: 8 }}>
              {selectedFilter === 'all' ? '지원자가 없어요' : `${getStatusText(selectedFilter)} 지원자가 없어요`}
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
              {selectedFilter === 'all' 
                ? '아직 아무도 지원하지 않았습니다.' 
                : '다른 상태의 지원자를 확인해보세요.'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
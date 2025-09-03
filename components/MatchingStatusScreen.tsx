import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import { Gender, Lifestyle, Personality, Pets, RecruitStatus, Smoking, Snoring } from '@/types/enums';

interface MatchingStatusScreenProps {
  onBack: () => void;
  onNavigateToJob: (jobId: string) => void;
}

interface RecruitResponse{
  postId : number,
  title: string,
  viewed : number,
  bookmarked : number,
  createdAt : string,
  status : RecruitStatus,

  authorName : string,
  authorGender : Gender,
  birthdate : string,

  recruitCount : number
  hasRoom: boolean;  // true : 방있음, false : 함께 찾기
  rentalCostMin: number;
  rentalCostMax: number;
  monthlyCostMin: number;
  monthlyCostMax: number;

  preferedGender : Gender,
  preferedMinAge : number,
  preferedMaxAge : number,
  preferedLifeStyle?: Lifestyle;
  preferedPersonality?: Personality
  preferedSmoking?: Smoking
  preferedSnoring?: Snoring
  preferedHasPet?: Pets,

  address : string,
  latitude : Double,
  longitude : Double,

  detailDescript : string,
  additionalDescript : string,

   imgUrl: string[] | null;
}


export default function MatchingStatusScreen({ onBack, onNavigateToJob }: MatchingStatusScreenProps) {
  const [activeTab, setActiveTab] = useState('applied');

  const appliedJobs = [
    {
      id: "1",
      title: "강남역 근처 깔끔한 원룸",
      location: "서울 강남구 역삼동",
      author: "김민수",
      monthlyRent: 70,
      status: "지원 중",
      appliedAt: "2024-08-04",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: "2",
      title: "홍대 투룸 쉐어하실 분",
      location: "서울 마포구 홍익동",
      author: "이지영",
      monthlyRent: 45,
      status: "모집 완료",
      appliedAt: "2024-08-03",
      statusColor: "bg-gray-100 text-gray-800"
    }
  ];

  const matchedJobs = [
    {
      id: "3",
      title: "신촌 원룸 같이 살 친구 찾아요",
      location: "서울 서대문구 신촌동",
      author: "박준호",
      monthlyRent: 55,
      status: "매칭 완료",
      matchedAt: "2024-08-02",
      statusColor: "bg-green-100 text-green-800",
      participants: ["나", "박준호", "최서연"]
    }
  ];

  const invitedJobs = [
    {
      id: "4",
      title: "강서구 투룸 룸메이트 모집",
      location: "서울 강서구 화곡동",
      author: "정민지",
      monthlyRent: 60,
      status: "매칭 중",
      invitedAt: "2024-08-04",
      statusColor: "bg-yellow-100 text-yellow-800"
    }
  ];

  const tabs = [
    { id: 'applied', label: '지원한 구인글', count: appliedJobs.length },
    { id: 'matched', label: '매칭 완료', count: matchedJobs.length },
    { id: 'invited', label: '초대받은 구인글', count: invitedJobs.length }
  ];

  const renderJobCard = (job: any, showParticipants = false) => (
    <TouchableOpacity 
      key={job.id}
      onPress={() => onNavigateToJob(job.id)}
      activeOpacity={0.7}
    >
      <Card>
        <CardContent style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '500', fontSize: 14, marginBottom: 4 }}>{job.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>📍</Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.location}</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                작성자: {job.author} • 월세 {job.monthlyRent}만원
              </Text>
            </View>
            <Badge>
              <Text style={{ fontSize: 12 }}>
                {job.status}
              </Text>
            </Badge>
          </View>

          {showParticipants && job.participants && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>👥</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                참여자: {job.participants.join(', ')}
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>🕐</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                {job.appliedAt && `지원일: ${job.appliedAt}`}
                {job.matchedAt && `매칭일: ${job.matchedAt}`}
                {job.invitedAt && `초대일: ${job.invitedAt}`}
              </Text>
            </View>
            {job.status === '매칭 완료' && (
              <Text style={{ color: '#22c55e', fontSize: 16 }}>✓</Text>
            )}
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'applied':
        return (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
              내가 지원한 구인글 목록을 보여줍니다
            </Text>
            {appliedJobs.length > 0 ? (
              appliedJobs.map(job => renderJobCard(job))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                <View style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Text style={{ fontSize: 32, color: '#9ca3af' }}>👥</Text>
                </View>
                <Text style={{ color: '#6b7280', marginBottom: 4 }}>지원한 구인글이 없어요</Text>
                <Text style={{ fontSize: 14, color: '#9ca3af' }}>관심있는 구인글에 지원해보세요</Text>
              </View>
            )}
          </View>
        );
      
      case 'matched':
        return (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
              매칭이 완료된 구인글입니다
            </Text>
            {matchedJobs.length > 0 ? (
              matchedJobs.map(job => renderJobCard(job, true))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                <View style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Text style={{ fontSize: 32, color: '#9ca3af' }}>✓</Text>
                </View>
                <Text style={{ color: '#6b7280', marginBottom: 4 }}>매칭 완료된 구인글이 없어요</Text>
                <Text style={{ fontSize: 14, color: '#9ca3af' }}>채팅을 통해 매칭을 완료해보세요</Text>
              </View>
            )}
          </View>
        );
      
      case 'invited':
        return (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
              구인글 채팅방에 초대받은 경우의 목록입니다
            </Text>
            {invitedJobs.length > 0 ? (
              invitedJobs.map(job => renderJobCard(job))
            ) : (
              <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                <View style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <Text style={{ fontSize: 32, color: '#9ca3af' }}>🕐</Text>
                </View>
                <Text style={{ color: '#6b7280', marginBottom: 4 }}>초대받은 구인글이 없어요</Text>
                <Text style={{ fontSize: 14, color: '#9ca3af' }}>구인글에 지원하면 채팅방에 초대받을 수 있어요</Text>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>지원 상태</Text>
        </View>
      </View>

      <ScrollView style={{ padding: 16 }}>
        {/* 탭 네비게이션 */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#f3f4f6',
          padding: 4,
          borderRadius: 8,
          marginBottom: 24
        }}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: activeTab === tab.id ? '#F7B32B' : '#6b7280'
              }}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={{
                  backgroundColor: activeTab === tab.id ? 'rgba(247, 179, 43, 0.1)' : '#e5e7eb',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 10,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: activeTab === tab.id ? '#F7B32B' : '#6b7280'
                  }}>
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 컨텐츠 */}
        {renderContent()}
      </ScrollView>
    </View>
  );
}
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface BookmarkListScreenProps {
  onBack: () => void;
  onNavigateToJob: (jobId: string) => void;
}

export default function BookmarkListScreen({ onBack, onNavigateToJob }: BookmarkListScreenProps) {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([
    {
      id: "1",
      title: "강남역 근처 깔끔한 원룸 룸메이트 구해요",
      location: "서울 강남구 역삼동",
      author: "김민수",
      monthlyRent: 70,
      deposit: 1000,
      recruitCount: 1,
      totalCount: 2,
      status: "모집중",
      bookmarkedAt: "2024-08-04",
      tags: ["비흡연자", "아침형", "반려동물 없음"]
    },
    {
      id: "2",
      title: "홍대 투룸 쉐어하실 분!",
      location: "서울 마포구 홍익동",
      author: "이지영",
      monthlyRent: 45,
      deposit: 500,
      recruitCount: 1,
      totalCount: 3,
      status: "모집중",
      bookmarkedAt: "2024-08-03",
      tags: ["반려동물 환영", "저녁형", "비흡연자"]
    },
    {
      id: "3",
      title: "신촌 원룸 같이 살 친구 찾아요",
      location: "서울 서대문구 신촌동",
      author: "박준호",
      monthlyRent: 55,
      deposit: 800,
      recruitCount: 2,
      totalCount: 3,
      status: "모집완료",
      bookmarkedAt: "2024-08-02",
      tags: ["학생 선호", "아침형", "비흡연자"]
    }
  ]);



  const handleRemoveBookmark = (jobId: string) => {
    setBookmarkedJobs(prev => prev.filter(job => job.id !== jobId));
    Alert.alert('알림', '북마크가 해제되었습니다');
  };

  const handleRemoveAllBookmarks = () => {
    Alert.alert(
      '확인',
      '모든 북마크를 해제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '확인', 
          onPress: () => {
            setBookmarkedJobs([]);
            Alert.alert('알림', '모든 북마크가 해제되었습니다');
          }
        }
      ]
    );
  };



  const displayedJobs = [...bookmarkedJobs]
    .sort((a, b) => new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime());

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
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>북마크 목록</Text>
          <Badge variant="secondary">
            {bookmarkedJobs.length}
          </Badge>
        </View>
      </View>



      <ScrollView style={{ padding: 16 }}>
        {/* 북마크 목록 */}
        {displayedJobs.length > 0 ? (
          <View style={{ gap: 16 }}>
            {displayedJobs.map((job) => (
              <TouchableOpacity 
                key={job.id}
                onPress={() => onNavigateToJob(job.id)}
                activeOpacity={0.7}
              >
                <Card>
                  <CardContent style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '500', fontSize: 14, lineHeight: 20, marginBottom: 4 }}>{job.title}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                          <Ionicons name="location" size={12} color="#6b7280" />
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.location}</Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>
                          작성자: {job.author} • 북마크: {job.bookmarkedAt}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleRemoveBookmark(job.id)}
                        style={{
                          padding: 4,
                          backgroundColor: '#fef3e2',
                          borderRadius: 4,
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="heart" size={16} color="#F7B32B" />
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>보증금</Text>
                        <Text style={{ fontSize: 12, fontWeight: '500', marginLeft: 4 }}>{job.deposit}만원</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>월세</Text>
                        <Text style={{ fontSize: 12, fontWeight: '500', marginLeft: 4 }}>{job.monthlyRent}만원</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>👥</Text>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.recruitCount}/{job.totalCount}명</Text>
                      </View>
                      <Badge 
                        variant={job.status === "모집중" ? "default" : "secondary"}
                      >
                        {job.status}
                      </Badge>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
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
              <Text style={{ fontSize: 32, color: '#9ca3af' }}>♡</Text>
            </View>
            <Text style={{ color: '#6b7280', marginBottom: 4 }}>북마크한 구인글이 없어요</Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', marginBottom: 16 }}>관심있는 구인글을 북마크해보세요</Text>
            <Button 
              onPress={() => onNavigateToJob('home')}
              variant="outline"
            >
              구인글 둘러보기
            </Button>
          </View>
        )}

        {/* 하단 액션 */}
        {bookmarkedJobs.length > 0 && (
          <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
            <Button 
              variant="outline" 
              style={{ width: '100%' }}
              onPress={handleRemoveAllBookmarks}
            >
              전체 해제
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
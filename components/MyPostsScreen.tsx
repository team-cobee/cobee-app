import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MyPostsScreenProps {
  onBack: () => void;
  onNavigateToJob: (jobId: string) => void;
  onNavigateToApplicants?: (jobId: string) => void;
  onNavigateToEdit?: (jobId: string) => void;
}

export default function MyPostsScreen({ onBack, onNavigateToJob, onNavigateToApplicants, onNavigateToEdit }: MyPostsScreenProps) {
  const [myPosts, setMyPosts] = useState([
    {
      id: "1",
      title: "홍대 근처 투룸 쉐어하실 분!",
      location: "서울 마포구 홍익동",
      monthlyRent: 45,
      deposit: 1000,
      roomType: "투룸",
      moveInDate: "2024.03.15",
      status: "모집중",
      views: 156,
      interests: 12,
      applicants: 5,
      timeAgo: "2일 전",
      description: "홍대입구역 도보 5분 거리 투룸에서 같이 살 룸메이트를 찾고 있어요!",
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"]
    },
    {
      id: "2", 
      title: "강남역 신축 오피스텔 룸메이트 구해요",
      location: "서울 강남구 역삼동",
      monthlyRent: 85,
      deposit: 2000,
      roomType: "원룸",
      moveInDate: "2024.04.01",
      status: "모집중",
      views: 203,
      interests: 8,
      applicants: 3,
      timeAgo: "5일 전",
      description: "강남역 신축 오피스텔에서 깔끔하게 살 룸메이트 찾아요.",
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"]
    },
    {
      id: "3",
      title: "이대 근처 원룸 같이 살 사람 구합니다",
      location: "서울 서대문구 신촌동",
      monthlyRent: 55,
      deposit: 1500,
      roomType: "원룸",
      moveInDate: "2024.03.20",
      status: "매칭완료",
      views: 89,
      interests: 15,
      applicants: 0,
      timeAgo: "1주 전",
      description: "이대 도보 10분 거리 깔끔한 원룸입니다.",
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"]
    }
  ]);


  const handleDeleteClick = (postId: string) => {
    const post = myPosts.find(p => p.id === postId);
    Alert.alert(
      '구인글 삭제',
      `정말로 "${post?.title}" 구인글을 삭제하시겠습니까? 삭제된 구인글은 복구할 수 없습니다.`,
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '삭제하기',
          style: 'destructive',
          onPress: () => handleDeleteConfirm(postId)
        }
      ]
    );
  };

  const handleDeleteConfirm = (postId: string) => {
    setMyPosts(prev => prev.filter(post => post.id !== postId));
    // TODO: 실제 API 호출로 서버에서 삭제
    console.log('Deleted post:', postId);
  };

  const handleCardClick = (postId: string) => {
    onNavigateToJob(postId);
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
            <Text style={{ fontSize: 18, fontWeight: '600' }}>내 구인글</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ padding: 16 }}>
        {/* 통계 */}
        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#F7B32B' }}>{myPosts.length}</Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>총 구인글</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#16a34a' }}>
                  {myPosts.filter(post => post.status === "모집중").length}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>모집중</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#2563eb' }}>
                  {myPosts.filter(post => post.status === "매칭완료").length}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>매칭완료</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 구인글 목록 */}
        <View style={{ gap: 16 }}>
          {myPosts.map((post) => (
            <Card key={post.id}>
              <CardContent style={{ padding: 0 }}>
                <TouchableOpacity onPress={() => handleCardClick(post.id)} activeOpacity={0.7}>
                  <View style={{ position: 'relative' }}>
                    <Image 
                      source={{ uri: post.images[0] }}
                      style={{ width: '100%', height: 200, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                      resizeMode="cover"
                    />
                    <View style={{ position: 'absolute', top: 12, left: 12 }}>
                      <Badge style={{
                        backgroundColor: post.status === "모집중" ? 'rgba(34, 197, 94, 0.1)' : post.status === "매칭완료" ? 'rgba(37, 99, 235, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}>
                        <Text style={{
                          color: post.status === "모집중" ? '#16a34a' : post.status === "매칭완료" ? '#2563eb' : '#6b7280',
                          fontSize: 12,
                          fontWeight: '500',
                        }}>
                          {post.status}
                        </Text>
                      </Badge>
                    </View>
                    <View style={{ position: 'absolute', top: 12, right: 12 }}>
                      <TouchableOpacity 
                        onPress={(e) => {
                          e.stopPropagation();
                          Alert.alert(
                            '메뉴',
                            '원하는 작업을 선택하세요',
                            [
                              {
                                text: `지원자 보기 (${post.applicants})`,
                                onPress: () => onNavigateToApplicants?.(post.id)
                              },
                              {
                                text: '수정하기',
                                onPress: () => onNavigateToEdit?.(post.id)
                              },
                              {
                                text: '삭제하기',
                                style: 'destructive',
                                onPress: () => handleDeleteClick(post.id)
                              },
                              {
                                text: '취소',
                                style: 'cancel'
                              }
                            ]
                          );
                        }}
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          padding: 8,
                          borderRadius: 4,
                        }}
                      >
                        <Ionicons name="ellipsis-horizontal" size={16} color="#6b7280" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ fontWeight: '600', fontSize: 16, flex: 1 }}>
                        {post.title}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                      <Ionicons name="location" size={12} color="#6b7280" />
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.location}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Ionicons name="calendar" size={12} color="#6b7280" />
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.moveInDate}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Ionicons name="home" size={12} color="#6b7280" />
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.roomType}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <View>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#F7B32B' }}>
                          월 {post.monthlyRent}만원
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6b7280', marginLeft: 8 }}>
                          보증금 {post.deposit}만원
                        </Text>
                      </View>
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 12,
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: '#e5e7eb',
                    }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="eye" size={12} color="#6b7280" />
                          <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.views}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="chatbubble" size={12} color="#6b7280" />
                          <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.interests}</Text>
                        </View>
                        <TouchableOpacity 
                          onPress={(e) => {
                            e.stopPropagation();
                            onNavigateToApplicants?.(post.id);
                          }}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                        >
                          <Ionicons name="person" size={12} color={post.applicants > 0 ? '#F7B32B' : '#6b7280'} />
                          <Text style={{
                            fontSize: 14,
                            color: post.applicants > 0 ? '#F7B32B' : '#6b7280',
                            fontWeight: post.applicants > 0 ? '500' : 'normal',
                          }}>
                            {post.applicants}명 지원
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.timeAgo}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </CardContent>
            </Card>
          ))}
        </View>

        {myPosts.length === 0 && (
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
              <Ionicons name="chatbubble-outline" size={32} color="#9ca3af" />
            </View>
            <Text style={{ fontWeight: '500', marginBottom: 8 }}>작성한 구인글이 없어요</Text>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 16, textAlign: 'center' }}>
              첫 번째 구인글을 작성해보세요!
            </Text>
            <Button 
              style={{ backgroundColor: '#F7B32B', paddingHorizontal: 16, paddingVertical: 12 }}
              onPress={() => {/* 구인글 작성 화면으로 이동 */}}
            >
              <Text style={{ color: 'white' }}>구인글 작성하기</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
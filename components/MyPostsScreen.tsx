import React, { useState, useEffect } from 'react';
import { api } from '@/api/api';
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
import { RecruitStatus } from '@/types/enums';

interface MyPostsScreenProps {
  onBack: () => void;
  onNavigateToJob: (jobId: number) => void;
  onNavigateToApplicants?: (jobId: number) => void;
  onNavigateToEdit?: (jobId: number) => void;
}

export default function MyPostsScreen({ onBack, onNavigateToJob, onNavigateToApplicants, onNavigateToEdit }: MyPostsScreenProps) {
  const [myPosts, setMyPosts] = useState<post[]>([]);

  interface post {
    postId : number,
    title : string, 
    address : string, 
    createdAt : string,
    monthlyCostMin : number,
    monthlyCostMax : number,
    rentalCostMin : number,
    rentalCostMax : number,
    viewd : number,
    status : RecruitStatus,
    comments : [],
    imgUrl? : string[] | "test"
  }

  useEffect(() => {
    let cancelled = false;
  
    const fetchMyInfo = async () => {
      try {
        const res = await api.get('/recruits/my'); 
        if (!cancelled) setMyPosts(res.data?.data);
      } catch (error) {
        console.error(error);
        Alert.alert('에러', '나의 구인글 정보를 불러오지 못했습니다.');
      }
    };
    fetchMyInfo();          
  
    return () => {        
      cancelled = true;
    };
    }, []);   


  const handleDeleteClick = (postId: number) => {
    const post = myPosts.find(p => p.postId === postId);
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

  const handleDeleteConfirm = (postId: number) => {
    setMyPosts(prev => prev.filter(post => post.postId !== postId));
    // TODO: 실제 API 호출로 서버에서 삭제
    console.log('Deleted post:', postId);
  };

  const handleCardClick = (postId: number) => {
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
                  {myPosts.filter(post => post.status === RecruitStatus.Recruiting).length}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>모집중</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#2563eb' }}>
                  {myPosts.filter(post => post.status === RecruitStatus.RecruitOver).length}
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>매칭완료</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 구인글 목록 */}
        <View style={{ gap: 16 }}>
          {myPosts.map((post) => (
            <Card key={post.postId}>
              <CardContent style={{ padding: 0 }}>
                <TouchableOpacity onPress={() => handleCardClick(post.postId)} activeOpacity={0.7}>
                  <View style={{ position: 'relative' }}>
                    <Image 
                      //source={{ uri: post.imgUrl[0] }}
                      style={{ width: '100%', height: 200, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                      resizeMode="cover"
                    />
                    <View style={{ position: 'absolute', top: 12, left: 12 }}>
                      <Badge style={{
                        backgroundColor: post.status === RecruitStatus.Recruiting ? 'rgba(34, 197, 94, 0.1)' : post.status === RecruitStatus.RecruitOver ? 'rgba(37, 99, 235, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                      }}>
                        <Text style={{
                          color: post.status === RecruitStatus.Recruiting ? '#16a34a' : post.status === RecruitStatus.RecruitOver ? '#2563eb' : '#6b7280',
                          fontSize: 12,
                          fontWeight: '500',
                        }}>
                          {post.status}
                        </Text>
                      </Badge>
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
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.address}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Ionicons name="calendar" size={12} color="#6b7280" />
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.createdAt}</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <View>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#F7B32B' }}>
                          월 {post.monthlyCostMin}만원~
                        </Text>
                        <Text style={{ fontSize: 14, color: '#6b7280', marginLeft: 8 }}>
                          보증금 {post.rentalCostMin}만원~
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
                          <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.viewd}</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="chatbubble" size={12} color="#6b7280" />
                          <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.interests}</Text>
                        </View> */}
                        <TouchableOpacity 
                          onPress={(e) => {
                            e.stopPropagation();
                            onNavigateToApplicants?.(post.postId);
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
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>{post.createdAt}</Text>
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
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeScreenProps {
  onNavigateToJob?: (jobId: string) => void;
  onNavigateToCreateJob?: () => void;
  onNavigateToBookmarks?: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#000000',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  newsScroll: {
    paddingBottom: 8,
  },
  newsCard: {
    width: 280,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  newsImageContainer: {
    position: 'relative',
  },
  newsImage: {
    width: '100%',
    height: 128,
  },
  newsGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
  },
  newsTextOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  newsSubtitle: {
    fontSize: 12,
    color: '#e5e5e5',
  },
  jobsList: {
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  jobCardContent: {
    padding: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 4,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobMetaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  bookmarkButton: {
    padding: 4,
  },
  heartIcon: {
    fontSize: 16,
    color: '#9ca3af',
  },
  heartFilled: {
    color: '#ef4444',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6b7280',
  },
  priceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceItem: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: 'rgba(4,2,19,0.54)',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeStatus: {
    backgroundColor: '#F7B32B',
  },
  inactiveStatus: {
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  actionSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#F7B32B',
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: 8,
    color: '#ffffff',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  actionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});

export default function HomeScreen({ onNavigateToJob, onNavigateToCreateJob, onNavigateToBookmarks }: HomeScreenProps) {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set(['2']));

  const toggleBookmark = (jobId: string) => {
    const newBookmarked = new Set(bookmarkedJobs);
    if (newBookmarked.has(jobId)) {
      newBookmarked.delete(jobId);
      Alert.alert('알림', '북마크가 해제되었습니다');
    } else {
      newBookmarked.add(jobId);
      Alert.alert('알림', '북마크에 추가되었습니다');
    }
    setBookmarkedJobs(newBookmarked);
  };
  const newsCards = [
    {
      id: 1,
      title: "2024 전세 시장 동향",
      subtitle: "청년층 주거 트렌드 분석",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "룸메이트와 함께하는 절약 팁",
      subtitle: "생활비 50% 절약하기",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop"
    }
  ];

  const recommendedJobs = [
    {
      id: "1",
      title: "강남역 근처 깔끔한 원룸 룸메이트 구해요",
      nickname: "김민수",
      location: "서울 강남구 역삼동",
      depositMin: 800,
      depositMax: 1200,
      monthlyRentMin: 60,
      monthlyRentMax: 80,
      age: "20대 중반",
      gender: "남성",
      lifestyle: "아침형",
      smoking: false,
      pets: false,
      recruitCount: 3,
      roomType: "방 있음",
      tags: ["비흡연자", "반려동물 없음", "아침형"],
      timeAgo: "2시간 전",
      status: "모집중"
    },
    {
      id: "2", 
      title: "홍대 근처 투룸 쉐어하실 분!",
      nickname: "이지영",
      location: "서울 마포구 홍익동",
      depositMin: 500,
      depositMax: 500,
      monthlyRentMin: 45,
      monthlyRentMax: 45,
      age: "20대 후반",
      gender: "여성",
      lifestyle: "저녁형",
      smoking: false,
      pets: true,
      recruitCount: 1,
      roomType: "방 있음",
      tags: ["반려동물 환영", "저녁형", "비흡연자"],
      timeAgo: "5시간 전",
      status: "모집중"
    },
    {
      id: "no-room",
      title: "홍대 근처에서 함께 방 찾을 룸메이트 구해요",
      nickname: "이서연",
      location: "서울 마포구 홍대 일대",
      depositMin: 1000,
      depositMax: 1500,
      monthlyRentMin: 50,
      monthlyRentMax: 80,
      age: "20대 초반",
      gender: "여성",
      lifestyle: "저녁형",
      smoking: false,
      pets: true,
      recruitCount: 2,
      roomType: "함께 찾기",
      tags: ["애완동물 동반", "저녁형", "비흡연자"],
      timeAgo: "1시간 전",
      status: "모집중"
    },
    {
      id: "3",
      title: "신촌 원룸 같이 살 친구 찾아요",
      nickname: "박준호",
      location: "서울 서대문구 신촌동",
      depositMin: 800,
      depositMax: 800,
      monthlyRentMin: 55,
      monthlyRentMax: 55,
      age: "20대 초반",
      gender: "남성",
      lifestyle: "아침형",
      smoking: false,
      pets: false,
      recruitCount: 2,
      roomType: "방 있음",
      tags: ["학생 선호", "아침형", "비흡연자"],
      timeAgo: "1일 전",
      status: "모집중"
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 환영 메시지 */}
      <LinearGradient
        colors={['rgba(247,179,43,0.1)', 'rgba(247,179,43,0.79)']}
        style={styles.welcomeSection}
      >
        <Text style={styles.welcomeTitle}>안녕하세요! 👋</Text>
        <Text style={styles.welcomeSubtitle}>완벽한 룸메이트를 찾아보세요</Text>
      </LinearGradient>

      {/* 카드 뉴스 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최신 소식</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.newsScroll}>
          {newsCards.map((news) => (
            <View key={news.id} style={styles.newsCard}>
              <View style={styles.newsImageContainer}>
                <Image
                  source={{ uri: news.image }}
                  style={styles.newsImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={styles.newsGradient}
                />
                <View style={styles.newsTextOverlay}>
                  <Text style={styles.newsTitle}>{news.title}</Text>
                  <Text style={styles.newsSubtitle}>{news.subtitle}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 추천 구인글 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>추천 구인글</Text>
        </View>

        <View style={styles.jobsList}>
          {recommendedJobs.map((job) => (
            <TouchableOpacity 
              key={job.id} 
              style={styles.jobCard}
              onPress={() => onNavigateToJob?.(job.id)}
            >
              <View style={styles.jobCardContent}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style={styles.jobMeta}>
                      <Text style={styles.jobMetaText}>{job.nickname}</Text>
                      <Text style={styles.jobMetaText}> • </Text>
                      <Text style={styles.jobMetaText}>{job.timeAgo}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => toggleBookmark(job.id)}
                    style={styles.bookmarkButton}
                  >
                    <Text style={[styles.heartIcon, bookmarkedJobs.has(job.id) && styles.heartFilled]}>♥</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={14} color="#6b7280" />
                  <Text style={styles.locationText}>{job.location}</Text>
                </View>

                <View style={styles.priceGrid}>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>보증금</Text>
                    <Text style={styles.priceValue}>
                      {job.depositMin === job.depositMax 
                        ? `${job.depositMin}만원`
                        : `${job.depositMin}~${job.depositMax}만원`
                      }
                    </Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>월세</Text>
                    <Text style={styles.priceValue}>
                      {job.monthlyRentMin === job.monthlyRentMax 
                        ? `${job.monthlyRentMin}만원`
                        : `${job.monthlyRentMin}~${job.monthlyRentMax}만원`
                      }
                    </Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>방 여부</Text>
                    <Text style={styles.priceValue}>{job.roomType}</Text>
                  </View>
                </View>

                <View style={styles.tagsContainer}>
                  {job.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.jobFooter}>
                  <View style={styles.jobStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="people" size={12} color="#6b7280" />
                      <Text style={styles.statText}>{job.recruitCount}명</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statText}>{job.age}</Text>
                      <Text style={styles.statText}> • </Text>
                      <Text style={styles.statText}>{job.gender}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, job.status === "모집중" ? styles.activeStatus : styles.inactiveStatus]}>
                    <Text style={styles.statusText}>{job.status}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 빠른 액션 버튼 */}
      <View style={styles.actionSection}>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => onNavigateToCreateJob?.()}
            style={[styles.actionButton, styles.primaryButton]}
          >
            <Ionicons name="add" size={16} color="white" />
            <Text style={styles.actionButtonText}>구인글 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => onNavigateToBookmarks?.()}
            style={[styles.actionButton, styles.secondaryButton]}
          >
            <Ionicons name="bookmark-outline" size={16} color="#6b7280" />
            <Text style={styles.actionButtonTextSecondary}>북마크 목록</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
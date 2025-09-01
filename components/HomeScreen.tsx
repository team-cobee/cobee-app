import React, { useState, useEffect } from 'react';
import { Gender, Lifestyle, Snoring, Smoking, Personality, Pets } from '@/types/enums';
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/api/api';

interface HomeScreenProps {
  onNavigateToJob?: (jobId: number) => void;
  onNavigateToCreateJob?: () => void;
  onNavigateToBookmarks?: () => void;
}

interface RecruitResponse{
  id : number,
  title: string;
  authorName : string,
  createdBefore : number, // n 시간전
  address: string;
  rentCostMin: number;
  rentCostMax: number;
  monthlyCostMin: number;
  monthlyCostMax: number;
  hasRoom: boolean;  // true : 방있음, false : 함께 찾기 
  lifestyle?: Lifestyle;
  personality?: Personality
  isSmoking?: Smoking
  isSnoring?: Snoring
  isPetsAllowed?: Pets
  recruitCount : number
  authorAgeRange : string;   // 20대 초반...
  authorGender : Gender
}

export default function HomeScreen({
  onNavigateToJob,
  onNavigateToCreateJob,
  onNavigateToBookmarks,
}: HomeScreenProps) {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());
  const [recruits, setRecruits] = useState<RecruitResponse[]>([]);

  useEffect(() => {
    const fetchRecruits = async () => {
      try {
        const res = await api.get('/recruits'); // @GetMapping("")
        setRecruits(res.data.data); // ApiResponse.success() 안에 data로 내려오는 구조라 가정
      } catch (error) {
        console.error(error);
        Alert.alert('에러', '구인글을 불러오지 못했습니다');
      }
    };

    fetchRecruits();
  }, []);

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

  const recommendedJobs = [
    {
      id: '1',
      title: '중구 오피스텔 깔끔한 공간',
      location: '중구 명동',
      monthlyRent: 55,
      tags: ['오피스텔', '중간형', '비흡연', '반려동물 없음'],
    },
    {
      id: '2',
      title: '신촌 투룸 쉐어하실 분',
      location: '서대문구 신촌동',
      monthlyRent: 60,
      tags: ['투룸', '저녁형', '비흡연'],
    },
  ];

  const newsList = [
    {
      id: 1,
      title: '2024 전세 시장 동향 - 청년층 주거 트렌드 분석',
      date: '2024.08.17',
    },
    {
      id: 2,
      title: '2024 전세 시장 동향 - 청년층 주거 트렌드 분석',
      date: '2024.08.17',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 환영 섹션 */}
      <View style={styles.welcomeSection}>
        <View style={styles.logoContainer}>
          <Image
          source={require('@/assets/bee.png')}
          style={styles.beeIcon}
          resizeMode="contain"
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.brandName}>Cobee</Text>
        </View>
      </View>
        
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeTitle}>이주연님,</Text>
          <Text style={styles.welcomeSubtitle}>
            오늘은 어떤 룸메이트를 찾으시나요?
          </Text>
        </View>
      </View>

      {/* 액션 버튼 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => onNavigateToBookmarks?.()}
          style={[styles.actionButton, styles.secondaryButton, {flexDirection: 'column'}]}
        >
          <Ionicons name="bookmark-outline" size={20} color="#000" /> 
          <Text style={styles.actionButtonTextSecondary}>북마크 목록</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onNavigateToCreateJob?.()}
          style={[styles.actionButton, styles.primaryButton, {flexDirection: 'column'}]}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>구인글 등록</Text>
        </TouchableOpacity>
      </View>

      {/* 추천 구인글 */}
      {/* 추천 구인글 */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>추천 구인글</Text>

  <ScrollView
    horizontal
    pagingEnabled       // ← 한 번에 하나씩만 보이게
    showsHorizontalScrollIndicator={false}
    decelerationRate="fast"
    snapToAlignment="center" // 카드가 중앙에 딱 맞게
  >
    {recruits.map((job) => (
      <TouchableOpacity
        key={job.id}
        style={styles.jobCard}
        onPress={() => onNavigateToJob?.(job.id)}
      >
        <View style={styles.jobCardContent}>
          {/* 제목 */}
          <Text style={styles.jobTitle}>{job.title}</Text>

          {/* 주소 */}
          <Text style={styles.jobLocation}>{job.address}</Text>

          {/* 월세 */}
          <Text style={styles.jobPrice}>
            월 {job.monthlyCostMin}~{job.monthlyCostMax}만원
          </Text>

          {/* 태그 */}
          <View style={styles.tagsContainer}>
            {job.isSmoking && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>흡연: {job.isSmoking}</Text>
              </View>
            )}
            {job.isPetsAllowed && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>반려동물: {job.isPetsAllowed}</Text>
              </View>
            )}
            {job.personality && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>성격: {job.personality}</Text>
              </View>
            )}
            {job.lifestyle && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>라이프스타일: {job.lifestyle}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>


      {/* 최신 소식 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 소식</Text>
        {newsList.map((news) => (
          <View key={news.id} style={styles.newsItem}>
            <Text style={styles.newsText}>{news.title}</Text>
            <Text style={styles.newsDate}>{news.date}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  welcomeSection: {
    flexDirection: 'row',       // 가로 배치
    alignItems: 'center',
    padding: 24,
    marginHorizontal : 20,
    marginVertical : 20,
    backgroundColor: '#FFF8E6', // 기존 배경색 유지
  },
  beeIcon: {
    width: 120,    // 기존보다 크게
    height: 120,
    marginLeft: -15,
    marginRight: 30,
  },
  brandName: {
  position: 'absolute',
  bottom: 12,      // 벌 이미지의 하단
  right: 22,     // 살짝 오른쪽으로 빼주기
  fontSize: 18,
  fontWeight: '700',
  color: 'black',
},
  logoContainer: {
  position: 'relative',
  marginRight: 20,
},
  welcomeTitle: { fontSize: 20, fontWeight: '600', color: '#000' },
  welcomeSubtitle: { fontSize: 14, color: '#000' , flexShrink:1},
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 4,
    gap: 12,
  },
  actionButton: {
  flex: 1,
  height: 80,      
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},
  primaryButton: { backgroundColor: '#F7B32B' },
  secondaryButton: { backgroundColor: '#f3f4f6' },
  actionButtonText: { fontSize: 14, fontWeight: '500', color: '#fff' },
  actionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  section: { paddingHorizontal: 24, paddingVertical: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  jobCard: {
    width: SCREEN_WIDTH - 60,   // 양 옆 여백 주면서 화면에 하나씩만 보이도록
    marginHorizontal: 30,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  jobCardContent: { padding: 16 },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: { fontSize: 14, fontWeight: '500', flex: 1, marginRight: 8 },
  jobLocation: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  jobPrice: { fontSize: 12, fontWeight: '500', marginBottom: 8 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: { fontSize: 12, color: '#555' },
  newsItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  newsText: { fontSize: 14, fontWeight: '500' },
  newsDate: { fontSize: 12, color: '#888' },
  bookmarkButton: { padding: 4 },
  heartIcon: { fontSize: 16, color: '#9ca3af' },
  heartFilled: { color: '#ef4444' },
});

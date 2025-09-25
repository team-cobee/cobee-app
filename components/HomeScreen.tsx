import React, { useState, useEffect } from 'react';
import { Gender, Lifestyle, Snoring, Smoking, Personality, Pets, SocialType } from '@/types/enums';
import { Dimensions } from 'react-native';
import { AxiosResponse } from "axios";
const { width: SCREEN_WIDTH } = Dimensions.get('window');
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/api/api';

interface HomeScreenProps {
  onNavigateToJob?: (jobId: number) => void;
  onNavigateToCreateJob?: () => void;
  onNavigateToBookmarks?: () => void;
}

interface RecruitResponse{
  postId : number,
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

// API 응답 원형 타입
interface ApiRecommendationResponse {
  member_id: number;
  recommendations: ApiRecommendationItem[];
  count: number;
  source: string;
  timestamp: string;
};

interface ApiRecommendationItem {
  recruit_post_id: number;
  score: number;
  post_details: {
    title: string | null;
    address: string;
    has_room: boolean;
    monthly_cost_min: number;
    monthly_cost_max: number;
  };
  created_at: string;
};

// 당신이 쓰고 싶은 프론트용 타입
interface RecommendPost {
  postId: number;
  title: string | null;                
  address: string;
  hasRoom: boolean;                   
  monthlyCostMin: number;              
  monthlyCostMax: number;             
}

interface user { // api 명세에 맞게 수정
    id : number;
    name : string;
    email : string;
    birthDate : string;
    gender : Gender;
    socialType : SocialType;
    isCompleted : Boolean;
    ocrValidation : Boolean;
    isHost : Boolean;
};

export default function HomeScreen({
  onNavigateToJob,
  onNavigateToCreateJob,
  onNavigateToBookmarks,
}: HomeScreenProps) {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Set<string>>(new Set());
  const [recruits, setRecruits] = useState<RecruitResponse[] | null>([]);
  const [userInfo, setUserInfo] = useState<user | null>(null);
  const [recommend, setRecommend] = useState<RecommendPost[] | null>([]);

  // useEffect(() => {
  //   const fetchRecruits = async () => {
  //     try {
  //       const res = await api.get('/recruits'); // @GetMapping("")
  //       setRecruits(res.data?.data); // ApiResponse.success() 안에 data로 내려오는 구조라 가정
  //     } catch (error) {
  //       console.error(error);
  //       Alert.alert('에러', '구인글을 불러오지 못했습니다');
  //     }
  //   };

  //   fetchRecruits();
  // }, []);



  const fetchRecommendations = async(userId: number) => {
    // 백엔드가 member_id를 **query**로 받는다면:
    try {
      const res = await api.get(`http://34.64.191.177:8000/recommend/${userId}?limit=5`);
      const items = res.data?.recommendations ?? [];

    // snake_case → camelCase & 평탄화
      const mapped: RecommendPost[] = items.map((it : ApiRecommendationItem) => ({
      postId: it.recruit_post_id,
      title: it.post_details.title ?? null,
      address: it.post_details.address,
      hasRoom: it.post_details.has_room,
      monthlyCostMin: it.post_details.monthly_cost_min,
      monthlyCostMax: it.post_details.monthly_cost_max,
    }));
    console.log("------------1")
    console.log(mapped);
    setRecommend(mapped);

  } catch (err: any) {
    const status = err?.response?.status;
    const msg = err?.response?.data?.detail || err?.message || "요청 실패";
    console.warn(`[fetchRecommendations] ${status ?? ""} ${msg}`);
    throw err;
  }
}

  useEffect(() => {
  let cancelled = false;
  (async () => {
    try {
      const res = await api.get('/auth');
      if (!cancelled) setUserInfo(res.data?.data);
    } catch (error) {
      console.error(error);
      Alert.alert('에러', '사용자 정보를 불러오지 못했습니다.');
    }
  })();
  return () => { cancelled = true; };
}, []);

  useEffect(() => {
    if (!userInfo?.id) return;           
    fetchRecommendations(userInfo.id);
  }, [userInfo?.id]);

  
  const openLink = async (url?: string) => {
  if (!url) return;
  const can = await Linking.canOpenURL(url);
  if (can) {
    await Linking.openURL(url);
  } else {
    console.warn(`Cannot open URL: ${url}`);
  }
};

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

  const newsList = [
    {
      id: 1,
      title: '청약 접수 43%가 서울…쏠림 최고조',
      date: '2025.09.25',
      url : 'https://n.news.naver.com/mnews/article/032/0003399015'
    },
    {
      id: 2,
      title: '“젊은 부부∙청년들 이제 어쩌나”...공급부족에 전세난 우려 커지는 마포구',
      date: '2025.08.17',
      url : 'https://www.mk.co.kr/news/realestate/11428310'
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
          <Text style={styles.welcomeTitle}>{userInfo?.name}님,</Text>
          <Text style={styles.welcomeSubtitle}>
            오늘은 어떤 룸메이트를 찾으시나요?
          </Text>
        </View>
      </View>

      {/* 액션 버튼 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          //onPress={() => onNavigateToBookmarks?.()}
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


<View style={styles.section}>
  <Text style={styles.sectionTitle}>추천 구인글</Text>

  <ScrollView
    horizontal
    pagingEnabled       // ← 한 번에 하나씩만 보이게
    showsHorizontalScrollIndicator={false}
    decelerationRate="fast"
    snapToAlignment="center" // 카드가 중앙에 딱 맞게
  >
    {recommend?.map((job, idx) => {
  const key = `recruit-${job.postId ?? 'noid'}-${idx}`; // ← 고유 key 생성 (id 중복 대비)
  return (
    <TouchableOpacity
      key={key}
      style={styles.jobCard}
      onPress={() => onNavigateToJob?.(job.postId)} 
    >
      <View style={styles.jobCardContent}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobLocation}>{job.address}</Text>
        <Text style={styles.jobPrice}>
          월 {job.monthlyCostMin}~{job.monthlyCostMax}만원
        </Text>
      </View>
    </TouchableOpacity>
  );
})}
  </ScrollView>
</View>


    {/* 최신 소식 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 소식</Text>

        {newsList.map((news, idx) => {
          const clickable = !!news.url;
          return (
            <TouchableOpacity
              key={`news-${news.id}-${idx}`}
              style={styles.newsItem}
              activeOpacity={clickable ? 0.6 : 1}
              onPress={() => openLink(news.url)}
              disabled={!clickable}
            >
              <Text style={[styles.newsText]}>
                {news.title}
              </Text>
              <Text style={styles.newsDate}>{news.date}</Text>
            </TouchableOpacity>
          );
        })}
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

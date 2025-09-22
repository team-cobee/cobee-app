import React, { useEffect, useMemo, useState } from 'react';
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
import { Snoring, Smoking, Gender, Lifestyle, Personality, Pets, MatchStatus, RecruitStatus } from '@/types/enums';
import { api } from '@/api/api';

interface BookmarkListScreenProps {
  onBack: () => void;
  onNavigateToJob: (jobId: string) => void;
}

/** ▼▼ 데이터 소스 스위치 ▼▼
 * true  = 더미 데이터 사용
 * false = 실제 API 호출 (아래 fetch 경로만 맞춰주면 됨)
 */
const USE_MOCK = true;

// 서버 주소/엔드포인트는 환경에 맞게 수정
const API_BASE_URL = 'http://localhost:8080';
const BOOKMARKS_ENDPOINT = `${API_BASE_URL}/bookmarks`;

/** 서버/모의 공통 아이템 타입 */
interface BookmarkJob {
  id: number;
  title: string;
  location: string;
  author: string;
  monthlyRent: number;
  deposit: number;
  recruitCount: number;
  totalCount: number;
  status: RecruitStatus  
  bookmarkedAt: string;    

  // enum 기반 태그 생성을 위한 (선택) 필드들
  smoking?: Smoking;
  lifestyle?: Lifestyle;
  pets?: Pets;
  snoring?: Snoring;
  gender?: Gender;
  personality?: Personality;

  // 화면용 생성 필드
  tags?: string[];
}

/** enum → 태그 문자열 생성기 (필요한 것만 추가/수정 가능) */
function buildTagsFromEnums(job: Partial<BookmarkJob>): string[] {
  const tags: string[] = [];

  // 흡연
  if (job.smoking) {
    if (job.smoking === Smoking.NotSmoke) tags.push('비흡연자');
    if (job.smoking === Smoking.Smoke) tags.push('흡연자');
    if (job.smoking === Smoking.Impossible) tags.push('흡연자 안됨');
    if (job.smoking === Smoking.None) tags.push('흡연 상관없음');
  }

  // 생활패턴
  if (job.lifestyle) {
    if (job.lifestyle === Lifestyle.Morning) tags.push('아침형');
    if (job.lifestyle === Lifestyle.Evening) tags.push('저녁형');
    if (job.lifestyle === Lifestyle.None) tags.push('생활습관 상관없음');
  }

  // 반려동물
  if (job.pets) {
    if (job.pets === Pets.NotHave) tags.push('반려동물 없음');
    if (job.pets === Pets.Have) tags.push('반려동물 환영');
    if (job.pets === Pets.Possible) tags.push('반려동물 가능');
    if (job.pets === Pets.Impossible) tags.push('반려동물 불가');
  }

  // 코골이
  if (job.snoring) {
    if (job.snoring === Snoring.NoSnore) tags.push('코골이 없음');
    if (job.snoring === Snoring.Snore) tags.push('코골이 있음');
    if (job.snoring === Snoring.None) tags.push('코골이 상관없음');
  }

  // 성격(원하면 표시)
  if (job.personality) {
    if (job.personality === Personality.Introvert) tags.push('내향적');
    if (job.personality === Personality.Extrovert) tags.push('외향적');
    if (job.personality === Personality.None) tags.push('성격 상관없음');
  }

  return tags;
}

/** 상태 → 표시 문자열 */
function statusLabel(s: RecruitStatus): string {
  switch (s) {
    case RecruitStatus.Recruiting:
      return '모집중';
    case RecruitStatus.RecruitOver:
      return '모집완료';
    default:
      return String(s);
  }
}

/** ▼▼ 테스트 더미 데이터 ▼▼ */
const MOCK_JOBS: BookmarkJob[] = [
  {
    id: 1,
    title: "신촌역 근처 깔끔한 원룸 룸메이트 구해요",
    location: "서울 강남구 역삼동",
    author: "이주연",
    monthlyRent: 70,
    deposit: 1000,
    recruitCount: 1,
    totalCount: 2,
    status: RecruitStatus.Recruiting, // ← 모집중
    bookmarkedAt: "2024-08-04",
    smoking: Smoking.None,
    lifestyle: Lifestyle.None,
    pets: Pets.NotHave,
  },
  {
    id: 2,
    title: "숙대 투룸 쉐어하실 분!",
    location: "서울 마포구 홍익동",
    author: "장희주",
    monthlyRent: 45,
    deposit: 500,
    recruitCount: 1,
    totalCount: 3,
    status: RecruitStatus.RecruitOver, 
    bookmarkedAt: "2024-08-03",
    smoking: Smoking.NotSmoke,
    lifestyle: Lifestyle.Evening,
    pets: Pets.Have,
  },
  {
    id: 3,
    title: "서울역 원룸 같이 살 친구 찾아요",
    location: "서울 서대문구 신촌동",
    author: "최혜진",
    monthlyRent: 55,
    deposit: 800,
    recruitCount: 2,
    totalCount: 3,
    status: RecruitStatus.RecruitOver, 
    bookmarkedAt: "2024-08-02",
    lifestyle: Lifestyle.Morning,
    smoking: Smoking.NotSmoke,
  },
];

export default function BookmarkListScreen({ onBack, onNavigateToJob }: BookmarkListScreenProps) {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<BookmarkJob[]>([]);

  // 데이터 로드
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        if (USE_MOCK) {
          // 더미 데이터 + 태그 생성
          const withTags = MOCK_JOBS.map(j => ({ ...j, tags: buildTagsFromEnums(j) }));
          if (mounted) setBookmarkedJobs(withTags);
        } else {
          // 실제 API 호출 (엔드포인트/스키마는 서버에 맞게 수정)
          const res = await fetch(BOOKMARKS_ENDPOINT, { method: 'GET' });
          if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`응답 오류(${res.status}) ${text}`);
          }
          const data: any[] = await res.json();

          // 서버 응답 → 화면용 구조로 정규화
          const normalized: BookmarkJob[] = (Array.isArray(data) ? data : []).map((d) => {
            const item: BookmarkJob = {
              id: Number(d.id),
              title: d.title ?? '',
              location: d.location ?? '',
              author: d.author ?? '',
              monthlyRent: Number(d.monthlyRent ?? 0),
              deposit: Number(d.deposit ?? 0),
              recruitCount: Number(d.recruitCount ?? 0),
              totalCount: Number(d.totalCount ?? 0),
              status: (d.status as RecruitStatus) ?? RecruitStatus.Recruiting,
              bookmarkedAt: d.bookmarkedAt ?? new Date().toISOString().slice(0, 10),
              smoking: d.smoking as Smoking | undefined,
              lifestyle: d.lifestyle as Lifestyle | undefined,
              pets: d.pets as Pets | undefined,
              snoring: d.snoring as Snoring | undefined,
              gender: d.gender as Gender | undefined,
              personality: d.personality as Personality | undefined,
            };
            return { ...item, tags: buildTagsFromEnums(item) };
          });

          if (mounted) setBookmarkedJobs(normalized);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setBookmarkedJobs([]); // 실패 시 빈 배열
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const handleRemoveBookmark = (jobId: number) => {
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

  const displayedJobs = useMemo(
    () =>
      [...bookmarkedJobs].sort(
        (a, b) => new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
      ),
    [bookmarkedJobs]
  );

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
                onPress={() => onNavigateToJob(String(job.id))}
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
                      {(job.tags ?? []).map((tag) => (
                        <Badge key={`${job.id}-${tag}`} variant="secondary">
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
                        variant={job.status === RecruitStatus.RecruitOver ? 'secondary' : 'default'}
                      >
                        {statusLabel(job.status)}
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

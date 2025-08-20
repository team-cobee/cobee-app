import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface SearchScreenProps {
  onBack: () => void;
  onNavigateToJob: (jobId: string) => void;
}

export default function SearchScreen({ onBack, onNavigateToJob }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([
    '강남역 원룸',
    '홍대 투룸',
    '신촌',
    '여성 룸메이트'
  ]);

  const popularSearches = [
    '강남구', '마포구', '원룸', '투룸', '여성', '남성', '비흡연자', '반려동물'
  ];

  const allJobs = [
    {
      id: "1",
      title: "강남역 근처 깔끔한 원룸 룸메이트 구해요",
      location: "강남구 역삼동",
      monthlyRent: 70,
      author: "김민수",
      timeAgo: "2시간 전",
      status: "모집중"
    },
    {
      id: "2",
      title: "홍대 투룸 쉐어하실 분 찾아요",
      location: "마포구 홍익동", 
      monthlyRent: 45,
      author: "이지영",
      timeAgo: "1일 전",
      status: "모집중"
    },
    {
      id: "3",
      title: "신촌 여성 룸메이트 구합니다",
      location: "서대문구 신촌동",
      monthlyRent: 55,
      author: "박수진",
      timeAgo: "3시간 전",
      status: "모집중"
    },
    {
      id: "4",
      title: "종로구 오피스텔 깔끔한 공간",
      location: "종로구 명륜동",
      monthlyRent: 85,
      author: "최준호",
      timeAgo: "5시간 전",
      status: "모집중"
    }
  ];

  const filteredJobs = searchQuery.trim() 
    ? allJobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !searchHistory.includes(query.trim())) {
      setSearchHistory([query.trim(), ...searchHistory.slice(0, 9)]);
    }
  };

  const removeFromHistory = (item: string) => {
    setSearchHistory(searchHistory.filter(h => h !== item));
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* 헤더 */}
      <View style={{
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingTop: 50,
        zIndex: 10,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <View style={{ flex: 1, position: 'relative' }}>
            <View style={{ position: 'absolute', left: 12, top: 14, zIndex: 2 }}>
              <Ionicons name="search" size={16} color="#9ca3af" />
            </View>
            <TextInput
              placeholder="구인글, 지역, 작성자로 검색..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              style={{
                paddingLeft: 40,
                paddingRight: searchQuery ? 40 : 12,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                fontSize: 16,
                backgroundColor: '#ffffff',
              }}
              autoFocus
            />
            {searchQuery && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 12, top: 14 }}
              >
                <Ionicons name="close" size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <ScrollView style={{ padding: 16 }}>
        {/* 검색 결과 */}
        {searchQuery.trim() && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontWeight: '500', fontSize: 16, marginBottom: 12 }}>
              검색 결과 ({filteredJobs.length}개)
            </Text>
            {filteredJobs.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <Text style={{ color: '#6b7280', fontSize: 16 }}>검색 결과가 없습니다.</Text>
                <Text style={{ fontSize: 14, color: '#9ca3af' }}>다른 키워드로 검색해보세요.</Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {filteredJobs.map((job) => (
                  <TouchableOpacity 
                    key={job.id}
                    onPress={() => onNavigateToJob(job.id)}
                    activeOpacity={0.7}
                  >
                    <Card>
                      <CardContent style={{ padding: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text style={{ fontWeight: '500', fontSize: 14, flex: 1, marginRight: 8 }}>{job.title}</Text>
                          <Badge>
                            <Text style={{ fontSize: 12 }}>{job.status}</Text>
                          </Badge>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <Ionicons name="location" size={12} color="#6b7280" />
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.location}</Text>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>•</Text>
                          <Ionicons name="time" size={12} color="#6b7280" />
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.timeAgo}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 14, fontWeight: '500' }}>{job.monthlyRent}만원</Text>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.author}</Text>
                        </View>
                      </CardContent>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 검색 기록 */}
        {!searchQuery.trim() && searchHistory.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontWeight: '500', fontSize: 16 }}>최근 검색</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>모두 삭제</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 8 }}>
              {searchHistory.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 }}>
                  <TouchableOpacity 
                    onPress={() => handleSearch(item)}
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 16, color: '#9ca3af', marginRight: 8 }}>🕒</Text>
                    <Text style={{ fontSize: 14 }}>{item}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => removeFromHistory(item)}
                    style={{ padding: 4, borderRadius: 4 }}
                  >
                    <Ionicons name="close" size={16} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 인기 검색어 */}
        {!searchQuery.trim() && (
          <View>
            <Text style={{ fontWeight: '500', fontSize: 16, marginBottom: 12 }}>인기 검색어</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {popularSearches.map((term, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSearch(term)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 20,
                    backgroundColor: '#ffffff',
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 14, color: '#374151' }}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
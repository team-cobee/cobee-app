import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";

interface MapScreenProps {
  onBack?: () => void;
  onNavigateToJob?: (jobId: string) => void;
  onNavigateToSearch?: () => void;
  mapScreenState?: {
    showFilters: boolean;
    showSearch: boolean;
    appliedFilters: string[];
  };
  setMapScreenState?: React.Dispatch<
    React.SetStateAction<{
      showFilters: boolean;
      showSearch: boolean;
      appliedFilters: string[];
    }>
  >;
}

interface Filters {
  maxRent: number[];
  maxDeposit: number[];
  lifestyle: string[];
  smoking: boolean | null;
  pets: boolean | null;
}

export default function MapScreen({
  onNavigateToJob,
  mapScreenState,
  setMapScreenState,
}: MapScreenProps) {

  // 하단 고정 "근처 구인글" 블록 컴포넌트
  const BottomJobBlock = () => (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: 8,
    }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={toggleBottomSheet}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontWeight: '600', fontSize: 16 }}>
            {searchQuery && searchQuery.trim() !== ""
              ? `'${searchQuery}' 검색 결과`
              : "근처 구인글"}
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#9ca3af',
            transform: [{
              rotate: sheetState === "expanded" ? '180deg' : '0deg'
            }],
          }}>
            ⌄
          </Text>
        </View>
        <View style={{
          backgroundColor: '#f3f4f6',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            {Array.isArray(filteredJobs) ? filteredJobs.length : 0}개
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Bottom Sheet 컴포넌트
  const JobListSheet = () => (
    <View
      ref={sheetRef}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 80 + BOTTOM_BLOCK_HEIGHT,
        height: getHeightForState(sheetState),
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 20,
        zIndex: 30,
      }}
    >
      {/* 드래그 핸들 */}
      <View style={{
        alignItems: 'center',
        paddingVertical: 8,
      }}>
        <View style={{
          width: 48,
          height: 4,
          backgroundColor: '#d1d5db',
          borderRadius: 2,
        }} />
      </View>

      {/* 구인글 리스트 */}
      <View
        style={{
          flex: 1,
          opacity: sheetState === "collapsed" ? 0 : 1,
          height: getHeightForState(sheetState) - 65,
        }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
        >
          {filteredJobs.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Text style={{ fontSize: 32, color: '#d1d5db', marginBottom: 8 }}>📍</Text>
              <Text style={{ color: '#6b7280' }}>조건에 맞는 구인글이 없습니다.</Text>
              <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 4 }}>
                필터를 조정해보세요.
              </Text>
            </View>
          ) : (
            <View>
              {filteredJobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  onPress={() => onNavigateToJob?.(job.id)}
                  style={{
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f9fafb',
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '500', fontSize: 16, marginBottom: 4, color: '#111827' }}>
                        {job.title}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>📍 {job.location}</Text>
                        <Text style={{ fontSize: 14, color: '#6b7280' }}>• {job.distance}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
                          보증금 {job.deposit} • 월세 {job.monthlyRent}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>방금 전</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Badge style={{
                          backgroundColor: '#f3f4f6',
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 4,
                        }}>
                          <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.roomType}</Text>
                        </Badge>
                        {job.lifestyle && (
                          <Badge style={{
                            backgroundColor: '#f3f4f6',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.lifestyle}</Text>
                          </Badge>
                        )}
                        {!job.smoking && (
                          <Badge style={{
                            backgroundColor: '#f3f4f6',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>비흡연자</Text>
                          </Badge>
                        )}
                        {!job.pets && (
                          <Badge style={{
                            backgroundColor: '#f3f4f6',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>반려동물 없음</Text>
                          </Badge>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    maxRent: [100],
    maxDeposit: [2000],
    lifestyle: [],
    smoking: null,
    pets: null,
  });

  // Bottom sheet states
  const [sheetState, setSheetState] = useState<
    "collapsed" | "partial" | "expanded"
  >("collapsed");
  const sheetRef = useRef<any>(null);

  // Height values for different states
  const screenHeight = Dimensions.get('window').height;
  const COLLAPSED_HEIGHT = 0; // 하단 고정 블록만 보이도록 설정
  const PARTIAL_HEIGHT = 300;
  const BOTTOM_BLOCK_HEIGHT = 60; // 하단 고정 블록 높이
  const EXPANDED_HEIGHT = screenHeight - 64 - 80 - BOTTOM_BLOCK_HEIGHT; // 전체 화면에서 헤더(64px), 네비게이션(80px), 하단 블록(60px) 제외

  // 필터 적용 시 추가되는 높이
  const FILTER_BAR_HEIGHT = (mapScreenState?.appliedFilters?.length || 0) > 0 ? 80 : 0;

  const areas = [
    {
      id: "gangnam",
      name: "강남구",
      count: 23,
      lat: 37.5173,
      lng: 127.0473,
    },
    {
      id: "mapo",
      name: "마포구",
      count: 15,
      lat: 37.5663,
      lng: 126.9014,
    },
    {
      id: "seodaemun",
      name: "서대문구",
      count: 8,
      lat: 37.5791,
      lng: 126.9368,
    },
    {
      id: "jongno",
      name: "종로구",
      count: 12,
      lat: 37.5735,
      lng: 126.9788,
    },
    {
      id: "jung",
      name: "중구",
      count: 6,
      lat: 37.5636,
      lng: 126.997,
    },
  ];

  const allJobs = [
    {
      id: "1",
      title: "강남역 근처 깔끔한 원룸",
      location: "강남구 역삼동",
      monthlyRent: 70,
      deposit: 1000,
      author: "김민수",
      distance: "0.3km",
      roomType: "원룸",
      lifestyle: "아침형",
      smoking: false,
      pets: false,
    },
    {
      id: "2",
      title: "홍대 투룸 쉐어",
      location: "마포구 홍익동",
      monthlyRent: 45,
      deposit: 500,
      author: "이지영",
      distance: "0.8km",
      roomType: "투룸",
      lifestyle: "올빼미형",
      smoking: false,
      pets: true,
    },
    {
      id: "3",
      title: "종로 쓰리룸 넓은 공간",
      location: "종로구 명륜동",
      monthlyRent: 85,
      deposit: 1500,
      author: "박준호",
      distance: "1.2km",
      roomType: "쓰리룸",
      lifestyle: "아침형",
      smoking: true,
      pets: false,
    },
    {
      id: "4",
      title: "중구 오피스텔 깔끔한 공간",
      location: "중구 명동",
      monthlyRent: 55,
      deposit: 800,
      author: "최수영",
      distance: "0.5km",
      roomType: "오피스텔",
      lifestyle: "중간형",
      smoking: false,
      pets: false,
    },
  ];

  const filteredJobs = allJobs.filter((job) => {
    // 검색 필터
    if (
      searchQuery &&
      !job.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !job.location
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // 월세 필터
    if (job.monthlyRent > filters.maxRent[0]) return false;

    // 보증금 필터
    if (job.deposit > filters.maxDeposit[0]) return false;

    // 생활패턴 필터
    if (
      filters.lifestyle.length > 0 &&
      !filters.lifestyle.includes(job.lifestyle)
    )
      return false;

    // 흡연 필터
    if (
      filters.smoking !== null &&
      job.smoking !== filters.smoking
    )
      return false;

    // 반려동물 필터
    if (filters.pets !== null && job.pets !== filters.pets)
      return false;

    return true;
  });

  // 디버깅: 필터링 조건 로그
  console.log("현재 필터 조건:", {
    maxRent: filters.maxRent[0],
    maxDeposit: filters.maxDeposit[0],
    lifestyle: filters.lifestyle,
    smoking: filters.smoking,
    pets: filters.pets,
    searchQuery: searchQuery
  });
  console.log("필터링 결과:", filteredJobs.length, "개");
  console.log("전체 구인글:", allJobs.length, "개");

  const applyFilters = () => {
    const newAppliedFilters: string[] = [];

    if (filters.maxRent[0] < 100) {
      newAppliedFilters.push(
        `월세 ${filters.maxRent[0]}만원 이하`,
      );
    }
    if (filters.maxDeposit[0] < 2000) {
      newAppliedFilters.push(
        `보증금 ${filters.maxDeposit[0]}만원 이하`,
      );
    }
    if (filters.lifestyle.length > 0) {
      newAppliedFilters.push(...filters.lifestyle);
    }
    if (filters.smoking === false) {
      newAppliedFilters.push("비흡연자");
    }
    if (filters.smoking === true) {
      newAppliedFilters.push("흡연자");
    }
    if (filters.pets === false) {
      newAppliedFilters.push("반려동물 없음");
    }
    if (filters.pets === true) {
      newAppliedFilters.push("반려동물 있음");
    }

    setMapScreenState?.((prev) => ({
      ...prev,
      appliedFilters: newAppliedFilters,
      showFilters: false,
    }));

    // 필터 적용 후 Bottom Sheet를 partial 상태로 설정하여 결과를 확인할 수 있게 함
    if (sheetState === "collapsed") {
      setSheetState("partial");
    }
  };

  const clearFilters = () => {
    setFilters({
      maxRent: [100],
      maxDeposit: [2000],
      lifestyle: [],
      smoking: null,
      pets: null,
    });
    setMapScreenState?.((prev) => ({
      ...prev,
      appliedFilters: [],
    }));
  };

  const removeFilter = (filterToRemove: string) => {
    setMapScreenState?.((prev) => ({
      ...prev,
      appliedFilters: (prev.appliedFilters || []).filter(
        (filter) => filter !== filterToRemove,
      ),
    }));
  };

  const toggleLifestyle = (lifestyle: string) => {
    setFilters((prev) => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(lifestyle)
        ? prev.lifestyle.filter((type) => type !== lifestyle)
        : [...prev.lifestyle, lifestyle],
    }));
  };

  const getHeightForState = (state: typeof sheetState) => {
    const baseHeight = (() => {
      switch (state) {
        case "collapsed":
          return COLLAPSED_HEIGHT;
        case "partial":
          return PARTIAL_HEIGHT;
        case "expanded":
          return EXPANDED_HEIGHT - FILTER_BAR_HEIGHT; // 필터 바 높이만큼 조정
        default:
          return COLLAPSED_HEIGHT;
      }
    })();
    
    return baseHeight;
  };



  const toggleBottomSheet = () => {
    if (sheetState === "collapsed") {
      setSheetState("partial");
    } else if (sheetState === "partial") {
      setSheetState("expanded");
    } else {
      setSheetState("collapsed");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* 검색 바 */}
      {mapScreenState?.showSearch && (
        <View style={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          padding: 16,
        }}>
          <View style={{ position: 'relative' }}>
            <View style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}>
              <Ionicons name="search" size={16} color="#9ca3af" />
            </View>
            <TextInput
              placeholder="지역, 구인글 제목으로 검색..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{
                paddingLeft: 40,
                paddingRight: searchQuery ? 40 : 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                backgroundColor: '#ffffff',
              }}
            />
            {searchQuery && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={{ position: 'absolute', right: 12, top: 12 }}
              >
                <Ionicons name="close" size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* 적용된 필터 */}
      {(mapScreenState?.appliedFilters?.length || 0) > 0 && (
        <View style={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          padding: 16,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '500' }}>
              적용된 필터
            </Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={{ fontSize: 12, color: '#F7B32B', textDecorationLine: 'underline' }}>
                모두 지우기
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {mapScreenState?.appliedFilters?.map((filter, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Badge style={{
                    backgroundColor: '#f3f4f6',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <Text style={{ fontSize: 12, color: '#374151' }}>{filter}</Text>
                    <TouchableOpacity onPress={() => removeFilter(filter)}>
                      <Ionicons name="close" size={12} color="#6b7280" />
                    </TouchableOpacity>
                  </Badge>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* 필터 패널 */}
      <Modal
        visible={mapScreenState?.showFilters || false}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setMapScreenState?.(prev => ({ ...prev, showFilters: false }))}
      >
        <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>필터</Text>
            <TouchableOpacity onPress={() => setMapScreenState?.(prev => ({ ...prev, showFilters: false }))}>
              <Ionicons name="close" size={16} color="#000000" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 24 }}>
          {/* 월세 */}
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
              월세 (만원)
            </Text>
            <Slider
              value={filters.maxRent}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  maxRent: value,
                }))
              }
              max={150}
              min={10}
              step={10}
            />
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>
              {filters.maxRent[0]}만원 이하
            </Text>
          </View>

          {/* 보증금 */}
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
              보증금 (만원)
            </Text>
            <Slider
              value={filters.maxDeposit}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  maxDeposit: value,
                }))
              }
              max={3000}
              min={100}
              step={100}
            />
            <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>
              {filters.maxDeposit[0]}만원 이하
            </Text>
          </View>

          {/* 생활패턴 */}
          <View>
            <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
              생활패턴
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {["아침형", "올빼미형", "중간형"].map((lifestyle) => (
                <TouchableOpacity key={lifestyle} onPress={() => toggleLifestyle(lifestyle)}>
                  <Badge
                    style={{
                      backgroundColor: filters.lifestyle.includes(lifestyle) ? '#F7B32B' : 'transparent',
                      borderWidth: 1,
                      borderColor: filters.lifestyle.includes(lifestyle) ? '#F7B32B' : '#d1d5db',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 16,
                    }}
                  >
                    <Text style={{
                      color: filters.lifestyle.includes(lifestyle) ? '#ffffff' : '#6b7280',
                      fontSize: 14,
                    }}>
                      {lifestyle}
                    </Text>
                  </Badge>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 흡연/반려동물 */}
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
                흡연
              </Text>
              <View style={{ gap: 8 }}>
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                  onPress={() => setFilters((prev) => ({
                    ...prev,
                    smoking: prev.smoking === false ? null : false,
                  }))}
                >
                  <Checkbox
                    checked={filters.smoking === false}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        smoking: checked ? false : null,
                      }))
                    }
                  />
                  <Text style={{ fontSize: 14 }}>비흡연자</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                  onPress={() => setFilters((prev) => ({
                    ...prev,
                    smoking: prev.smoking === true ? null : true,
                  }))}
                >
                  <Checkbox
                    checked={filters.smoking === true}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        smoking: checked ? true : null,
                      }))
                    }
                  />
                  <Text style={{ fontSize: 14 }}>흡연자</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 12 }}>
                반려동물
              </Text>
              <View style={{ gap: 8 }}>
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                  onPress={() => setFilters((prev) => ({
                    ...prev,
                    pets: prev.pets === false ? null : false,
                  }))}
                >
                  <Checkbox
                    checked={filters.pets === false}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        pets: checked ? false : null,
                      }))
                    }
                  />
                  <Text style={{ fontSize: 14 }}>없음</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                  onPress={() => setFilters((prev) => ({
                    ...prev,
                    pets: prev.pets === true ? null : true,
                  }))}
                >
                  <Checkbox
                    checked={filters.pets === true}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        pets: checked ? true : null,
                      }))
                    }
                  />
                  <Text style={{ fontSize: 14 }}>있음</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 필터 적용 버튼 */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              variant="outline"
              onPress={clearFilters}
              style={{ flex: 1 }}
            >
              초기화
            </Button>
            <Button
              onPress={applyFilters}
              style={{
                flex: 1,
                backgroundColor: "#F7B32B",
              }}
            >
              <Text style={{ color: 'white' }}>적용하기</Text>
            </Button>
          </View>
          </ScrollView>
        </View>
      </Modal>

      {/* 메인 지도 영역 */}
      <View style={{ flex: 1, position: 'relative', backgroundColor: '#f3f4f6' }}>
        {/* 백그라운드 오버레이 */}
        {(sheetState === "partial" || sheetState === "expanded") && (
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
              opacity: sheetState === "expanded" ? 0.4 : sheetState === "partial" ? 0.2 : 0,
              zIndex: 10,
            }}
            onPress={() => setSheetState("collapsed")}
            activeOpacity={1}
          />
        )}

        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#dcfce7', // light green background
        }}>
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 48, color: '#9ca3af', marginBottom: 8 }}>📍</Text>
              <Text style={{ color: '#6b7280', fontSize: 16 }}>지도 영역</Text>
              <Text style={{ color: '#9ca3af', fontSize: 14 }}>
                실제 구현 시 지도 API 연동
              </Text>
            </View>
          </View>
        </View>

        {/* 지역별 핀 표시 (목업) */}
        {areas.map((area) => (
          <TouchableOpacity
            key={area.id}
            onPress={() => console.log('Area selected:', area.id)}
            style={{
              position: 'absolute',
              backgroundColor: "#F7B32B",
              borderRadius: 16,
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              top: `${30 + Math.random() * 40}%`,
              left: `${20 + Math.random() * 60}%`,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
              {area.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Sheet - 네이버 지도 스타일 */}
      <View
        ref={sheetRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 80 + BOTTOM_BLOCK_HEIGHT, // 네비게이션 바 높이(80px) + 하단 블록 높이만큼 띄움
          height: getHeightForState(sheetState),
          backgroundColor: '#ffffff',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 20,
          zIndex: 30,
        }}
      >
        {/* 드래그 핸들 */}
        <View style={{
          alignItems: 'center',
          paddingVertical: 8,
        }}>
          <View style={{
            width: 48,
            height: 4,
            backgroundColor: '#d1d5db',
            borderRadius: 2,
          }} />
        </View>


        {/* 구인글 리스트 */}
        <View
          style={{
            flex: 1,
            opacity: sheetState === "collapsed" ? 0 : 1,
            height: getHeightForState(sheetState) - 65, // 헤더 높이만큼 조정
          }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
          >
            {filteredJobs.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 48 }}>
                <Text style={{ fontSize: 32, color: '#d1d5db', marginBottom: 8 }}>📍</Text>
                <Text style={{ color: '#6b7280' }}>조건에 맞는 구인글이 없습니다.</Text>
                <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 4 }}>
                  필터를 조정해보세요.
                </Text>
              </View>
            ) : (
              <View>
                {filteredJobs.map((job) => (
                  <TouchableOpacity
                    key={job.id}
                    onPress={() => onNavigateToJob?.(job.id)}
                    style={{
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f9fafb',
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '500', fontSize: 16, marginBottom: 4, color: '#111827' }}>
                          {job.title}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <Text style={{ fontSize: 14, color: '#6b7280' }}>📍 {job.location}</Text>
                          <Text style={{ fontSize: 14, color: '#6b7280' }}>• {job.distance}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            color: "#F7B32B"
                          }}>
                            월 {job.monthlyRent}만원
                          </Text>
                          <Text style={{ fontSize: 14, color: '#6b7280' }}>
                            {job.author}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                          <Badge style={{
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.roomType}</Text>
                          </Badge>
                          <Badge style={{
                            backgroundColor: 'transparent',
                            borderWidth: 1,
                            borderColor: '#d1d5db',
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 4,
                          }}>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>{job.lifestyle}</Text>
                          </Badge>
                          {!job.smoking && (
                            <Badge style={{
                              backgroundColor: 'transparent',
                              borderWidth: 1,
                              borderColor: '#d1d5db',
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 4,
                            }}>
                              <Text style={{ fontSize: 12, color: '#6b7280' }}>비흡연</Text>
                            </Badge>
                          )}
                          {!job.pets && (
                            <Badge style={{
                              backgroundColor: 'transparent',
                              borderWidth: 1,
                              borderColor: '#d1d5db',
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 4,
                            }}>
                              <Text style={{ fontSize: 12, color: '#6b7280' }}>반려동물 없음</Text>
                            </Badge>
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* 하단 고정 "근처 구인글" 블록 */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 8,
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={toggleBottomSheet}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontWeight: '600', fontSize: 16 }}>
              {searchQuery && searchQuery.trim() !== ""
                ? `'${searchQuery}' 검색 결과`
                : "근처 구인글"}
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#9ca3af',
              transform: [{
                rotate: sheetState === "expanded" ? '180deg' : '0deg'
              }],
            }}>
              ⌄
            </Text>
          </View>
          <View style={{
            backgroundColor: '#f3f4f6',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <Text style={{ fontSize: 14, color: '#6b7280' }}>
              {Array.isArray(filteredJobs) ? filteredJobs.length : 0}개
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 구인글 목록 Bottom Sheet */}
      <JobListSheet />

      {/* 하단 고정 "근처 구인글" 블록 */}
      <BottomJobBlock />
    </View>
  );
}
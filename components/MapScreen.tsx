import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { api } from "@/api/api";
import { getCurrentLatLngOnce } from './location';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Double, Float } from "react-native/Libraries/Types/CodegenTypes";
import { Gender, Lifestyle, Personality, Pets, RecruitStatus, Smoking, Snoring } from "@/types/enums";

interface filterDto {
  latitude?: Double;
  longitude?: Double;
  radius?: Double;
  recruitCount?: number;
  rentCostMin?: number;
  rentCostMax?: number;
  monthlyCostMin?: number;
  monthlyCostMax?: number;
}

interface RecruitResponse {
  postId: number;
  title: string;
  createdAt: string;
  status: RecruitStatus;
  authorId: number;
  authorName: string;
  authorGender: Gender;
  birthdate: string;
  recruitCount: number;
  hasRoom: boolean;
  rentalCostMin: number;
  rentalCostMax: number;
  monthlyCostMin: number;
  monthlyCostMax: number;
  preferedGender: Gender;
  preferedMinAge: number;
  preferedMaxAge: number;
  preferedLifeStyle?: Lifestyle;
  preferedPersonality?: Personality;
  preferedSmoking?: Smoking;
  preferedSnoring?: Snoring;
  preferedHasPet?: Pets;
  address: string;
  latitude: Double;
  longitude: Double;
  detailDescript: string;
  additionalDescript: string;
  imgUrl: string[] | null;
}

const toQuery = (params: Record<string, any>) => {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) {
      v.forEach((item) => qp.append(k, String(item)));
    } else {
      qp.append(k, String(v));
    }
  });
  return qp.toString();
};

const fetchRecruitPosts = async (params: filterDto) => {
  const qs = toQuery(params);
  const data = await api.get(`/posts/filter${qs ? `?${qs}` : ""}`);
  console.log(data.data);
  return data.data;
};

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

export default function MapScreen({
  onNavigateToJob,
  mapScreenState,
  setMapScreenState,
}: MapScreenProps) {
  const screenHeight = Dimensions.get("window").height;
  // const [region, setRegion] = useState<Region>({
  //   latitude: 37.5665,
  //   longitude: 126.978,
  //   latitudeDelta: 0.05,
  //   longitudeDelta: 0.05,
  // });
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [centerReady, setCenterReady] = useState(false);
  const [posts, setPosts] = useState<RecruitResponse[]>([]);
  const [currentLatitude, setLatitude] = useState<Float>();
  const [currentLongitude, setLongitude] = useState<Float>();
    const initialCenterRef = useRef<{ lat: Float; lng: Float } | null>({
    lat: currentLatitude,
    lng: currentLongitude
  });

  // 필터 상태 관리 개선
  const [appliedFilters, setAppliedFilters] = useState<{
    radius?: number;
    rentRange?: [number, number];
    depositRange?: [number, number];
    peopleCount?: number;
  }>({});

  async function initMyPosition() {
  try {
    const { latitude, longitude } = await getCurrentLatLngOnce();
    console.log('현재 좌표:', latitude, longitude);
    setLatitude(currentLatitude);
    setLongitude(currentLongitude);
    console.log('저장 좌표:', currentLatitude, currentLongitude);
  } catch (err) {
    console.warn(err);
    // 필요시 에러 코드에 따라 안내
    // if (err instanceof LocationError && err.code === 'SERVICES_OFF') { ... }
  }
}

  // 임시 필터 값들 (모달에서 사용)
  const [tempRadius, setTempRadius] = useState<number>(2);
  const [tempRentRange, setTempRentRange] = useState<[number, number]>([10, 100]);
  const [tempDepositRange, setTempDepositRange] = useState<[number, number]>([1000, 3500]);
  const [tempPeopleCount, setTempPeopleCount] = useState<number>(4);

  const [sheetState, setSheetState] = useState<"collapsed" | "partial" | "expanded">("collapsed");
  const sheetRef = useRef<any>(null);
  const COLLAPSED_HEIGHT = 0;
  const PARTIAL_HEIGHT = 300;
  const BOTTOM_BLOCK_HEIGHT = 60;
  const EXPANDED_HEIGHT = screenHeight - 64 - 80 - BOTTOM_BLOCK_HEIGHT;
  const FILTER_BAR_HEIGHT = 0; // 오버레이 제거

  const getHeightForState = (state: typeof sheetState) => {
    switch (state) {
      case "collapsed":
        return COLLAPSED_HEIGHT;
      case "partial":
        return PARTIAL_HEIGHT;
      case "expanded":
        return EXPANDED_HEIGHT - FILTER_BAR_HEIGHT;
      default:
        return COLLAPSED_HEIGHT;
    }
  };

  const toggleBottomSheet = () => {
    if (sheetState === "collapsed") setSheetState("partial");
    else if (sheetState === "partial") setSheetState("expanded");
    else setSheetState("collapsed");
  };

  const [searchQuery, setSearchQuery] = useState("");

  // 모달 상태
  const [openRadius, setOpenRadius] = useState(false);
  const [openRent, setOpenRent] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openPeople, setOpenPeople] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 데이터 로드 함수
  const loadRecruits = useCallback(async (filterParams?: filterDto) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let data;
      if (filterParams && Object.keys(filterParams).length > 0) {
        // 필터가 있으면 /posts/filter 호출
        data = await fetchRecruitPosts(filterParams);
      } else {
        // 필터가 없으면 /recruits 호출
        const res = await api.get('/recruits');
        data = res.data?.data;
      }
      setPosts(data || []);
      console.log('Loaded posts:', data);
    } catch (error) {
      console.error('Error loading recruits:', error);
      setErrorMsg('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    loadRecruits();
    initMyPosition();
  }, [loadRecruits]);

  // 필터 파라미터 생성
  const buildFilterParams = useCallback((): filterDto => {
  const center = initialCenterRef.current!;
  const params: filterDto = {
    latitude: center.lat,
    longitude: center.lng,
  };

  if (appliedFilters.radius !== undefined) {
    // ✅ 서버가 km 기대 → km로 보냄 (곱하기 1000 제거)
    params.radius = Math.round(appliedFilters.radius);
  }
  if (appliedFilters.peopleCount !== undefined) {
    params.recruitCount = appliedFilters.peopleCount;
  }
  if (appliedFilters.depositRange !== undefined) {
    params.rentCostMin = appliedFilters.depositRange[0];
    params.rentCostMax = appliedFilters.depositRange[1];
  }
  if (appliedFilters.rentRange !== undefined) {
    params.monthlyCostMin = appliedFilters.rentRange[0];
    params.monthlyCostMax = appliedFilters.rentRange[1];
  }

  return params;
}, [appliedFilters]);


  // 필터가 변경될 때마다 API 호출
  useEffect(() => {
    const hasFilters = Object.keys(appliedFilters).length > 0;
    if (hasFilters) {
      const filterParams = buildFilterParams();
      loadRecruits(filterParams);
    } else {
      loadRecruits();
    }
  }, [appliedFilters, buildFilterParams, loadRecruits]);

  const filteredJobs = Array.isArray(posts)
  ? posts.filter((job) => {
      if (
        searchQuery &&
        !job.title?.toLowerCase?.().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
  : [];

  // 필터 버튼 컴포넌트
  const TopLeftFilters = () => {
    const fmtKm = (v: number) => (v >= 1 ? `${v}km` : `${Math.round(v * 1000)}m`);
    
    const radiusLabel = appliedFilters.radius !== undefined ? `~ ${fmtKm(appliedFilters.radius)}` : "반경";
    const rentLabel = appliedFilters.rentRange !== undefined ? `${appliedFilters.rentRange[0]}만원 ~ ${appliedFilters.rentRange[1]}만원` : "월세";
    const depositLabel = appliedFilters.depositRange !== undefined ? `${appliedFilters.depositRange[0]}만원 ~ ${appliedFilters.depositRange[1]}만원` : "보증금";
    const peopleLabel = appliedFilters.peopleCount !== undefined ? `~ ${appliedFilters.peopleCount}명` : "인원";

    const Btn = ({
      label,
      onPress,
      filled,
    }: {
      label: string;
      onPress: () => void;
      filled?: boolean;
    }) => (
      <TouchableOpacity
        onPress={onPress}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 12,
          backgroundColor: filled ? "#F7B32B" : "rgba(247,179,43,0.2)",
          marginRight: 8,
        }}
      >
        <Text style={{ color: filled ? "#fff" : "#8a6b20", fontWeight: "600" }}>
          {label} <Text>⌄</Text>
        </Text>
      </TouchableOpacity>
    );

    return (
      <View
        style={{
          position: "absolute",
          top: 72,
          left: 12,
          right: 12,
          zIndex: 5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Btn 
          label={radiusLabel} 
          onPress={() => {
            setTempRadius(appliedFilters.radius || 2);
            setOpenRadius(true);
          }} 
          filled={appliedFilters.radius !== undefined}
        />
        <Btn 
          label={rentLabel} 
          onPress={() => {
            setTempRentRange(appliedFilters.rentRange || [10, 100]);
            setOpenRent(true);
          }}
          filled={appliedFilters.rentRange !== undefined}
        />
        <Btn 
          label={depositLabel} 
          onPress={() => {
            setTempDepositRange(appliedFilters.depositRange || [1000, 3500]);
            setOpenDeposit(true);
          }}
          filled={appliedFilters.depositRange !== undefined}
        />
        <Btn 
          label={peopleLabel} 
          onPress={() => {
            setTempPeopleCount(appliedFilters.peopleCount || 4);
            setOpenPeople(true);
          }}
          filled={appliedFilters.peopleCount !== undefined}
        />
      </View>
    );
  };

  // 모달 컴포넌트
  const BottomSheetLike = ({
    visible,
    title,
    children,
    onClose,
    onReset,
    onConfirm,
  }: {
    visible: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    onReset: () => void;
    onConfirm: () => void;
  }) => (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.25)" }}>
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 20,
            paddingBottom: 28,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 8 }}>
            <View
              style={{
                width: 120,
                height: 6,
                borderRadius: 3,
                backgroundColor: "#e5e7eb",
              }}
            />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>{title}</Text>
          {children}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              onPress={onReset}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#F7B32B",
                paddingVertical: 14,
                borderRadius: 10,
                alignItems: "center",
                backgroundColor: "#fff",
              }}
            >
              <Text style={{ color: "#F7B32B", fontWeight: "600" }}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                backgroundColor: "#F7B32B",
                paddingVertical: 14,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const BottomJobBlock = () => (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingBottom: 8,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={toggleBottomSheet}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>
            {searchQuery && searchQuery.trim() !== ""
              ? `'${searchQuery}' 검색 결과`
              : "근처 구인글"}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#9ca3af",
              transform: [{ rotate: sheetState === "expanded" ? "180deg" : "0deg" }],
            }}
          >
            ⌄
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#f3f4f6",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 14, color: "#6b7280" }}>
            {Array.isArray(filteredJobs) ? filteredJobs.length : 0}개
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const JobListSheet = () => (
    <View
      ref={sheetRef}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 80 + BOTTOM_BLOCK_HEIGHT,
        height: getHeightForState(sheetState),
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 20,
        zIndex: 30,
      }}
    >
      <View style={{ alignItems: "center", paddingVertical: 8 }}>
        <View style={{ width: 48, height: 4, backgroundColor: "#d1d5db", borderRadius: 2 }} />
      </View>
      <View style={{ flex: 1, opacity: sheetState === "collapsed" ? 0 : 1, height: getHeightForState(sheetState) - 65 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}>
          {filteredJobs.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 48 }}>
              <Text style={{ fontSize: 32, color: "#d1d5db", marginBottom: 8 }}>📍</Text>
              <Text style={{ color: "#6b7280" }}>조건에 맞는 구인글이 없습니다.</Text>
              <Text style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>필터를 조정해보세요.</Text>
            </View>
          ) : (
            <View>
              {filteredJobs.map((job) => (
                <TouchableOpacity
                  key={job.postId}
                  onPress={() => onNavigateToJob?.(String(job.postId))}
                  style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#f9fafb" }}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "500", fontSize: 16, marginBottom: 4, color: "#111827" }}>
                        {job.title}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, color: "#6b7280" }}>📍 {job.address}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "#F7B32B" }}>
                          월 {job.monthlyCostMax}만원
                        </Text>
                        {job.authorId && <Text style={{ fontSize: 14, color: "#6b7280" }}>{job.authorName}</Text>}
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

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* 검색 바 */}
      {mapScreenState?.showSearch && (
        <View
          style={{
            backgroundColor: "#ffffff",
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
            padding: 16,
          }}
        >
          <View style={{ position: "relative" }}>
            <View style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}>
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
                borderColor: "#d1d5db",
                borderRadius: 8,
                backgroundColor: "#ffffff",
              }}
            />
            {searchQuery && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={{ position: "absolute", right: 12, top: 12 }}
              >
                <Ionicons name="close" size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* 지도 */}
      <View style={{ flex: 1, position: "relative" }}>
        <MapView
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          provider={PROVIDER_GOOGLE}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={hasLocationPermission}
          showsMyLocationButton={false}
        />

        <TopLeftFilters />

        {loading && (
          <View
            style={{
              position: "absolute",
              top: 16,
              alignSelf: "center",
              backgroundColor: "rgba(0,0,0,0.6)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff" }}>불러오는 중...</Text>
          </View>
        )}

        {!!errorMsg && (
          <View
            style={{
              position: "absolute",
              top: 16,
              alignSelf: "center",
              backgroundColor: "rgba(239,68,68,0.9)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff" }}>{errorMsg}</Text>
          </View>
        )}

        {/* 마커들 */}
        {posts.map((p, idx) => (
          <Marker
            key={`g-${idx}-${p.postId}`}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.title}
            description={p.address}
            pinColor={"#3B82F6"}
            onPress={() => setSheetState("partial")}
          />
        ))}

        {posts.map((l) => (
          <Marker
            key={`l-${l.postId}`}
            coordinate={{ latitude: l.latitude, longitude: l.longitude }}
            title={l.address}
            pinColor={"#10B981"}
            onPress={() => setSheetState("partial")}
          />
        ))}

        {filteredJobs
          .filter((j) => typeof j.latitude === "object" && typeof j.longitude === "object")
          .map((j) => (
            <Marker
              key={`post-${j.postId}`}
              coordinate={{ latitude: Number(j.latitude), longitude: Number(j.longitude) }}
              title={j.title}
              description={j.address}
              pinColor={"#F59E0B"}
              onPress={() => setSheetState("partial")}
            />
          ))}
      </View>

      <BottomJobBlock />
      <JobListSheet />

      {/* 모달들 */}
      {/* 반경 */}
      <BottomSheetLike
  visible={openRadius}
  title="반경"
  onClose={() => setOpenRadius(false)}
  onReset={() => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters.radius;
      return newFilters;
    });
    setTempRadius(2); // 초기화
    setOpenRadius(false);
  }}
  onConfirm={() => {
setAppliedFilters(prev => ({ ...prev, radius: tempRadius }));
    setOpenRadius(false);
  }}
>
  <Slider
    value={[tempRadius]}
    onValueChange={(v) => setTempRadius(Number(v[0]))}
    min={0}
    max={10}
    step={0.1}
  />
  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
    <Text style={{ color: "#9ca3af" }}>0km</Text>
    <Text style={{ fontWeight: "600" }}>~ {tempRadius}km</Text>
    <Text style={{ color: "#9ca3af" }}>10km</Text>
  </View>
</BottomSheetLike>


<BottomSheetLike
  visible={openRent}
  title="월세"
  onClose={() => setOpenRent(false)}
  onReset={() => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters.rentRange;
      return newFilters;
    });
    setTempRentRange([10, 100]);
    setOpenRent(false);
  }}
  onConfirm={() => {
    setAppliedFilters(prev => ({
      ...prev,
      rentRange: tempRentRange
    }));
    setOpenRent(false);
  }}
>
  <Slider
    value={tempRentRange}
    onValueChange={(v) => setTempRentRange([Number(v[0]), Number(v[1])])}
    min={10}
    max={200}
    step={1}
  />
  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
    <Text style={{ color: "#9ca3af" }}>최소</Text>
    <Text style={{ fontWeight: "600" }}>{tempRentRange[0]}만원 ~ {tempRentRange[1]}만원</Text>
    <Text style={{ color: "#9ca3af" }}>최대</Text>
  </View>
</BottomSheetLike>


<BottomSheetLike
  visible={openDeposit}
  title="보증금"
  onClose={() => setOpenDeposit(false)}
  onReset={() => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters.depositRange;
      return newFilters;
    });
    setTempDepositRange([1000, 3500]);
    setOpenDeposit(false);
  }}
  onConfirm={() => {
    setAppliedFilters(prev => ({
      ...prev,
      depositRange: tempDepositRange
    }));
    setOpenDeposit(false);
  }}
>
  <Slider
    value={tempDepositRange}
    onValueChange={(v) => setTempDepositRange([Number(v[0]), Number(v[1])])}
    min={0}
    max={5000}
    step={50}
  />
  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
    <Text style={{ color: "#9ca3af" }}>0만원</Text>
    <Text style={{ fontWeight: "600" }}>{tempDepositRange[0]}만원 ~ {tempDepositRange[1]}만원</Text>
    <Text style={{ color: "#9ca3af" }}>5000만원</Text>
  </View>
</BottomSheetLike>


<BottomSheetLike
  visible={openPeople}
  title="인원"
  onClose={() => setOpenPeople(false)}
  onReset={() => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters.peopleCount;
      return newFilters;
    });
    setTempPeopleCount(4);
    setOpenPeople(false);
  }}
  onConfirm={() => {
    setAppliedFilters(prev => ({
      ...prev,
      peopleCount: tempPeopleCount
    }));
    setOpenPeople(false);
  }}
>
  <Slider
    value={[tempPeopleCount]}
    onValueChange={(v) => setTempPeopleCount(Math.round(Number(v[0])))}
    min={2}
    max={10}
    step={1}
  />
  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
    <Text style={{ color: "#9ca3af" }}>2명 ~</Text>
    <Text style={{ fontWeight: "600" }}>~ {tempPeopleCount}명</Text>
    <Text style={{ color: "#9ca3af" }}>10명</Text>
  </View>
</BottomSheetLike>
    </View>
  );
}
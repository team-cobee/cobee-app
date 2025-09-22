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
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Double, Float } from "react-native/Libraries/Types/CodegenTypes";
import { Gender, Lifestyle, Personality, Pets, RecruitStatus, Smoking, Snoring } from "@/types/enums";


interface filterDto {
  latitude? : Double;
  longitude? : Double;
  radius? : Double;
  recruitCount? : number;
  rentCostMin? : number;
  rentCostMax? : number;
  monthlyCostMin? : number;
 monthlyCostMax? : number
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
  hasRoom: boolean; // true : 방있음, false : 함께 찾기
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

// ===== Helpers / API =====
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
  return qp.toString(); // "" 또는 "a=1&b=2"
}

const fetchRecruitPosts = async (params: filterDto) => {
  const qs = toQuery(params);
  const data = await api.get(`/posts/filter${qs ? `?${qs}` : ""}`);
  console.log(data.data);
  return data.data;  // 현재 내 위치를 기준으로부터!! 위도 경도는 필수적으로 보내줘야함. 몇 km이내로 있는지 구인글을 보여주는것.  
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
  // ===== 지도 / 권한 / 초기 위치 한 번만 =====
  const screenHeight = Dimensions.get("window").height;
  const [region, setRegion] = useState<Region>({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [centerReady, setCenterReady] = useState(false); // 초기 위치 준비 플래그
  const [posts, setPosts] = useState<RecruitResponse[]>([]);
  const initialCenterRef = useRef<{ lat: Float; lng: Float } | null>(null);

  useEffect(() => {
      const fetchRecruits = async () => {
        try {
          const res = await api.get('/recruits'); // @GetMapping("")
          setPosts(res.data?.data); // ApiResponse.success() 안에 data로 내려오는 구조라 가정
          console.log(res.data.data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchRecruits();
    }, []);

  // ===== 리스트 / 시트 =====
  const [sheetState, setSheetState] = useState<"collapsed" | "partial" | "expanded">(
    "collapsed"
  );
  const sheetRef = useRef<any>(null);
  const COLLAPSED_HEIGHT = 0;
  const PARTIAL_HEIGHT = 300;
  const BOTTOM_BLOCK_HEIGHT = 60;
  const EXPANDED_HEIGHT = screenHeight - 64 - 80 - BOTTOM_BLOCK_HEIGHT;

  const FILTER_BAR_HEIGHT =
    (mapScreenState?.appliedFilters?.length || 0) > 0 ? 80 : 0;

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

  // ===== 검색어 =====
  const [searchQuery, setSearchQuery] = useState("");

  // ===== 상단 필터 버튼 상태 (UI 표시 + API 파라미터) =====
  // 반경: 기본 2km
  const [radiusKm, setRadiusKm] = useState<number>(2);
  // 월세(만원) 범위
  const [rentRange, setRentRange] = useState<[number, number]>([45, 75]);
  // 보증금(만원) 범위
  const [depositRange, setDepositRange] = useState<[number, number]>([1000, 3500]);
  // 인원(본인 포함) – 서버 recruitCount로 전달 가정
  const [peopleCount, setPeopleCount] = useState<number>(4);

  // 모달 열림
  const [openRadius, setOpenRadius] = useState(false);
  const [openRent, setOpenRent] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openPeople, setOpenPeople] = useState(false);

  // ===== 서버 데이터 =====
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runSafe = async <T,>(fn: () => Promise<T>) => {
    try {
      return await fn();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "네트워크 오류");
      return null;
    }
  };

  const buildFilterParams = () => {
    const center = initialCenterRef.current!;
    return {
      latitude: center.lat,
      longitude: center.lng,
      radius: Math.round(radiusKm * 1000), // km → m
      recruitCount: peopleCount,
      rentCostMin: depositRange[0],
      rentCostMax: depositRange[1],
      monthlyCostMin: rentRange[0],
      monthlyCostMax: rentRange[1],
    };
  };

  // 🔹 초기 위치 확보 후 + 버튼(필터) 값이 바뀔 때만 호출
  // ===== 클라 보조 필터(검색어만) =====
  const filteredJobs = posts.filter((job) => {
    if (
      searchQuery &&
      !job.title?.toLowerCase?.().includes(searchQuery.toLowerCase()) 
      //&&!job.?.toLowerCase?.().includes(searchQuery.toLowerCase()) // ??
    ) {
      return false;
    }
    return true;
  });

  // ===== 상단 왼쪽 필터 버튼 UI =====
  const TopLeftFilters = () => {
    // const fmtKm = (v: number) => (v >= 1 ? `${v}km` : `${Math.round(v * 1000)}m`);
    // const rentLabel = `${rentRange[0]}만원 ~ ${rentRange[1]}만원`;
    // const depositLabel = `${depositRange[0]}만원 ~ ${depositRange[1]}만원`;
    // const radiusLabel = `~ ${fmtKm(radiusKm)}`;
    // const peopleLabel = `~ ${peopleCount}명`;
    const fmtKm = (v: number) => (v >= 1 ? `${v}km` : `${Math.round(v * 1000)}m`);
    const radiusLabel = radiusKm == null ? "반경" : `~ ${fmtKm(radiusKm)}`;
    const rentLabel = rentRange == null ? "월세" : `${rentRange[0]}만원 ~ ${rentRange[1]}만원`;
    const depositLabel = depositRange == null ? "보증금" : `${depositRange[0]}만원 ~ ${depositRange[1]}만원`;
    const peopleLabel = peopleCount == null ? "인원" : `~ ${peopleCount}명`;

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
          top: 72, // 검색바 아래쪽 느낌
          left: 12,
          right: 12,
          zIndex: 5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Btn label={radiusLabel} onPress={() => setOpenRadius(true)} />
        <Btn label={rentLabel} onPress={() => setOpenRent(true)} />
        <Btn label={"보증금"} onPress={() => setOpenDeposit(true)} />
        <Btn label={"인원"} onPress={() => setOpenPeople(true)} />
      </View>
    );
  };

  // ===== 공통 모달 래퍼 =====
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

  // ====== UI 컴포넌트 ======
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
      {/* 드래그 핸들 */}
      <View style={{ alignItems: "center", paddingVertical: 8 }}>
        <View style={{ width: 48, height: 4, backgroundColor: "#d1d5db", borderRadius: 2 }} />
      </View>

      {/* 구인글 리스트 */}
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
                        {/* {!!job.distanceMeter && (
                          <Text style={{ fontSize: 14, color: "#6b7280" }}>
                            • {(job. / 1000).toFixed(1)}km
                          </Text>
                        )} */}
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
          onRegionChangeComplete={setRegion} // 지도 이동은 데이터 호출 트리거 X
          showsUserLocation={hasLocationPermission}
          showsMyLocationButton={false}
        />

        {/* 상단 왼쪽 필터 버튼들 */}
        <TopLeftFilters />

        {/* 로딩/에러 */}
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
              coordinate={{ latitude: Number(j.latitude), longitude: Number(j.longitude) }} // Float
              title={j.title}
              description={j.address}
              pinColor={"#F59E0B"}
              onPress={() => setSheetState("partial")}
            />
          ))}

        {/* 시트 열렸을 때 오버레이 */}
        {(sheetState === "partial" || sheetState === "expanded") && (
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
              opacity: sheetState === "expanded" ? 0.4 : 0.2,
              zIndex: 10,
            }}
            onPress={() => setSheetState("collapsed")}
            activeOpacity={1}
          />
        )}
      </View>

      {/* 하단 고정 바 */}
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
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          onPress={toggleBottomSheet}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ fontWeight: "600", fontSize: 16 }}>
              {searchQuery && searchQuery.trim() !== "" ? `'${searchQuery}' 검색 결과` : "근처 구인글"}
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
          <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
              {Array.isArray(filteredJobs) ? filteredJobs.length : 0}개
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 시트 & 고정 블록 */}
      <JobListSheet />
      <BottomJobBlock />

      {/* ===== 모달들 ===== */}
      {/* 반경 */}
      <BottomSheetLike
        visible={openRadius}
        title="반경"
        onClose={() => setOpenRadius(false)}
        onReset={() => setRadiusKm(2)}
        onConfirm={() => {
          setOpenRadius(false);
          //loadAll();
        }}
      >
        <Slider value={[radiusKm]} onValueChange={(v) => setRadiusKm(Number(v[0]))} min={0} max={10} step={0.1} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ color: "#9ca3af" }}>0km</Text>
          <Text style={{ fontWeight: "600" }}>~ {radiusKm}km</Text>
          <Text style={{ color: "#9ca3af" }}>10km</Text>
        </View>
      </BottomSheetLike>

      {/* 월세 */}
      <BottomSheetLike
        visible={openRent}
        title="월세"
        onClose={() => setOpenRent(false)}
        onReset={() => setRentRange([45, 75])}
        onConfirm={() => {
          setOpenRent(false);
          //loadAll();
        }}
      >
        <Slider value={rentRange as unknown as number[]} onValueChange={(v) => setRentRange([v[0], v[1]] as any)} min={10} max={200} step={1} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ color: "#9ca3af" }}>최소</Text>
          <Text style={{ fontWeight: "600" }}>{rentRange[0]}만원 ~ {rentRange[1]}만원</Text>
          <Text style={{ color: "#9ca3af" }}>최대</Text>
        </View>
      </BottomSheetLike>

      {/* 보증금 */}
      <BottomSheetLike
        visible={openDeposit}
        title="보증금"
        onClose={() => setOpenDeposit(false)}
        onReset={() => setDepositRange([1000, 3500])}
        onConfirm={() => {
          setOpenDeposit(false);
          //loadAll();
        }}
      >
        <Slider
          
          value={depositRange as unknown as number[]}
          onValueChange={(v) => setDepositRange([v[0], v[1]] as any)}
          min={0}
          max={5000}
          step={50}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ color: "#9ca3af" }}>0만원</Text>
          <Text style={{ fontWeight: "600" }}>{depositRange[0]}만원 ~ {depositRange[1]}만원</Text>
          <Text style={{ color: "#9ca3af" }}>5000만원</Text>
        </View>
      </BottomSheetLike>

      {/* 인원 */}
      <BottomSheetLike
        visible={openPeople}
        title="인원"
        onClose={() => setOpenPeople(false)}
        onReset={() => setPeopleCount(4)}
        onConfirm={() => {
          setOpenPeople(false);
          //loadAll();
        }}
      >
        <Slider value={[peopleCount]} onValueChange={(v) => setPeopleCount(Math.round(Number(v[0])))} min={2} max={10} step={1} />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ color: "#9ca3af" }}>2명 ~</Text>
          <Text style={{ fontWeight: "600" }}>~ {peopleCount}명</Text>
          <Text style={{ color: "#9ca3af" }}>10명</Text>
        </View>
      </BottomSheetLike>
    </View>
  );
}

// import React, { useRef, useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Modal,
//   Dimensions,
// } from "react-native";
// import RNSlider from '@react-native-community/slider'; // ✅ 단일 슬라이더
// import MultiSlider from '@ptomasroos/react-native-multi-slider'; // ✅ 범위 슬라이더
// import { api } from "@/api/api";
// import { getCurrentLatLngOnce } from "./location";
// import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
// import { Ionicons } from "@expo/vector-icons";
// import { Slider } from "./ui/slider";
// import { Gender, Lifestyle, Personality, Pets, RecruitStatus, Smoking, Snoring } from "@/types/enums";

// type FilterDto = {
//   latitude?: number;
//   longitude?: number;
//   radius?: number; // km
//   recruitCount?: number;
//   rentCostMin?: number;
//   rentCostMax?: number;
//   monthlyCostMin?: number;
//   monthlyCostMax?: number;
// };

// type RecruitResponse = {
//   postId: number;
//   title: string;
//   createdAt: string;
//   status: RecruitStatus;
//   authorId: number;
//   authorName: string;
//   authorGender: Gender;
//   birthdate: string;
//   recruitCount: number;
//   hasRoom: boolean;
//   rentalCostMin: number;
//   rentalCostMax: number;
//   monthlyCostMin: number;
//   monthlyCostMax: number;
//   preferedGender: Gender;
//   preferedMinAge: number;
//   preferedMaxAge: number;
//   preferedLifeStyle?: Lifestyle;
//   preferedPersonality?: Personality;
//   preferedSmoking?: Smoking;
//   preferedSnoring?: Snoring;
//   preferedHasPet?: Pets;
//   address: string;
//   latitude: number;
//   longitude: number;
//   detailDescript: string;
//   additionalDescript: string;
//   imgUrl: string[] | null;
// };

// const toQuery = (params: Record<string, any>) => {
//   const qp = new URLSearchParams();
//   Object.entries(params).forEach(([k, v]) => {
//     if (v === undefined || v === null || v === "") return;
//     if (Array.isArray(v)) {
//       v.forEach((item) => qp.append(k, String(item)));
//     } else {
//       qp.append(k, String(v));
//     }
//   });
//   return qp.toString();
// };

// const fetchRecruitPosts = async (params: FilterDto) => {
//   const qs = toQuery(params);
//   const data = await api.get(`/posts/filter${qs ? `?${qs}` : ""}`);
//   return data.data;
// };

// interface MapScreenProps {
//   onBack?: () => void;
//   onNavigateToJob?: (jobId: string) => void;
//   onNavigateToSearch?: () => void;
//   mapScreenState?: {
//     showFilters: boolean;
//     showSearch: boolean;
//     appliedFilters: string[];
//   };
//   setMapScreenState?: React.Dispatch<
//     React.SetStateAction<{
//       showFilters: boolean;
//       showSearch: boolean;
//       appliedFilters: string[];
//     }>
//   >;
// }

// export default function MapScreen({
//   onNavigateToJob,
//   mapScreenState,
// }: MapScreenProps) {
//   const screenHeight = Dimensions.get("window").height;

//   // === 위치/지도 상태 ===
//   const [hasLocationPermission, setHasLocationPermission] = useState(false);
//   const [posts, setPosts] = useState<RecruitResponse[]>([]);

//   const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
//   const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);

//   const initialCenterRef = useRef<{ lat: number; lng: number } | null>(null);

//   // Region은 latitude/longitude 키를 가져야 함!
//   const [region, setRegion] = useState<Region>({
//     latitude: 37.5665, // 임시(서울) - 권한 거부/실패 대비 기본값
//     longitude: 126.9780,
//     latitudeDelta: 0.05,
//     longitudeDelta: 0.05,
//   });

//   // === 필터 상태 ===
//   const [appliedFilters, setAppliedFilters] = useState<{
//     radius?: number; // km
//     rentRange?: [number, number];
//     depositRange?: [number, number];
//     peopleCount?: number;
//   }>({});

//   // === UI/시트/모달 ===
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sheetState, setSheetState] = useState<"collapsed" | "partial" | "expanded">("collapsed");
//   const sheetRef = useRef<any>(null);
//   const COLLAPSED_HEIGHT = 0;
//   const PARTIAL_HEIGHT = 300;
//   const BOTTOM_BLOCK_HEIGHT = 60;
//   const EXPANDED_HEIGHT = screenHeight - 64 - 80 - BOTTOM_BLOCK_HEIGHT;
//   const FILTER_BAR_HEIGHT = 0;
//   const getHeightForState = (state: typeof sheetState) =>
//     state === "collapsed" ? COLLAPSED_HEIGHT :
//     state === "partial"   ? PARTIAL_HEIGHT :
//                             EXPANDED_HEIGHT - FILTER_BAR_HEIGHT;

//   const [openRadius, setOpenRadius] = useState(false);
//   const [openRent, setOpenRent] = useState(false);
//   const [openDeposit, setOpenDeposit] = useState(false);
//   const [openPeople, setOpenPeople] = useState(false);

//   const [tempRadius, setTempRadius] = useState<number>(2);
//   const [tempRentRange, setTempRentRange] = useState<[number, number]>([10, 100]);
//   const [tempDepositRange, setTempDepositRange] = useState<[number, number]>([1000, 3500]);
//   const [tempPeopleCount, setTempPeopleCount] = useState<number>(4);

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   const toggleBottomSheet = () => {
//     setSheetState((s) => (s === "collapsed" ? "partial" : s === "partial" ? "expanded" : "collapsed"));
//   };

//   // ====== 현재 위치 1회 초기화 ======
//   const initMyPosition = useCallback(async () => {
//     try {
//       const { latitude, longitude } = await getCurrentLatLngOnce();
//       setHasLocationPermission(true);
//       setCurrentLatitude(latitude);
//       setCurrentLongitude(longitude);

//       // 지도 중심/필터 중심 동기화
//       setRegion((prev) => ({
//         ...prev,
//         latitude,
//         longitude,
//       }));
//       initialCenterRef.current = { lat: latitude, lng: longitude };
//       // 위치가 준비되면 위치 중심으로 최초 로드 (필터 없이 전체 or 반경 필터와 함께)
//       loadRecruitsRef.current(); // 아래 useRef 콜백 참고
//     } catch (e: any) {
//       // 권한 거부/서비스 꺼짐/타임아웃 등
//       setHasLocationPermission(false);
//       setErrorMsg(e?.message || "현재 위치를 가져오지 못했습니다.");
//       // 기본 서울 좌표 유지
//       initialCenterRef.current = { lat: region.latitude, lng: region.longitude };
//       loadRecruitsRef.current();
//     }
//   }, [region.latitude, region.longitude]);

//   // ====== 데이터 로드 함수 ======
//   const fetchFiltered = async(filterParams?: FilterDto) => {
//     setLoading(true);
//     setErrorMsg(null);
//     try {
//       let data;
//       if (filterParams && Object.keys(filterParams).length > 0) {
//         data = await api.get(`/posts/filter&${filterParams}`);
        
//       } else {
//         const res = await api.get('/recruits');
//         data = res.data?.data;
//       }
//       setPosts(Array.isArray(data) ? data : []);
//     } catch (error: any) {
//       console.error('Error loading recruits:', error);
//       setErrorMsg('데이터를 불러오는 중 오류가 발생했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   []};

//   // buildFilterParams: 위치가 준비된 뒤에만 center 사용
//   const buildFilterParams = useCallback((): FilterDto => {
//     const center = initialCenterRef.current;
//     const params: FilterDto = {};
//     if (center) {
//       params.latitude = center.lat;
//       params.longitude = center.lng;
//     }

//     if (appliedFilters.radius !== undefined) {
//       params.radius = Math.round(appliedFilters.radius); // 서버가 km 기대
//     }
//     if (appliedFilters.peopleCount !== undefined) {
//       params.recruitCount = appliedFilters.peopleCount;
//     }
//     if (appliedFilters.depositRange !== undefined) {
//       params.rentCostMin = appliedFilters.depositRange[0];
//       params.rentCostMax = appliedFilters.depositRange[1];
//     }
//     if (appliedFilters.rentRange !== undefined) {
//       params.monthlyCostMin = appliedFilters.rentRange[0];
//       params.monthlyCostMax = appliedFilters.rentRange[1];
//     }
//     return params;
//   }, [appliedFilters]);

//   // loadRecruits를 ref로 래핑해 초기 위치 세팅 이후에도 안전하게 호출
//   const loadRecruitsRef = useRef(() => {});
//   useEffect(() => {
//     loadRecruitsRef.current = () => {
//       const hasFilters = Object.keys(appliedFilters).length > 0;
//       const center = initialCenterRef.current;
//       if (hasFilters) {
//         const filterParams = buildFilterParams();
//         fetchFiltered(filterParams);
//       } else {
//         // 필터 없더라도, 위치가 준비되었으면 중심 좌표를 서버로 넘기는 정책이면 여기서 넘겨도 됨.
//         // 현재는 필터 없으면 /recruits 전체로딩 유지.
//         fetchFiltered();
//       }
//     };
//   }, [appliedFilters, buildFilterParams, fetchFiltered]);

//   // 최초 마운트: 위치 먼저
//   useEffect(() => {
//     initMyPosition();
//   }, [initMyPosition]);

//   // 필터 변경 시 재조회
//   useEffect(() => {
//     if (initialCenterRef.current) {
//       loadRecruitsRef.current();
//     }
//   }, [appliedFilters]);

//   const filteredJobs = Array.isArray(posts)
//     ? posts.filter((job) => {
//         if (searchQuery && !job.title?.toLowerCase?.().includes(searchQuery.toLowerCase())) {
//           return false;
//         }
//         return true;
//       })
//     : [];

//   // ====== UI 컴포넌트들 ======
//   const TopLeftFilters = () => {
//     const fmtKm = (v: number) => (v >= 1 ? `${v}km` : `${Math.round(v * 1000)}m`);

//     const radiusLabel = appliedFilters.radius !== undefined ? `~ ${fmtKm(appliedFilters.radius)}` : "반경";
//     const rentLabel = appliedFilters.rentRange !== undefined ? `${appliedFilters.rentRange[0]}만원 ~ ${appliedFilters.rentRange[1]}만원` : "월세";
//     const depositLabel = appliedFilters.depositRange !== undefined ? `${appliedFilters.depositRange[0]}만원 ~ ${appliedFilters.depositRange[1]}만원` : "보증금";
//     const peopleLabel = appliedFilters.peopleCount !== undefined ? `~ ${appliedFilters.peopleCount}명` : "인원";

//     const Btn = ({
//       label,
//       onPress,
//       filled,
//     }: {
//       label: string;
//       onPress: () => void;
//       filled?: boolean;
//     }) => (
//       <TouchableOpacity
//         onPress={onPress}
//         style={{
//           paddingHorizontal: 14,
//           paddingVertical: 8,
//           borderRadius: 12,
//           backgroundColor: filled ? "#F7B32B" : "rgba(247,179,43,0.2)",
//           marginRight: 8,
//         }}
//       >
//         <Text style={{ color: filled ? "#fff" : "#8a6b20", fontWeight: "600" }}>
//           {label} <Text>⌄</Text>
//         </Text>
//       </TouchableOpacity>
//     );

//     return (
//       <View
//         style={{
//           position: "absolute",
//           top: 72,
//           left: 12,
//           right: 12,
//           zIndex: 5,
//           flexDirection: "row",
//           alignItems: "center",
//         }}
//       >
//         <Btn
//           label={radiusLabel}
//           onPress={() => {
//             setTempRadius(appliedFilters.radius ?? 2);
//             setOpenRadius(true);
//           }}
//           filled={appliedFilters.radius !== undefined}
//         />
//         <Btn
//           label={rentLabel}
//           onPress={() => {
//             setTempRentRange(appliedFilters.rentRange ?? [10, 100]);
//             setOpenRent(true);
//           }}
//           filled={appliedFilters.rentRange !== undefined}
//         />
//         <Btn
//           label={depositLabel}
//           onPress={() => {
//             setTempDepositRange(appliedFilters.depositRange ?? [1000, 3500]);
//             setOpenDeposit(true);
//           }}
//           filled={appliedFilters.depositRange !== undefined}
//         />
//         <Btn
//           label={peopleLabel}
//           onPress={() => {
//             setTempPeopleCount(appliedFilters.peopleCount ?? 4);
//             setOpenPeople(true);
//           }}
//           filled={appliedFilters.peopleCount !== undefined}
//         />
//       </View>
//     );
//   };

//   const BottomSheetLike = ({
//   visible,
//   title,
//   children,
//   onClose,
//   onReset,
//   onConfirm,
// }: {
//   visible: boolean;
//   title: string;
//   children: React.ReactNode;
//   onClose: () => void;
//   onReset: () => void;
//   onConfirm: () => void;
// }) => (
//   <Modal
//     visible={visible}
//     transparent
//     // Android 하드웨어 뒤로가기만 닫기 허용 (슬라이더 터치로는 절대 닫히지 않음)
//     onRequestClose={onClose}
//   >
//     {/* 회색 배경 제거: 완전 투명 */}
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "flex-end",
//         backgroundColor: "transparent",
//       }}
//       // 바깥 영역 터치해도 아무것도 안 일어남 (닫히지 않음)
//       pointerEvents="auto"
//     >
//       {/* 시트 컨테이너가 모든 제스처를 소비하게 함 → 슬라이더 드래그가 배경으로 전파되지 않음 */}
//       <View
//         onStartShouldSetResponder={() => true}
//         style={{
//           backgroundColor: "#fff",
//           borderTopLeftRadius: 16,
//           borderTopRightRadius: 16,
//           padding: 20,
//           paddingBottom: 28,
//         }}
//       >
//         <View style={{ alignItems: "center", marginBottom: 8 }}>
//           <View style={{ width: 120, height: 6, borderRadius: 3, backgroundColor: "#e5e7eb" }} />
//         </View>
//         <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>{title}</Text>

//         {children}

//         <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
//           <TouchableOpacity
//             onPress={onReset}
//             style={{
//               flex: 1,
//               borderWidth: 1,
//               borderColor: "#F7B32B",
//               paddingVertical: 14,
//               borderRadius: 10,
//               alignItems: "center",
//               backgroundColor: "#fff",
//             }}
//           >
//             <Text style={{ color: "#F7B32B", fontWeight: "600" }}>초기화</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={onConfirm}
//             style={{
//               flex: 1,
//               backgroundColor: "#F7B32B",
//               paddingVertical: 14,
//               borderRadius: 10,
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ color: "#fff", fontWeight: "700" }}>확인</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   </Modal>
// );


//   const BottomJobBlock = () => (
//     <View
//       style={{
//         position: "absolute",
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: "#ffffff",
//         borderTopWidth: 1,
//         borderTopColor: "#e5e7eb",
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         paddingBottom: 8,
//       }}
//     >
//       <TouchableOpacity
//         style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
//         onPress={toggleBottomSheet}
//       >
//         <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
//           <Text style={{ fontWeight: "600", fontSize: 16 }}>
//             {searchQuery?.trim() ? `'${searchQuery}' 검색 결과` : "근처 구인글"}
//           </Text>
//           <Text
//             style={{
//               fontSize: 16,
//               color: "#9ca3af",
//               transform: [{ rotate: sheetState === "expanded" ? "180deg" : "0deg" }],
//             }}
//           >
//             ⌄
//           </Text>
//         </View>
//         <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
//           <Text style={{ fontSize: 14, color: "#6b7280" }}>
//             {Array.isArray(filteredJobs) ? filteredJobs.length : 0}개
//           </Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );

//   const JobListSheet = () => (
//     <View
//       ref={sheetRef}
//       style={{
//         position: "absolute",
//         left: 0,
//         right: 0,
//         bottom: 80 + BOTTOM_BLOCK_HEIGHT,
//         height: getHeightForState(sheetState),
//         backgroundColor: "#ffffff",
//         borderTopLeftRadius: 16,
//         borderTopRightRadius: 16,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: -2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 10,
//         elevation: 20,
//         zIndex: 30,
//       }}
//     >
//       <View style={{ alignItems: "center", paddingVertical: 8 }}>
//         <View style={{ width: 48, height: 4, backgroundColor: "#d1d5db", borderRadius: 2 }} />
//       </View>
//       <View style={{ flex: 1, opacity: sheetState === "collapsed" ? 0 : 1, height: getHeightForState(sheetState) - 65 }}>
//         <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}>
//           {filteredJobs.length === 0 ? (
//             <View style={{ alignItems: "center", paddingVertical: 48 }}>
//               <Text style={{ fontSize: 32, color: "#d1d5db", marginBottom: 8 }}>📍</Text>
//               <Text style={{ color: "#6b7280" }}>조건에 맞는 구인글이 없습니다.</Text>
//               <Text style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>필터를 조정해보세요.</Text>
//             </View>
//           ) : (
//             <View>
//               {filteredJobs.map((job) => (
//                 <TouchableOpacity
//                   key={job.postId}
//                   onPress={() => onNavigateToJob?.(String(job.postId))}
//                   style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#f9fafb" }}
//                   activeOpacity={0.7}
//                 >
//                   <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
//                     <View style={{ flex: 1 }}>
//                       <Text style={{ fontWeight: "500", fontSize: 16, marginBottom: 4, color: "#111827" }}>
//                         {job.title}
//                       </Text>
//                       <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                         <Text style={{ fontSize: 14, color: "#6b7280" }}>📍 {job.address}</Text>
//                       </View>
//                       <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
//                         <Text style={{ fontSize: 18, fontWeight: "600", color: "#F7B32B" }}>
//                           월 {job.monthlyCostMax}만원
//                         </Text>
//                         {!!job.authorId && <Text style={{ fontSize: 14, color: "#6b7280" }}>{job.authorName}</Text>}
//                       </View>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </ScrollView>
//       </View>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
//       {/* 검색 바 */}
//       {mapScreenState?.showSearch && (
//         <View style={{ backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", padding: 16 }}>
//           <View style={{ position: "relative" }}>
//             <View style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}>
//               <Ionicons name="search" size={16} color="#9ca3af" />
//             </View>
//             <TextInput
//               placeholder="지역, 구인글 제목으로 검색..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               style={{
//                 paddingLeft: 40,
//                 paddingRight: searchQuery ? 40 : 16,
//                 paddingVertical: 12,
//                 borderWidth: 1,
//                 borderColor: "#d1d5db",
//                 borderRadius: 8,
//                 backgroundColor: "#ffffff",
//               }}
//             />
//             {!!searchQuery && (
//               <TouchableOpacity onPress={() => setSearchQuery("")} style={{ position: "absolute", right: 12, top: 12 }}>
//                 <Ionicons name="close" size={16} color="#9ca3af" />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       )}

//       {/* 지도 */}
//       <View style={{ flex: 1, position: "relative" }}>
//         <MapView
//           style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
//           provider={PROVIDER_GOOGLE}
//           region={region}
//           onRegionChangeComplete={setRegion}
//           showsUserLocation={hasLocationPermission}
//           showsMyLocationButton={false}
//         />

//         <TopLeftFilters />

//         {loading && (
//           <View style={{ position: "absolute", top: 16, alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}>
//             <Text style={{ color: "#fff" }}>불러오는 중...</Text>
//           </View>
//         )}

//         {!!errorMsg && (
//           <View style={{ position: "absolute", top: 16, alignSelf: "center", backgroundColor: "rgba(239,68,68,0.9)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}>
//             <Text style={{ color: "#fff" }}>{errorMsg}</Text>
//           </View>
//         )}

//         {/* 마커: 중복 루프 제거, 숫자형인 것만 */}
//         {posts
//           .filter((p) => typeof p.latitude === "number" && typeof p.longitude === "number")
//           .map((p) => (
//             <Marker
//               key={p.postId}
//               coordinate={{ latitude: p.latitude, longitude: p.longitude }}
//               title={p.title}
//               description={p.address}
//               pinColor={"#F59E0B"}
//               onPress={() => setSheetState("partial")}
//             />
//           ))}
//       </View>

//       <BottomJobBlock />
//       <JobListSheet />

//       {/* 모달들 */}
//       {/* 반경 */}
//       <BottomSheetLike
//         visible={openRadius}
//         title="반경"
//         onClose={() => setOpenRadius(false)}
//         onReset={() => {
//           setAppliedFilters(prev => { const n = { ...prev }; delete n.radius; return n; });
//           setTempRadius(2);
//           setOpenRadius(false);
//         }}
//         onConfirm={() => {
//           // 소수점 1자리로 깔끔하게 저장
//           const rounded = parseFloat(tempRadius.toFixed(0));
//           setAppliedFilters(prev => ({ ...prev, radius: rounded }));
//           setOpenRadius(false);
//         }}
//       >
//         <RNSlider
//           value={tempRadius}
//           onValueChange={(v) => setTempRadius(v)}
//           minimumValue={0}
//           maximumValue={500}
//           step={2}
//         />
//         <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
//           <Text style={{ color: "#9ca3af" }}>0km</Text>
//           {/* 표시만 toFixed(1) */}
//           <Text style={{ fontWeight: "600" }}>~ {tempRadius.toFixed(0)}km</Text>
//           <Text style={{ color: "#9ca3af" }}>500km</Text>
//         </View>
//       </BottomSheetLike>


//       {/* 월세 */}
//       <BottomSheetLike
//         visible={openRent}
//         title="월세"
//         onClose={() => setOpenRent(false)}
//         onReset={() => {
//           setAppliedFilters(prev => { const n = { ...prev }; delete n.rentRange; return n; });
//           setTempRentRange([10, 100]); setOpenRent(false);
//         }}
//         onConfirm={() => { setAppliedFilters(prev => ({ ...prev, rentRange: tempRentRange })); setOpenRent(false); }}
//       >
//         <MultiSlider
//           values={tempRentRange}
//           onValuesChange={(vals) => setTempRentRange([Math.round(vals[0]), Math.round(vals[1])])}
//           min={10}
//           max={200}
//           step={1}
//           allowOverlap={false}
//           snapped
//         />
//         <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
//           <Text style={{ color: "#9ca3af" }}>최소</Text>
//           <Text style={{ fontWeight: "600" }}>{tempRentRange[0]}만원 ~ {tempRentRange[1]}만원</Text>
//           <Text style={{ color: "#9ca3af" }}>최대</Text>
//         </View>
//       </BottomSheetLike>

//       <BottomSheetLike
//         visible={openDeposit}
//         title="보증금"
//         onClose={() => setOpenDeposit(false)}
//         onReset={() => {
//           setAppliedFilters(prev => { const n = { ...prev }; delete n.depositRange; return n; });
//           setTempDepositRange([1000, 3500]); setOpenDeposit(false);
//         }}
//         onConfirm={() => { setAppliedFilters(prev => ({ ...prev, depositRange: tempDepositRange })); setOpenDeposit(false); }}
//       >
//         <MultiSlider
//           values={tempDepositRange}
//           onValuesChange={(vals) => setTempDepositRange([Math.round(vals[0]), Math.round(vals[1])])}
//           min={0}
//           max={5000}
//           step={50}
//           allowOverlap={false}
//           snapped
//         />
//         <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
//           <Text style={{ color: "#9ca3af" }}>0만원</Text>
//           <Text style={{ fontWeight: "600" }}>{tempDepositRange[0]}만원 ~ {tempDepositRange[1]}만원</Text>
//           <Text style={{ color: "#9ca3af" }}>5000만원</Text>
//         </View>
//       </BottomSheetLike>


//       {/* 인원 */}
//       <BottomSheetLike
//         visible={openPeople}
//         title="인원"
//         onClose={() => setOpenPeople(false)}
//         onReset={() => {
//           setAppliedFilters(prev => { const n = { ...prev }; delete n.peopleCount; return n; });
//           setTempPeopleCount(4); setOpenPeople(false);
//         }}
//         onConfirm={() => { setAppliedFilters(prev => ({ ...prev, peopleCount: tempPeopleCount })); setOpenPeople(false); }}
//       >
//         <RNSlider
//           value={tempPeopleCount}
//           onValueChange={(v) => setTempPeopleCount(Math.round(v))}
//           minimumValue={2}
//           maximumValue={10}
//           step={1}
//         />
//         <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
//           <Text style={{ color: "#9ca3af" }}>2명 ~</Text>
//           <Text style={{ fontWeight: "600" }}>~ {tempPeopleCount}명</Text>
//           <Text style={{ color: "#9ca3af" }}>10명</Text>
//         </View>
//       </BottomSheetLike>

//     </View>
//   );
// }


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
import RNSlider from '@react-native-community/slider'; // ✅ 단일 슬라이더
import MultiSlider from '@ptomasroos/react-native-multi-slider'; // ✅ 범위 슬라이더
import { api } from "@/api/api";
import { getCurrentLatLngOnce } from "./location";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Slider } from "./ui/slider";
import { Gender, Lifestyle, Personality, Pets, RecruitStatus, Smoking, Snoring } from "@/types/enums";

type FilterDto = {
  latitude?: number;
  longitude?: number;
  radius?: number; // km
  recruitCount?: number;
  rentCostMin?: number;
  rentCostMax?: number;
  monthlyCostMin?: number;
  monthlyCostMax?: number;
};

type RecruitResponse = {
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
  latitude: number;
  longitude: number;
  detailDescript: string;
  additionalDescript: string;
  imgUrl: string[] | null;
};

const toQuery = (params: Record<string, any>) => {
  console.log('쿼리 파라미터 생성 중:', params);
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    if (Array.isArray(v)) {
      v.forEach((item) => qp.append(k, String(item)));
    } else {
      qp.append(k, String(v));
    }
  });
  const result = qp.toString();
  console.log('생성된 쿼리 스트링:', result);
  return result;
};


const fetchRecruitPosts = async (params: FilterDto) => {
  const qs = toQuery(params);
  const data = await api.get(`/posts/filter${qs ? `?${qs}` : ""}`);
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
}: MapScreenProps) {
  const screenHeight = Dimensions.get("window").height;

  // === 위치/지도 상태 ===
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [posts, setPosts] = useState<RecruitResponse[]>([]);

  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);

  const initialCenterRef = useRef<{ lat: number; lng: number } | null>(null);

  // Region은 latitude/longitude 키를 가져야 함!
  const [region, setRegion] = useState<Region>({
    latitude: 37.5665, // 임시(서울) - 권한 거부/실패 대비 기본값
    longitude: 126.9780,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // === 필터 상태 ===
  const [appliedFilters, setAppliedFilters] = useState<{
    radius?: number; // km
    rentRange?: [number, number];
    depositRange?: [number, number];
    peopleCount?: number;
  }>({});

  // === UI/시트/모달 ===
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetState, setSheetState] = useState<"collapsed" | "partial" | "expanded">("collapsed");
  const sheetRef = useRef<any>(null);
  const COLLAPSED_HEIGHT = 0;
  const PARTIAL_HEIGHT = 300;
  const BOTTOM_BLOCK_HEIGHT = 60;
  const EXPANDED_HEIGHT = screenHeight - 64 - 80 - BOTTOM_BLOCK_HEIGHT;
  const FILTER_BAR_HEIGHT = 0;
  const getHeightForState = (state: typeof sheetState) =>
    state === "collapsed" ? COLLAPSED_HEIGHT :
    state === "partial"   ? PARTIAL_HEIGHT :
                            EXPANDED_HEIGHT - FILTER_BAR_HEIGHT;

  const [openRadius, setOpenRadius] = useState(false);
  const [openRent, setOpenRent] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openPeople, setOpenPeople] = useState(false);

  const [tempRadius, setTempRadius] = useState<number>(2);
  const [tempRentRange, setTempRentRange] = useState<[number, number]>([10, 100]);
  const [tempDepositRange, setTempDepositRange] = useState<[number, number]>([1000, 3500]);
  const [tempPeopleCount, setTempPeopleCount] = useState<number>(4);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleBottomSheet = () => {
    setSheetState((s) => (s === "collapsed" ? "partial" : s === "partial" ? "expanded" : "collapsed"));
  };

  // ====== 현재 위치 1회 초기화 ======
  const initMyPosition = useCallback(async () => {
    try {
      const { latitude, longitude } = await getCurrentLatLngOnce();
      setHasLocationPermission(true);
      setCurrentLatitude(latitude);
      setCurrentLongitude(longitude);

      // 지도 중심/필터 중심 동기화
      setRegion((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));
      initialCenterRef.current = { lat: latitude, lng: longitude };
      // 위치가 준비되면 위치 중심으로 최초 로드 (필터 없이 전체 or 반경 필터와 함께)
      loadRecruitsRef.current(); // 아래 useRef 콜백 참고
    } catch (e: any) {
      // 권한 거부/서비스 꺼짐/타임아웃 등
      setHasLocationPermission(false);
      setErrorMsg(e?.message || "현재 위치를 가져오지 못했습니다.");
      // 기본 서울 좌표 유지
      initialCenterRef.current = { lat: region.latitude, lng: region.longitude };
      loadRecruitsRef.current();
    }
  }, [region.latitude, region.longitude]);

  // ====== 데이터 로드 함수 ======
  const fetchFiltered = async (filterParams?: FilterDto) => {
  setLoading(true);
  setErrorMsg(null);
  try {
    let data;
    if (filterParams && Object.keys(filterParams).length > 0) {
      // ✅ toQuery 함수를 올바르게 사용
      const queryString = toQuery(filterParams);
      console.log('필터 API 호출:', `/posts/filter?${queryString}`);
      const res = await api.get(`/posts/filter?${queryString}`);
      data = res.data?.data || res.data;
    } else {
      console.log('전체 데이터 API 호출:', '/recruits');
      const res = await api.get('/recruits');
      data = res.data?.data || res.data;
    }
    
    console.log('API 응답 데이터:', data);
    setPosts(Array.isArray(data) ? data : []);
  } catch (error: any) {
    console.error('Error loading recruits:', error);
    console.error('에러 상세:', error.response?.data);
    setErrorMsg('데이터를 불러오는 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};

  // buildFilterParams: 위치가 준비된 뒤에만 center 사용
  const buildFilterParams = useCallback((): FilterDto => {
  const center = initialCenterRef.current;
  const params: FilterDto = {};
  
  console.log('필터 파라미터 생성 시작');
  console.log('현재 중심 좌표:', center);
  console.log('적용된 필터:', appliedFilters);
  
  if (center) {
    params.latitude = center.lat;
    params.longitude = center.lng;
  }

  if (appliedFilters.radius !== undefined) {
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
  
  console.log('생성된 필터 파라미터:', params);
  return params;
}, [appliedFilters]);


  // loadRecruits를 ref로 래핑해 초기 위치 세팅 이후에도 안전하게 호출
  const loadRecruitsRef = useRef(() => {});
  useEffect(() => {
    loadRecruitsRef.current = () => {
      const hasFilters = Object.keys(appliedFilters).length > 0;
      const center = initialCenterRef.current;
      if (hasFilters) {
        const filterParams = buildFilterParams();
        fetchFiltered(filterParams);
      } else {
        fetchFiltered();
      }
    };
  }, [appliedFilters, buildFilterParams, fetchFiltered]);

  // 최초 마운트: 위치 먼저
  useEffect(() => {
    initMyPosition();
  }, [initMyPosition]);

  // 필터 변경 시 재조회
  useEffect(() => {
    if (initialCenterRef.current) {
      loadRecruitsRef.current();
    }
  }, [appliedFilters]);

  const filteredJobs = Array.isArray(posts)
    ? posts.filter((job) => {
        if (searchQuery && !job.title?.toLowerCase?.().includes(searchQuery.toLowerCase())) {
          return false;
        }
        return true;
      })
    : [];

  // ====== UI 컴포넌트들 ======
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
            setTempRadius(appliedFilters.radius ?? 2);
            setOpenRadius(true);
          }}
          filled={appliedFilters.radius !== undefined}
        />
        <Btn
          label={rentLabel}
          onPress={() => {
            setTempRentRange(appliedFilters.rentRange ?? [10, 100]);
            setOpenRent(true);
          }}
          filled={appliedFilters.rentRange !== undefined}
        />
        <Btn
          label={depositLabel}
          onPress={() => {
            setTempDepositRange(appliedFilters.depositRange ?? [1000, 3500]);
            setOpenDeposit(true);
          }}
          filled={appliedFilters.depositRange !== undefined}
        />
        <Btn
          label={peopleLabel}
          onPress={() => {
            setTempPeopleCount(appliedFilters.peopleCount ?? 4);
            setOpenPeople(true);
          }}
          filled={appliedFilters.peopleCount !== undefined}
        />
      </View>
    );
  };

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
  <Modal
    visible={visible}
    transparent
    // Android 하드웨어 뒤로가기만 닫기 허용 (슬라이더 터치로는 절대 닫히지 않음)
    onRequestClose={onClose}
  >
    {/* 회색 배경 제거: 완전 투명 */}
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "transparent",
      }}
      // 바깥 영역 터치해도 아무것도 안 일어남 (닫히지 않음)
      pointerEvents="auto"
    >
      {/* 시트 컨테이너가 모든 제스처를 소비하게 함 → 슬라이더 드래그가 배경으로 전파되지 않음 */}
      <View
        onStartShouldSetResponder={() => true}
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 20,
          paddingBottom: 28,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <View style={{ width: 120, height: 6, borderRadius: 3, backgroundColor: "#e5e7eb" }} />
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
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
        onPress={toggleBottomSheet}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>
            {searchQuery?.trim() ? `'${searchQuery}' 검색 결과` : "근처 구인글"}
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
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "#F7B32B" }}>
                          월 {job.monthlyCostMax}만원
                        </Text>
                        {!!job.authorId && <Text style={{ fontSize: 14, color: "#6b7280" }}>{job.authorName}</Text>}
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
        <View style={{ backgroundColor: "#ffffff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb", padding: 16 }}>
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
            {!!searchQuery && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={{ position: "absolute", right: 12, top: 12 }}>
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
          <View style={{ position: "absolute", top: 16, alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}>
            <Text style={{ color: "#fff" }}>불러오는 중...</Text>
          </View>
        )}

        {!!errorMsg && (
          <View style={{ position: "absolute", top: 16, alignSelf: "center", backgroundColor: "rgba(239,68,68,0.9)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}>
            <Text style={{ color: "#fff" }}>{errorMsg}</Text>
          </View>
        )}

        {/* 마커: 중복 루프 제거, 숫자형인 것만 */}
        {posts
          .filter((p) => typeof p.latitude === "number" && typeof p.longitude === "number")
          .map((p) => (
            <Marker
              key={p.postId}
              coordinate={{ latitude: p.latitude, longitude: p.longitude }}
              title={p.title}
              description={p.address}
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
          setAppliedFilters(prev => { const n = { ...prev }; delete n.radius; return n; });
          setTempRadius(2);
          setOpenRadius(false);
        }}
        onConfirm={() => {
          // 소수점 1자리로 깔끔하게 저장
          const rounded = parseFloat(tempRadius.toFixed(0));
          setAppliedFilters(prev => ({ ...prev, radius: rounded }));
          setOpenRadius(false);
        }}
      >
        <RNSlider
          value={tempRadius}
          onValueChange={(v) => setTempRadius(v)}
          minimumValue={0}
          maximumValue={500}
          step={2}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ color: "#9ca3af" }}>0km</Text>
          {/* 표시만 toFixed(1) */}
          <Text style={{ fontWeight: "600" }}>~ {tempRadius.toFixed(0)}km</Text>
          <Text style={{ color: "#9ca3af" }}>500km</Text>
        </View>
      </BottomSheetLike>


      {/* 월세 */}
      <BottomSheetLike
        visible={openRent}
        title="월세"
        onClose={() => setOpenRent(false)}
        onReset={() => {
          setAppliedFilters(prev => { const n = { ...prev }; delete n.rentRange; return n; });
          setTempRentRange([10, 100]); setOpenRent(false);
        }}
        onConfirm={() => { setAppliedFilters(prev => ({ ...prev, rentRange: tempRentRange })); setOpenRent(false); }}
      >
        <MultiSlider
          values={tempRentRange}
          onValuesChange={(vals) => setTempRentRange([Math.round(vals[0]), Math.round(vals[1])])}
          min={10}
          max={200}
          step={1}
          allowOverlap={false}
          snapped
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
          setAppliedFilters(prev => { const n = { ...prev }; delete n.depositRange; return n; });
          setTempDepositRange([1000, 3500]); setOpenDeposit(false);
        }}
        onConfirm={() => { setAppliedFilters(prev => ({ ...prev, depositRange: tempDepositRange })); setOpenDeposit(false); }}
      >
        <MultiSlider
          values={tempDepositRange}
          onValuesChange={(vals) => setTempDepositRange([Math.round(vals[0]), Math.round(vals[1])])}
          min={0}
          max={5000}
          step={50}
          allowOverlap={false}
          snapped
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
          <Text style={{ color: "#9ca3af" }}>0만원</Text>
          <Text style={{ fontWeight: "600" }}>{tempDepositRange[0]}만원 ~ {tempDepositRange[1]}만원</Text>
          <Text style={{ color: "#9ca3af" }}>5000만원</Text>
        </View>
      </BottomSheetLike>


      {/* 인원 */}
      <BottomSheetLike
        visible={openPeople}
        title="인원"
        onClose={() => setOpenPeople(false)}
        onReset={() => {
          setAppliedFilters(prev => { const n = { ...prev }; delete n.peopleCount; return n; });
          setTempPeopleCount(4); setOpenPeople(false);
        }}
        onConfirm={() => { setAppliedFilters(prev => ({ ...prev, peopleCount: tempPeopleCount })); setOpenPeople(false); }}
      >
        <RNSlider
          value={tempPeopleCount}
          onValueChange={(v) => setTempPeopleCount(Math.round(v))}
          minimumValue={2}
          maximumValue={10}
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

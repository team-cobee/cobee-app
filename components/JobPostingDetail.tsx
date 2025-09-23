import React, { useState, useEffect } from "react";
import { api } from "@/api/api";
import { getAccessToken } from "@/api/tokenStorage";
import {
  Gender,
  Lifestyle,
  Snoring,
  Smoking,
  Personality,
  Pets,
  RecruitStatus,
  MatchStatus,
} from "@/types/enums";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Dimensions,
  Alert,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import { set } from "react-hook-form";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getContrastColor } from "./ui/utils";

// --- UI 컴포넌트 재구현 ---

// 지원하기 정보도 있어야 함. 내가 이 구인글에 지원했는지 여부... ㄷㄷㄷ



// 인터페이스 정의 모음집 
interface Comment {
  commentId: number;
  parentId: number | null;
  content: string;
  nickname: string;
  profileImg: string | null;
}

interface Reply {
  id: number;
  author: string;
  content: string;
  timeAgo: string;
}

interface author {
  id: number,
  name : string,
  birthdate : string
}

interface RecruitResponse {
  postId: number;
  title: string;
  viewed: number;
  bookmarked: number;
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


interface profile {
    name : string, 
    gender : Gender,
    profileImg : string,
    info : string
  }


// 지원 기록 응답
interface applyRecord {
  id: number;
  appliedPostId: number;
  appliedMemberId: number;
  isMatched: MatchStatus;
}


interface JobPostingDetailProps {
  jobId: number | null;
  onBack: () => void;
  onEdit?: (jobId: number) => void;
  onDelete?: (jobId: number) => void;
  showEditButtons?: boolean;
}

function getAge(birthdate: string): number {
  const birthYear = new Date(birthdate).getFullYear();
  const currentYear = new Date().getFullYear();

  return currentYear - birthYear + 1;
}

// --- 메인 컴포넌트 ---
export default function JobPostingDetail({
  jobId,
  onBack,
  onEdit,
  onDelete,
  showEditButtons,
}: JobPostingDetailProps) {
  const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => <View style={[styles.card, style]}>{children}</View>;

const CardHeader = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => <View style={[styles.cardHeader, style]}>{children}</View>;

const CardContent = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => <View style={[styles.cardContent, style]}>{children}</View>;

const Button = ({
  children,
  onPress,
  style,
  textStyle,
  disabled,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[styles.button, style, disabled && styles.buttonDisabled]}
  >
    <Text style={[styles.buttonText, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

const Badge = ({
  children,
  style,
  textStyle,
}: {
  children: React.ReactNode;
  style?: any;
  textStyle?: any;
}) => (
  <View style={[styles.badge, style]}>
    <Text style={[styles.badgeText, textStyle]}>{children}</Text>
  </View>
);

const Avatar = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => <View style={[styles.avatar, style]}>{children}</View>;

const AvatarFallback = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) => <Text style={[styles.avatarFallback, style]}>{children}</Text>;

  const editButtons = showEditButtons ?? false;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);

  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [recruit, setRecruit] = useState<RecruitResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [logined, setAuthor] = useState<author>();
  const [publicProfile, setPublicProfile] = useState<profile>();
  const [loginUser, setLoginUser] = useState<author | null>(null);

  const ageText = logined?.birthdate ? `${getAge(logined.birthdate)}세` : '';

  // 지원하기 api 
  const applyForRecruit = async (postId: number) => {
    try {
      const res = await api.post('/apply', { postId }); 
      const id = res.data?.data?.postId ?? postId;
      setIsApplied(true);
      setShowApplyModal(false);
    } catch (e: any) {
      console.error(e);
      Alert.alert('에러', e?.response?.data?.message ?? '상세 조회에 실패했습니다.');
    }
  };

  const getMyInfo = async () => {
    const res = await api.get('/auth');
    setAuthor(res.data?.data);
  }

  useEffect(() => {
    if (!recruit?.postId) return;
      // 글 바뀔 때 상태 초기화 + 로딩 시작
      getMyInfo();
      setIsApplied(false);
      setCheckingApplied(true);
      fetchCheckStatus(recruit.postId); 
    }, 
  [recruit?.postId, comments.length]);



  // 지원 여부 체크 api
  const fetchCheckStatus = async (postId: number) => {
  try {
    const res = await api.get(`/apply/isApplied/${postId}`);
    setIsApplied(!!res.data?.data);
  } catch (e) {
    console.error(e);
    setIsApplied(false);
  } finally {
    setCheckingApplied(false); 
  }
};

const postComment = async (content: string, parentId: number | null) => { 
  const token = await getAccessToken().catch(() => null);  
  const res = await api.post(`/posts/${jobId}/comments`, 
    { postId: jobId, content, parentId },
    {headers: token ? { Authorization: `Bearer ${token}` } : {}},    
  );  
  console.log(res);
  setComments(prev => [...prev, res.data.data]);
}
const getAllComments = async (postId : number) => {
  const token = await getAccessToken().catch(() => null);  
  const res = await api.get(`/posts/${jobId}/comments`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}, 
  });
  console.log(res.data.data);
  setComments(res.data.data);
}

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const authInfo = await api.get("/auth");
        const profileInfo = await api.get("/public-profiles");
        getAllComments(jobId as number);
        if (cancelled) return;
        setAuthor(authInfo.data?.data ?? null);
        setPublicProfile(profileInfo.data?.data ?? null);
      } catch (e) {
        console.error(e);
        Alert.alert("에러", "글 정보를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const isOwner = !!(logined && recruit && logined?.id === recruit?.authorId);

  useEffect(() => {
    if (jobId == null) return;

    let cancelled = false;
    setRecruit(null); // ★ 이전 글 제목이 잠깐 보이는 것 방지
    setComments([]); // ★ 이전 댓글 잔상 방지

    (async () => {
      try {
        const res = await api.get(`/recruits/${jobId}`);
        if (cancelled) return;
        const data = res.data?.data;
        setRecruit(data ?? null);
        setComments(Array.isArray(data?.comments) ? data.comments : []);
      } catch (e) {
        if (!cancelled) Alert.alert("에러", "구인글을 불러오지 못했습니다");
      }
    })();

    return () => {
      cancelled = true;
    }; // ★ 이전 요청 무시
  }, [jobId]);

  const getGenderText = (gender: Gender) => {
    const map: Record<Gender, string> = {
      [Gender.Male]: "남자",
      [Gender.Female]: "여자",
      [Gender.None]: "상관없음",
    };
    return map[gender] ?? gender;
  };

  // Lifestyle
  const getLifestyleText = (lifestyle?: Lifestyle) => {
    if (!lifestyle) return "상관없음";
    const map: Record<Lifestyle, string> = {
      [Lifestyle.Morning]: "아침형",
      [Lifestyle.Evening]: "저녁형",
      [Lifestyle.None]: "상관없음",
    };
    return map[lifestyle] ?? lifestyle;
  };

  // Personality
  const getPersonalityText = (personality?: Personality) => {
    if (!personality) return "상관없음";
    const map: Record<Personality, string> = {
      [Personality.Introvert]: "집순이",
      [Personality.Extrovert]: "밖순이",
      [Personality.None]: "상관없음",
    };
    return map[personality] ?? personality;
  };

  // Smoking
  const getSmokingText = (smoking?: Smoking) => {
    if (!smoking) return "상관없음";
    const map: Record<Smoking, string> = {
      [Smoking.None]: "흡연 가능",
      [Smoking.Impossible]: "비흡연"
    };
    return map[smoking] ?? smoking;
  };

  // Snoring
  const getSnoringText = (snoring?: Snoring) => {
    if (!snoring) return "상관없음";
    const map: Record<Snoring, string> = {
      [Snoring.None]: "코골이 있음",
      [Snoring.Impossible]: "코골이 없음",
    };
    return map[snoring] ?? snoring;
  };

  // Pets
  const getPetText = (pet?: Pets) => {
    if (!pet) return "상관없음";
    const map: Record<Pets, string> = {
      [Pets.None]: "있음",
      [Pets.Impossible]: "없음",
      [Pets.Possible]: "가능"
    };
    return map[pet] ?? pet;
  };

  // RoomStatus
  const getRoomStatusText = (hasRoom: boolean) =>
    hasRoom ? "방 있음" : "함께 찾기";

  // 핸들러 함수들 (React Native에 맞게 수정)
  // const nextImage = () => {
  //   if (recruit?.hasRoom) {
  //     setCurrentImageIndex((prev) => prev === recruit.imgUrl.length - 1 ? 0 : prev + 1);
  //   }
  // };

  // const prevImage = () => {
  //   if (recruit.imgUrl.length > 0) {
  //     setCurrentImageIndex((prev) => prev === 0 ? recruit.imgUrl.length - 1 : prev - 1);
  //   }
  // };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      "알림",
      isBookmarked ? "북마크가 해제되었습니다." : "북마크에 추가되었습니다."
    );
  };

  // 원댓글 추가
  const handleAddComment = () => {
    postComment(newComment, null);
  };

  // 대댓글 추가
  const handleAddReply = (parentCommentId: number) => {
    postComment(newReply,parentCommentId);
  };

  // 원댓글만 추출
  const rootComments = comments.filter((c) => c.parentId === null);

  // parentId -> replies[] 매핑
  const repliesByParent = React.useMemo(() => {
    const map: Record<number, Comment[]> = {};
    comments.forEach((c) => {
      if (c.parentId != null) {
        (map[c.parentId] ||= []).push(c);
      }
    });
    return map;
  }, [comments]);

  const submitReport = (reason: string) => {
    Alert.alert(
      "완료",
      `신고가 접수되었습니다. (${reason}) 검토 후 조치하겠습니다.`
    );
    setShowReportModal(false);
  };

  const handleEdit = () => {
    if (jobId && onEdit) onEdit(jobId);
  };

  const handleDelete = () => {
    if (jobId && onDelete) {
      onDelete(jobId);
      setShowDeleteDialog(false);
    }
  };

  const handleApply = () => {
    setIsApplied(true);
    setShowApplyModal(false);
    Alert.alert(
      "완료",
      "지원이 완료되었습니다! 작성자에게 공개 프로필이 전송되었습니다."
    );
  };

  if (!recruit) {
    return (
      <SafeAreaView>
        <Text>불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>구인글</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContentContainer, {flexGrow: 1}]}>
        {/* 방 이미지 캐러셀 */}
        {/* {recruit.hasRoom === true && recruit.imgUrl.length > 0 && (
          <View style={{ width: screenWidth, height: screenWidth * 0.5625 }}>
            {<Image
              source={{ uri: recruit.imgUrl[currentImageIndex] }}
              style={styles.carouselImage}
              resizeMode="cover"
            /> }
            {recruit.imgUrl.length > 1 && (
              <>
                {<TouchableOpacity onPress={prevImage} style={[styles.carouselNav, styles.carouselNavLeft]}>
                  <Text style={styles.carouselNavText}>{'<'}</Text>
                </TouchableOpacity>}
                <TouchableOpacity onPress={nextImage} style={[styles.carouselNav, styles.carouselNavRight]}>
                  <Text style={styles.carouselNavText}>{'>'}</Text>
                </TouchableOpacity>
                <View style={styles.carouselIndicator}>
                  <Text style={styles.carouselIndicatorText}>
                    {currentImageIndex + 1}/{recruit.imgUrl.length}
                  </Text>
                </View>
              </>
            )}
          </View>
        )} */}

        <View style={styles.contentPadding}>
          {/* 기본 정보 */}
          <View>
            <View style={styles.titleContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mainTitle}>{recruit.title}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={16} color="#6b7280" />
                  <Text style={styles.mutedText}>
                    {recruit.hasRoom === true
                      ? recruit.address
                      : recruit.address}
                  </Text>
                </View>
                <View style={styles.statsContainer}>
                  {/* <Text style={styles.mutedText}>조회 {recruit.viewCount}</Text>
                  <Text style={styles.mutedText}>북마크 {recruit.bookmarkCount}</Text> */}
                  <Text style={styles.mutedText}>2시간 전</Text>
                </View>
              </View>
              <TouchableOpacity onPress={toggleBookmark}>
                <Text
                  style={[
                    styles.iconTextLg,
                    isBookmarked && { color: "#F7B32B" },
                  ]}
                >
                  ♥
                </Text>
              </TouchableOpacity>
            </View>
            <Badge
              style={
                recruit.status !== RecruitStatus.Recruiting &&
                styles.badgeSecondary
              }
            >
              <Text
                style={
                  recruit.status !== RecruitStatus.Recruiting &&
                  styles.badgeSecondaryText
                }
              >
                {recruit.status}
              </Text>
            </Badge>
          </View>

          {/* 작성자 정보 */}
          <Card>
            <CardHeader>
              <Text style={styles.cardTitle}>모집자 정보</Text>
            </CardHeader>
            <CardContent>
              <View style={styles.authorInfo}>
                {/* <Avatar>
                  <AvatarFallback>{recruit.author.avatar}</AvatarFallback>
                </Avatar> */}
                <View>
                  <Text style={styles.fontMedium}>{recruit.authorName}</Text>
                  <Text style={styles.mutedTextSm}>
                    {recruit.authorGender} • {getAge(recruit.birthdate)}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 모집 조건 */}
          <Card>
            <CardHeader>
              <Text style={styles.cardTitle}>모집 조건</Text>
            </CardHeader>
            <CardContent>
              <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>모집인원</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons name="people" size={16} color="#6b7280" />
                    <Text style={styles.fontMedium}>
                      {recruit.recruitCount}명
                    </Text>
                  </View>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>방 여부</Text>
                  <Text style={styles.fontMedium}>
                    {getRoomStatusText(recruit.hasRoom)}
                  </Text>
                </View>
              </View>
              <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>보증금</Text>
                  <Text style={styles.fontMedium}>
                    {recruit.rentalCostMin === recruit.rentalCostMax
                      ? `${recruit.rentalCostMin}만원`
                      : `${recruit.rentalCostMin}~${recruit.rentalCostMax}만원`}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>월세</Text>
                  <Text style={styles.fontMedium}>
                    {recruit.monthlyCostMin === recruit.monthlyCostMax
                      ? `${recruit.monthlyCostMin}만원`
                      : `${recruit.monthlyCostMin}~${recruit.monthlyCostMax}만원`}
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <Text style={styles.subCardTitle}>선호 조건</Text>
              <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>선호 성별</Text>
                  <Text style={styles.fontMedium}>
                    {getGenderText(recruit.preferedGender)}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>선호 나이대</Text>
                  <Text style={styles.fontMedium}>
                    {recruit.preferedMinAge === recruit.preferedMaxAge
                      ? `${recruit.preferedMinAge}세`
                      : `${recruit.preferedMinAge}~${recruit.preferedMaxAge}세`}
                  </Text>
                </View>
              </View>
              <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>생활 패턴</Text>
                  <Text style={styles.fontMedium}>
                    {getLifestyleText(recruit.preferedLifeStyle)}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>성격 유형</Text>
                  <Text style={styles.fontMedium}>
                    {getPersonalityText(recruit.preferedPersonality)}
                  </Text>
                </View>
              </View>
              <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>흡연 여부</Text>
                  <Text style={styles.fontMedium}>
                    {getSmokingText(recruit.preferedSmoking)}
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>코골이</Text>
                  <Text style={styles.fontMedium}>
                    {getSnoringText(recruit.preferedSnoring)}
                  </Text>
                </View>
              </View>
              <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                  <Text style={styles.mutedTextSm}>반려동물</Text>
                  <Text style={styles.fontMedium}>
                    {getPetText(recruit.preferedHasPet)}
                  </Text>
                </View>
                <View style={styles.gridItem}></View>
              </View>
            </CardContent>
          </Card>

          {/* 상세 설명 & 추가 정보 */}
          {recruit.detailDescript && (
            <Card>
              <CardHeader>
                <Text style={styles.cardTitle}>상세 설명</Text>
              </CardHeader>
              <CardContent>
                <Text style={styles.descriptionText}>
                  {recruit.detailDescript}
                </Text>
              </CardContent>
            </Card>
          )}

          {recruit.additionalDescript && (
            <Card>
              <CardHeader>
                <Text style={styles.cardTitle}>
                  {recruit.hasRoom === true ? "희망 조건" : "추가 정보"}
                </Text>
              </CardHeader>
              <CardContent>
                <Text style={styles.descriptionText}>
                  {recruit.additionalDescript}
                </Text>
              </CardContent>
            </Card>
          )}

          {/* 댓글 */}
          <Card>
            <CardHeader>
              <Text style={styles.cardTitle}>댓글 {comments.length}</Text>
            </CardHeader>
            <CardContent>
              {rootComments.map((comment) => (
                <View key={comment.commentId} style={{ marginBottom: 16 }}>
                  {/* 원댓글 */}
                  <View style={styles.commentContainer}>
                    {comment.profileImg ? (
                      <Image
                        source={{ uri: comment.profileImg }}
                        style={[styles.commentAvatar, { borderRadius: 16 }]}
                      />
                    ) : (
                      <Avatar style={styles.commentAvatar}>
                        <AvatarFallback style={styles.commentAvatarText}>
                          {comment.nickname.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <View style={{ flex: 1 }}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>
                          {comment.nickname}
                        </Text>
                        {/* 서버에 time 정보가 없으니 생략 혹은 추후 포맷팅 */}
                      </View>
                      <Text style={[styles.mutedText, { marginBottom: 8 }]}>
                        {comment.content}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setReplyingTo(
                            replyingTo === comment.commentId
                              ? null
                              : comment.commentId
                          )
                        }
                      >
                        <Text style={styles.replyButtonText}>↩︎ 답글</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity>
                      <Text style={styles.mutedText}>...</Text>
                    </TouchableOpacity>
                  </View>

                  {/* 대댓글 목록 */}
                  {(repliesByParent[comment.commentId] || []).map((reply) => (
                    <View
                      key={reply.commentId}
                      style={[
                        styles.commentContainer,
                        { marginLeft: 32, marginTop: 12 },
                      ]}
                    >
                      {reply.profileImg ? (
                        <Image
                          source={{ uri: reply.profileImg }}
                          style={[styles.replyAvatar, { borderRadius: 14 }]}
                        />
                      ) : (
                        <Avatar style={styles.replyAvatar}>
                          <AvatarFallback style={styles.replyAvatarText}>
                            {reply.nickname.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <View style={{ flex: 1 }}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentAuthor}>
                            {reply.nickname}
                          </Text>
                        </View>
                        <Text style={styles.mutedText}>{reply.content}</Text>
                      </View>

                      <TouchableOpacity>
                        <Text style={styles.mutedText}>...</Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* 대댓글 입력창 */}
                  {replyingTo === comment.commentId && (
                    <View style={{ marginLeft: 32, marginTop: 10 }}>
                      <View style={styles.inputContainer}>
                        <TextInput
                          placeholder="답글을 입력하세요..."
                          value={newReply}
                          onChangeText={setNewReply}
                          style={styles.textInput}
                          onSubmitEditing={() =>
                            handleAddReply(comment.commentId)
                          }
                        />
                        <Button
                          onPress={() => handleAddReply(comment.commentId)}
                          disabled={!newReply.trim()}
                          style={styles.inputButton}
                        >
                          <Text style={styles.inputButtonText}>등록</Text>
                        </Button>
                      </View>
                    </View>
                  )}
                </View>
              ))}

              {/* 원댓글 입력 */}
              <View style={[styles.divider, { marginVertical: 16 }]} />
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="댓글을 입력하세요..."
                  value={newComment}
                  onChangeText={setNewComment}
                  style={styles.textInput}
                  onSubmitEditing={handleAddComment}
                />
                <Button
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                  style={styles.inputButton}
                >
                  <Text style={styles.inputButtonText}>등록</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>

      {/* 하단 액션 버튼 */}
      {/* <View style={styles.bottomBar}>
        {showEditButtons ? (
          <View style={styles.bottomBarInner}>
            <Button onPress={handleEdit} style={[styles.bottomButton, styles.editButton]}>
              <Text style={[styles.bottomButtonText, styles.editButtonText]}>수정하기</Text>
            </Button>
            <Button onPress={() => setShowDeleteDialog(true)} style={[styles.bottomButton, styles.deleteButton]}>
              <Text style={styles.bottomButtonText}>삭제하기</Text>
            </Button>
          </View>
        ) : (
          <Button
            onPress={() => setShowApplyModal(true)}
            disabled={isApplied}
            style={[styles.bottomButtonFull, { backgroundColor: isApplied ? '#A0A0A0' : '#F7B32B' }]}
          >
            <Text style={styles.bottomButtonText}>{isApplied ? '지원 완료' : '지원하기'}</Text>
          </Button>
        )}
      </View> */}

      <View style={styles.bottomBar}>
        {isOwner ? (
          <View style={styles.bottomBarInner}>
            <Button
              onPress={() => onEdit?.(recruit.postId)}
              style={[styles.bottomButton, styles.editOutline]}
              textStyle={styles.editOutlineText}
            >
              수정하기
            </Button>

            <Button
              onPress={() => setShowDeleteDialog(true)}
              style={[styles.bottomButton, styles.deleteSolid]}
            >
              삭제하기
            </Button>
          </View>
        ) : (
          <Button
            onPress={() => setShowApplyModal(true)}
            disabled={checkingApplied || isApplied}
            style={[
              styles.bottomButtonFull,
              checkingApplied || isApplied ? styles.applyDisabled : styles.applySolid,
            ]}
          >
            {checkingApplied ? "상태 확인중..." : (isApplied ? "지원 완료" : "지원하기")}
          </Button>
        )}
      </View>

      {/* 삭제 확인 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteDialog}
        onRequestClose={() => setShowDeleteDialog(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowDeleteDialog(false)}
        >
          <Pressable style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>구인글 삭제</Text>
            <Text style={styles.dialogDescription}>
              정말로 이 구인글을 삭제하시겠습니까? 삭제된 구인글은 복구할 수
              없습니다.
            </Text>
            <View style={styles.dialogFooter}>
              <Button
                onPress={() => setShowDeleteDialog(false)}
                style={[styles.dialogButton, styles.dialogCancelButton]}
              >
                <Text style={styles.dialogCancelButtonText}>취소</Text>
              </Button>
              <Button
                onPress={handleDelete}
                style={[styles.dialogButton, styles.dialogDeleteButton]}
              >
                <Text style={styles.dialogButtonText}>삭제하기</Text>
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 지원하기/초대/신고 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showApplyModal || showInviteModal || showReportModal}
        onRequestClose={() => {
          setShowApplyModal(false);
          setShowInviteModal(false);
          setShowReportModal(false);
        }}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => {
            setShowApplyModal(false);
            setShowInviteModal(false);
            setShowReportModal(false);
          }}
        >
          <Pressable style={styles.modalContent}>
            {showApplyModal && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>지원하기</Text>
                  <TouchableOpacity onPress={() => setShowApplyModal(false)}>
                    <Text>X</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalDescription}>
                  공개 프로필이 모집자에게 전송됩니다.
                </Text>
                <View style={styles.profilePreview}>
                  <View style={styles.authorInfo}>
                    <Avatar>
                      <AvatarFallback>나</AvatarFallback>
                    </Avatar>
                    <View>
                      <Text style={styles.fontMedium}>{publicProfile?.name}</Text>
                      <Text style={styles.mutedTextSm}>{publicProfile?.gender} • {ageText}</Text>
                    </View>
                  </View>
                  <Text style={styles.mutedText}>
                    {publicProfile?.info || "공개 프로필의 자기소개가 없습니다."}
                  </Text>
                </View>
                <Text
                  style={[styles.mutedText, { fontSize: 12, marginBottom: 24 }]}
                >
                  * 지원 후 작성자가 수락하면 채팅으로 연결됩니다.
                </Text>
                <View style={styles.modalButtonContainer}>
                  <Button
                    onPress={() => setShowApplyModal(false)}
                    style={[styles.modalButton, styles.modalCancelButton]}
                  >
                    <Text style={{ color: "#333" }}>취소</Text>
                  </Button>
                  <Button
                    onPress={() => applyForRecruit(recruit.postId)}
                    style={[styles.modalButton, { backgroundColor: "#F7B32B" }]}
                  >
                    <Text style={{ color: "#fff" }}>지원하기</Text>
                  </Button>
                </View>
              </>
            )}
            {showInviteModal && <>{/* 룸메이트 초대 모달 UI */}</>}
            {showReportModal && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>신고하기</Text>
                  <TouchableOpacity onPress={() => setShowReportModal(false)}>
                    <Text>X</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalDescription}>
                  신고 사유를 선택해 주세요.
                </Text>
                <TouchableOpacity
                  onPress={() => submitReport("스팸/광고")}
                  style={styles.reportReasonButton}
                >
                  <Text>스팸/광고</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => submitReport("허위 정보")}
                  style={styles.reportReasonButton}
                >
                  <Text>허위 정보</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => submitReport("부적절한 내용")}
                  style={styles.reportReasonButton}
                >
                  <Text>부적절한 내용</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => submitReport("기타")}
                  style={styles.reportReasonButton}
                >
                  <Text>기타</Text>
                </TouchableOpacity>
                <Button
                  onPress={() => setShowReportModal(false)}
                  style={[
                    styles.modalButton,
                    styles.modalCancelButton,
                    { width: "100%", marginTop: 24 },
                  ]}
                >
                  <Text style={{ color: "#333" }}>취소</Text>
                </Button>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// --- 스타일시트 ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonText: { fontSize: 24 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  scrollContentContainer: { paddingBottom: 120 },
  carouselImage: { width: "100%", height: "100%" },
  carouselNav: {
    position: "absolute",
    top: "50%",
    marginTop: -16,
    width: 32,
    height: 32,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselNavLeft: { left: 16 },
  carouselNavRight: { right: 16 },
  carouselNavText: { color: "white", fontSize: 20, fontWeight: "bold" },
  carouselIndicator: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  carouselIndicatorText: { color: "white", fontSize: 12 },
  contentPadding: { padding: 24, gap: 24 },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  mainTitle: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  statsContainer: { flexDirection: "row", alignItems: "center", gap: 16 },
  mutedText: { fontSize: 14, color: "#6b7280" },
  mutedTextSm: { fontSize: 12, color: "#6b7280" },
  iconText: { fontSize: 16 },
  iconTextLg: { fontSize: 24, color: "#9ca3af" },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardHeader: { paddingBottom: 12, paddingTop: 16, paddingHorizontal: 16 },
  cardContent: { padding: 16, paddingTop: 0 },
  cardTitle: { fontWeight: "500", fontSize: 16 },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  fontMedium: { fontWeight: "500", fontSize: 14 },
  gridContainer: { flexDirection: "row", gap: 16, marginBottom: 16 },
  gridItem: { flex: 1, gap: 2 },
  divider: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingTop: 16,
    marginTop: 4,
  },
  subCardTitle: { fontWeight: "500", marginBottom: 12, fontSize: 14 },
  descriptionText: { fontSize: 14, lineHeight: 22 },
  commentContainer: { flexDirection: "row", gap: 12 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16 },
  commentAvatarText: { fontSize: 12 },
  replyAvatar: { width: 28, height: 28, borderRadius: 14 },
  replyAvatarText: { fontSize: 10 },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  commentAuthor: { fontSize: 14, fontWeight: "500" },
  replyButtonText: { fontSize: 12, color: "#F7B32B" },
  inputContainer: { flexDirection: "row", gap: 8, alignItems: "center" },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  inputButton: { height: 40, paddingHorizontal: 16 },
  inputButtonText: { color: "white", fontWeight: "600" },

  // ▼ 추가
  editOutline: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
  },
  editOutlineText: { color: "#111827" },

  deleteSolid: { backgroundColor: "#ef4444" },

  applySolid: { backgroundColor: "#111827" },
  applyDisabled: { backgroundColor: "#A0A0A0" },

  // (선택) 하단바 그림자 살짝
  // bottomBar: {
  //   position: "absolute",
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: "white",
  //   borderTopWidth: 1,
  //   borderColor: "#e5e7eb",
  //   padding: 24,
  //   paddingTop: 16,
  //   // ↓ 살짝 떠 보이게
  //   shadowColor: '#000',
  //   shadowOpacity: 0.08,
  //   shadowRadius: 12,
  //   elevation: 6,
  // },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderColor: "#e5e7eb",
    padding: 24,
    paddingTop: 16,
  },
  bottomBarInner: { flexDirection: "row", gap: 16 },
  bottomButton: {
    flex: 1,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  bottomButtonFull: {
    width: "100%",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  bottomButtonText: { fontSize: 18, fontWeight: "600", color: "white" },
  editButton: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  editButtonText: { color: "#1f2937" },
  deleteButton: { backgroundColor: "#ef4444" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  dialogContainer: {
    backgroundColor: "white",
    margin: 24,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
  },
  dialogTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  dialogDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  dialogFooter: { flexDirection: "row", gap: 12, width: "100%" },
  dialogButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  dialogCancelButton: { backgroundColor: "#e5e7eb" },
  dialogCancelButtonText: { color: "#374151", fontWeight: "500" },
  dialogDeleteButton: { backgroundColor: "#ef4444" },
  dialogButtonText: { color: "white", fontWeight: "600" },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "600" },
  modalDescription: { fontSize: 14, color: "#6b7280", marginBottom: 24 },
  profilePreview: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  modalButtonContainer: { flexDirection: "row", gap: 12 },
  modalButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  modalCancelButton: { borderWidth: 1, borderColor: "#e5e7eb" },
  reportReasonButton: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },

  // UI 컴포넌트 스타일
  badge: {
    backgroundColor: "#F7B32B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  badgeSecondary: { backgroundColor: "#e5e7eb" },
  badgeText: { color: "white", fontWeight: "500", fontSize: 12 },
  badgeSecondaryText: { color: "#374151" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallback: { fontWeight: "500" },
  button: {
    backgroundColor: "#F7B32B",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "600" },
  buttonDisabled: { backgroundColor: "#d1d5db" },
});

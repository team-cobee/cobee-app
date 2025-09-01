import React, { useState } from 'react';
import { Gender, Lifestyle, Snoring, Smoking, Personality, Pets } from '@/types/enums';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- UI 컴포넌트 재구현 ---

const Card = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const CardHeader = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.cardHeader, style]}>{children}</View>
);

const CardContent = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.cardContent, style]}>{children}</View>
);

const Button = ({ children, onPress, style, textStyle, disabled }: { children: React.ReactNode; onPress: () => void; style?: any; textStyle?: any; disabled?: boolean }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.button, style, disabled && styles.buttonDisabled]}>
    <Text style={[styles.buttonText, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

const Badge = ({ children, style, textStyle }: { children: React.ReactNode; style?: any; textStyle?: any }) => (
    <View style={[styles.badge, style]}>
        <Text style={[styles.badgeText, textStyle]}>{children}</Text>
    </View>
);

const Avatar = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.avatar, style]}>{children}</View>
);

const AvatarFallback = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <Text style={[styles.avatarFallback, style]}>{children}</Text>
);


// --- 인터페이스 정의 ---
interface Comment {
  id: number;
  author: string;
  content: string;
  timeAgo: string;
  replies?: Reply[];
}

interface Reply {
  id: number;
  author: string;
  content: string;
  timeAgo: string;
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


interface JobPostingDetailProps {
  jobId: string | null;
  onBack: () => void;
  onEdit?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
  showEditButtons?: boolean;
}



// --- 메인 컴포넌트 ---
export default function JobPostingDetail({ jobId, onBack, onEdit, onDelete, showEditButtons = false }: JobPostingDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "박지은",
      content: "안녕하세요! 혹시 여성도 지원 가능한가요?",
      timeAgo: "1시간 전",
      replies: [
        {
          id: 11,
          author: "김민수",
          content: "네! 성별 상관없이 지원 가능합니다 😊",
          timeAgo: "30분 전"
        }
      ]
    },
    {
      id: 2,
      author: "이준혁",
      content: "위치가 정말 좋네요. 더 자세한 정보 알 수 있을까요?",
      timeAgo: "3시간 전"
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 목 데이터 함수 (변경 없음)
  const getJobDetailData = (jobId: string | null) => {
    if (jobId === 'no-room') {
      return {
        id: 'no-room',
        title: "홍대 근처에서 함께 방 찾을 룸메이트 구해요",
        author: { nickname: "이서연", gender: "여성", age: "20대 초반", avatar: "이서" },
        recruitCount: 2, depositMin: 1000, depositMax: 1500, monthlyRentMin: 50, monthlyRentMax: 80,
        preferredGender: "female", ageMin: 20, ageMax: 28, lifestyle: "evening", personality: "outgoing",
        smokingPreference: "no-smoking", snoringPreference: "no-snoring", petPreference: "any",
        hasRoom: "none", address: "",
        description: `안녕하세요! 홍대 근처에서 함께 방을 찾을 룸메이트를 구하고 있습니다.\n\n저는 현재 대학생이고, 주로 저녁 시간대에 활동적인 편입니다. 친구들과 어울리는 것을 좋아하지만 집에서는 서로의 프라이버시를 존중하며 지내고 싶어요.\n\n홍대, 합정, 상수 근처로 투룸이나 원룸 2개를 생각하고 있습니다. 대중교통이 편리하고 주변에 편의시설이 많은 곳이면 좋겠어요.`,
        additionalInfo: `희망 지역: 홍대입구역, 합정역, 상수역 근처 (도보 10분 이내)\n선호 조건: 신축 또는 리모델링 건물, 분리형 원룸 또는 투룸\n추가 요청: 애완동물 동반 가능한 곳 (작은 강아지 1마리)`,
        location: "서울 마포구 홍대 일대", status: "모집중", createdAt: "2024-08-04T08:30:00Z",
        viewCount: 32, bookmarkCount: 12, room: { hasRoom: false, images: [] }
      };
    } else {
      return {
        id: jobId || "1",
        title: "강남역 근처 깔끔한 원룸 룸메이트 구해요",
        author: { nickname: "김민수", gender: "남성", age: "20대 중반", avatar: "KM" },
        recruitCount: 3, depositMin: 800, depositMax: 1200, monthlyRentMin: 60, monthlyRentMax: 80,
        preferredGender: "any", ageMin: 22, ageMax: 30, lifestyle: "morning", personality: "homebody",
        smokingPreference: "no-smoking", snoringPreference: "any", petPreference: "impossible",
        hasRoom: "has", address: "서울 강남구 역삼동 123-45",
        description: `안녕하세요! 강남역에서 도보 5분 거리에 있는 깔끔한 원룸에서 함께 살 룸메이트를 찾고 있습니다.\n\n저는 평일에는 회사에 다니고 있어서 주로 저녁 시간과 주말에만 집에 있습니다. 깔끔하고 조용한 성격이라 서로 불편함 없이 생활할 수 있을 것 같아요.\n\n매일 아침 7시에 출근해서 저랑 비슷한 시간대에 출근하시는 분이면 좋을 것 같습니다.`,
        additionalInfo: `주변에 편의시설이 많고, 지하철역과 가까워서 교통이 편리합니다.\n가구/가전 완비되어 있어서 짐만 가져오시면 바로 생활 가능합니다.`,
        location: "서울 강남구 역삼동", status: "모집중", createdAt: "2024-08-04T10:00:00Z",
        viewCount: 47, bookmarkCount: 8,
        room: {
          hasRoom: true,
          images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop"
          ]
        }
      };
    }
  };

  const jobDetail = getJobDetailData(jobId);

  // 헬퍼 함수들 (변경 없음)
  const getGenderText = (gender: string) => ({ male: '남자', female: '여자', any: '상관없음' }[gender] || gender);
  const getLifestyleText = (lifestyle: string) => ({ morning: '아침형', evening: '저녁형' }[lifestyle] || lifestyle);
  const getPersonalityText = (personality: string) => ({ homebody: '집순이', outgoing: '밖순이' }[personality] || personality);
  const getSmokingText = (smoking: string) => ({ 'no-smoking': '흡연 불가', any: '상관없음' }[smoking] || smoking);
  const getSnoringText = (snoring: string) => ({ any: '상관없음', 'no-snoring': '코골이 불가' }[snoring] || snoring);
  const getPetText = (pet: string) => ({ possible: '가능', impossible: '불가능', any: '상관없음' }[pet] || pet);
  const getRoomStatusText = (hasRoom: string) => ({ has: '방 있음', none: '함께 찾기' }[hasRoom] || hasRoom);

  // 핸들러 함수들 (React Native에 맞게 수정)
  const nextImage = () => {
    if (jobDetail.room.images.length > 0) {
      setCurrentImageIndex((prev) => prev === jobDetail.room.images.length - 1 ? 0 : prev + 1);
    }
  };

  const prevImage = () => {
    if (jobDetail.room.images.length > 0) {
      setCurrentImageIndex((prev) => prev === 0 ? jobDetail.room.images.length - 1 : prev - 1);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert('알림', isBookmarked ? '북마크가 해제되었습니다.' : '북마크에 추가되었습니다.');
  };
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now(), author: "현재 사용자", content: newComment,
        timeAgo: "방금 전", replies: []
      };
      setComments([...comments, comment]);
      setNewComment('');
      Alert.alert('완료', '댓글이 등록되었습니다.');
    }
  };

  const handleAddReply = (commentId: number) => {
    if (newReply.trim()) {
      setComments(comments.map(comment => {
        if (comment.id === commentId) {
          const reply: Reply = {
            id: Date.now(), author: "현재 사용자", content: newReply, timeAgo: "방금 전"
          };
          return { ...comment, replies: [...(comment.replies || []), reply] };
        }
        return comment;
      }));
      setNewReply('');
      setReplyingTo(null);
      Alert.alert('완료', '답글이 등록되었습니다.');
    }
  };

  // const handleShare = async () => {
  //   try {
  //     await Share.share({
  //       message: `${jobDetail.title} - ${jobDetail.location}`,
  //       // url: '공유할 URL' // 필요시 URL 추가
  //     });
  //   } catch (error: any) {
  //     Alert.alert(error.message);
  //   }
  // };

  // const handleReport = () => setShowReportModal(true);
  
  const submitReport = (reason: string) => {
    Alert.alert('완료', `신고가 접수되었습니다. (${reason}) 검토 후 조치하겠습니다.`);
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
    Alert.alert('완료', '지원이 완료되었습니다! 작성자에게 공개 프로필이 전송되었습니다.');
  };

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

      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {/* 방 이미지 캐러셀 */}
        {jobDetail.hasRoom === "has" && jobDetail.room.images.length > 0 && (
          <View style={{ width: screenWidth, height: screenWidth * 0.5625 }}>
            <Image
              source={{ uri: jobDetail.room.images[currentImageIndex] }}
              style={styles.carouselImage}
              resizeMode="cover"
            />
            {jobDetail.room.images.length > 1 && (
              <>
                <TouchableOpacity onPress={prevImage} style={[styles.carouselNav, styles.carouselNavLeft]}>
                  <Text style={styles.carouselNavText}>{'<'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextImage} style={[styles.carouselNav, styles.carouselNavRight]}>
                  <Text style={styles.carouselNavText}>{'>'}</Text>
                </TouchableOpacity>
                <View style={styles.carouselIndicator}>
                  <Text style={styles.carouselIndicatorText}>
                    {currentImageIndex + 1}/{jobDetail.room.images.length}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}

        <View style={styles.contentPadding}>
          {/* 기본 정보 */}
          <View>
            <View style={styles.titleContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mainTitle}>{jobDetail.title}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={16} color="#6b7280" />
                  <Text style={styles.mutedText}>
                    {jobDetail.hasRoom === "has" ? jobDetail.address : jobDetail.location}
                  </Text>
                </View>
                <View style={styles.statsContainer}>
                  <Text style={styles.mutedText}>조회 {jobDetail.viewCount}</Text>
                  <Text style={styles.mutedText}>북마크 {jobDetail.bookmarkCount}</Text>
                  <Text style={styles.mutedText}>2시간 전</Text>
                </View>
              </View>
              <TouchableOpacity onPress={toggleBookmark}>
                 <Text style={[styles.iconTextLg, isBookmarked && { color: '#F7B32B' }]}>♥</Text>
              </TouchableOpacity>
            </View>
            <Badge style={jobDetail.status !== "모집중" && styles.badgeSecondary}>
                <Text style={jobDetail.status !== "모집중" && styles.badgeSecondaryText}>{jobDetail.status}</Text>
            </Badge>
          </View>

          {/* 작성자 정보 */}
          <Card>
            <CardHeader><Text style={styles.cardTitle}>모집자 정보</Text></CardHeader>
            <CardContent>
              <View style={styles.authorInfo}>
                <Avatar>
                  <AvatarFallback>{jobDetail.author.avatar}</AvatarFallback>
                </Avatar>
                <View>
                  <Text style={styles.fontMedium}>{jobDetail.author.nickname}</Text>
                  <Text style={styles.mutedTextSm}>
                    {jobDetail.author.gender} • {jobDetail.author.age}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* 모집 조건 */}
          <Card>
            <CardHeader><Text style={styles.cardTitle}>모집 조건</Text></CardHeader>
            <CardContent>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={styles.mutedTextSm}>모집인원</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="people" size={16} color="#6b7280" />
                          <Text style={styles.fontMedium}>{jobDetail.recruitCount}명</Text>
                        </View>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.mutedTextSm}>방 여부</Text>
                        <Text style={styles.fontMedium}>{getRoomStatusText(jobDetail.hasRoom)}</Text>
                    </View>
                </View>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={styles.mutedTextSm}>보증금</Text>
                        <Text style={styles.fontMedium}>{jobDetail.depositMin === jobDetail.depositMax ? `${jobDetail.depositMin}만원` : `${jobDetail.depositMin}~${jobDetail.depositMax}만원`}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.mutedTextSm}>월세</Text>
                        <Text style={styles.fontMedium}>{jobDetail.monthlyRentMin === jobDetail.monthlyRentMax ? `${jobDetail.monthlyRentMin}만원` : `${jobDetail.monthlyRentMin}~${jobDetail.monthlyRentMax}만원`}</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <Text style={styles.subCardTitle}>선호 조건</Text>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}><Text style={styles.mutedTextSm}>선호 성별</Text><Text style={styles.fontMedium}>{getGenderText(jobDetail.preferredGender)}</Text></View>
                    <View style={styles.gridItem}><Text style={styles.mutedTextSm}>선호 나이대</Text><Text style={styles.fontMedium}>{jobDetail.ageMin === jobDetail.ageMax ? `${jobDetail.ageMin}세` : `${jobDetail.ageMin}~${jobDetail.ageMax}세`}</Text></View>
                </View>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}><Text style={styles.mutedTextSm}>생활 패턴</Text><Text style={styles.fontMedium}>{getLifestyleText(jobDetail.lifestyle)}</Text></View>
                    <View style={styles.gridItem}><Text style={styles.mutedTextSm}>성격 유형</Text><Text style={styles.fontMedium}>{getPersonalityText(jobDetail.personality)}</Text></View>
                </View>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}><Text style={styles.mutedTextSm}>흡연 여부</Text><Text style={styles.fontMedium}>{getSmokingText(jobDetail.smokingPreference)}</Text></View>
                    <View style={styles.gridItem}><Text style={styles.mutedTextSm}>코골이</Text><Text style={styles.fontMedium}>{getSnoringText(jobDetail.snoringPreference)}</Text></View>
                </View>
                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}><Text style={styles.mutedTextSm}>반려동물</Text><Text style={styles.fontMedium}>{getPetText(jobDetail.petPreference)}</Text></View>
                    <View style={styles.gridItem}></View>
                </View>
            </CardContent>
          </Card>
          
          {/* 상세 설명 & 추가 정보 */}
          {jobDetail.description && (
            <Card>
              <CardHeader><Text style={styles.cardTitle}>상세 설명</Text></CardHeader>
              <CardContent><Text style={styles.descriptionText}>{jobDetail.description}</Text></CardContent>
            </Card>
          )}

          {jobDetail.additionalInfo && (
            <Card>
              <CardHeader><Text style={styles.cardTitle}>{jobDetail.hasRoom === "none" ? "희망 조건" : "추가 정보"}</Text></CardHeader>
              <CardContent><Text style={styles.descriptionText}>{jobDetail.additionalInfo}</Text></CardContent>
            </Card>
          )}

          {/* 댓글 */}
          <Card>
            <CardHeader><Text style={styles.cardTitle}>댓글 {comments.length}</Text></CardHeader>
            <CardContent>
              {comments.map((comment) => (
                <View key={comment.id} style={{ marginBottom: 16 }}>
                  <View style={styles.commentContainer}>
                    <Avatar style={styles.commentAvatar}>
                      <AvatarFallback style={styles.commentAvatarText}>
                        {comment.author.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <View style={{ flex: 1 }}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>{comment.author}</Text>
                        <Text style={styles.mutedTextSm}>{comment.timeAgo}</Text>
                      </View>
                      <Text style={[styles.mutedText, { marginBottom: 8 }]}>{comment.content}</Text>
                      <TouchableOpacity onPress={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                         <Text style={styles.replyButtonText}>↩︎ 답글</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity><Text style={styles.mutedText}>...</Text></TouchableOpacity>
                  </View>

                  {comment.replies?.map((reply) => (
                    <View key={reply.id} style={[styles.commentContainer, { marginLeft: 32, marginTop: 12 }]}>
                      <Avatar style={styles.replyAvatar}>
                        <AvatarFallback style={styles.replyAvatarText}>{reply.author.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <View style={{ flex: 1 }}>
                         <View style={styles.commentHeader}>
                           <Text style={styles.commentAuthor}>{reply.author}</Text>
                           <Text style={styles.mutedTextSm}>{reply.timeAgo}</Text>
                         </View>
                         <Text style={styles.mutedText}>{reply.content}</Text>
                      </View>
                       <TouchableOpacity><Text style={styles.mutedText}>...</Text></TouchableOpacity>
                    </View>
                  ))}

                  {replyingTo === comment.id && (
                    <View style={{ marginLeft: 32, marginTop: 10 }}>
                       <View style={styles.inputContainer}>
                          <TextInput
                            placeholder="답글을 입력하세요..."
                            value={newReply}
                            onChangeText={setNewReply}
                            style={styles.textInput}
                            onSubmitEditing={() => handleAddReply(comment.id)}
                          />
                          <Button onPress={() => handleAddReply(comment.id)} disabled={!newReply.trim()} style={styles.inputButton}>
                             <Text style={styles.inputButtonText}>등록</Text>
                          </Button>
                       </View>
                    </View>
                  )}
                </View>
              ))}
              <View style={[styles.divider, { marginVertical: 16 }]} />
              <View style={styles.inputContainer}>
                <TextInput
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChangeText={setNewComment}
                    style={styles.textInput}
                    onSubmitEditing={handleAddComment}
                />
                <Button onPress={handleAddComment} disabled={!newComment.trim()} style={styles.inputButton}>
                   <Text style={styles.inputButtonText}>등록</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>

      {/* 하단 액션 버튼 */}
      <View style={styles.bottomBar}>
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
      </View>

      {/* 삭제 확인 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteDialog}
        onRequestClose={() => setShowDeleteDialog(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowDeleteDialog(false)}>
          <Pressable style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>구인글 삭제</Text>
            <Text style={styles.dialogDescription}>
              정말로 이 구인글을 삭제하시겠습니까? 삭제된 구인글은 복구할 수 없습니다.
            </Text>
            <View style={styles.dialogFooter}>
              <Button onPress={() => setShowDeleteDialog(false)} style={[styles.dialogButton, styles.dialogCancelButton]}>
                  <Text style={styles.dialogCancelButtonText}>취소</Text>
              </Button>
              <Button onPress={handleDelete} style={[styles.dialogButton, styles.dialogDeleteButton]}>
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
        <Pressable style={styles.modalBackdrop} onPress={() => { setShowApplyModal(false); setShowInviteModal(false); setShowReportModal(false); }}>
            <Pressable style={styles.modalContent}>
                {showApplyModal && (
                    <>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>지원하기</Text>
                            <TouchableOpacity onPress={() => setShowApplyModal(false)}><Text>X</Text></TouchableOpacity>
                        </View>
                        <Text style={styles.modalDescription}>공개 프로필이 모집자에게 전송됩니다.</Text>
                        <View style={styles.profilePreview}>
                            <View style={styles.authorInfo}>
                                <Avatar><AvatarFallback>나</AvatarFallback></Avatar>
                                <View>
                                    <Text style={styles.fontMedium}>김현수</Text>
                                    <Text style={styles.mutedTextSm}>남성 • 20대 중반</Text>
                                </View>
                            </View>
                            <Text style={styles.mutedText}>안녕하세요! 깔끔하고 조용한 성격으로 룸메이트와 잘 지낼 수 있습니다.</Text>
                        </View>
                        <Text style={[styles.mutedText, { fontSize: 12, marginBottom: 24 }]}>* 지원 후 작성자가 수락하면 채팅으로 연결됩니다.</Text>
                        <View style={styles.modalButtonContainer}>
                            <Button onPress={() => setShowApplyModal(false)} style={[styles.modalButton, styles.modalCancelButton]}><Text style={{color: '#333'}}>취소</Text></Button>
                            <Button onPress={handleApply} style={[styles.modalButton, {backgroundColor: '#F7B32B'}]}><Text style={{color: '#fff'}}>지원하기</Text></Button>
                        </View>
                    </>
                )}
                 {showInviteModal && (
                    <>
                        {/* 룸메이트 초대 모달 UI */}
                    </>
                 )}
                 {showReportModal && (
                     <>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>신고하기</Text>
                            <TouchableOpacity onPress={() => setShowReportModal(false)}><Text>X</Text></TouchableOpacity>
                        </View>
                        <Text style={styles.modalDescription}>신고 사유를 선택해 주세요.</Text>
                        <TouchableOpacity onPress={() => submitReport('스팸/광고')} style={styles.reportReasonButton}><Text>스팸/광고</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => submitReport('허위 정보')} style={styles.reportReasonButton}><Text>허위 정보</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => submitReport('부적절한 내용')} style={styles.reportReasonButton}><Text>부적절한 내용</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => submitReport('기타')} style={styles.reportReasonButton}><Text>기타</Text></TouchableOpacity>
                        <Button onPress={() => setShowReportModal(false)} style={[styles.modalButton, styles.modalCancelButton, {width: '100%', marginTop: 24}]}><Text style={{color: '#333'}}>취소</Text></Button>
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
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff'
  },
  headerButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerButtonText: { fontSize: 24 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  scrollContentContainer: { paddingBottom: 120 },
  carouselImage: { width: '100%', height: '100%' },
  carouselNav: {
    position: 'absolute', top: '50%', marginTop: -16, width: 32, height: 32,
    backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  carouselNavLeft: { left: 16 },
  carouselNavRight: { right: 16 },
  carouselNavText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  carouselIndicator: {
    position: 'absolute', bottom: 16, right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 4,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  carouselIndicatorText: { color: 'white', fontSize: 12 },
  contentPadding: { padding: 24, gap: 24 },
  titleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  mainTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  statsContainer: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  mutedText: { fontSize: 14, color: '#6b7280' },
  mutedTextSm: { fontSize: 12, color: '#6b7280' },
  iconText: { fontSize: 16 },
  iconTextLg: { fontSize: 24, color: '#9ca3af' },
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, overflow: 'hidden' },
  cardHeader: { paddingBottom: 12, paddingTop: 16, paddingHorizontal: 16 },
  cardContent: { padding: 16, paddingTop: 0 },
  cardTitle: { fontWeight: '500', fontSize: 16 },
  authorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  fontMedium: { fontWeight: '500', fontSize: 14 },
  gridContainer: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  gridItem: { flex: 1, gap: 2 },
  divider: { borderTopWidth: 1, borderColor: '#e5e7eb', paddingTop: 16, marginTop: 4 },
  subCardTitle: { fontWeight: '500', marginBottom: 12, fontSize: 14 },
  descriptionText: { fontSize: 14, lineHeight: 22 },
  commentContainer: { flexDirection: 'row', gap: 12 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16 },
  commentAvatarText: { fontSize: 12 },
  replyAvatar: { width: 28, height: 28, borderRadius: 14 },
  replyAvatarText: { fontSize: 10 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  commentAuthor: { fontSize: 14, fontWeight: '500' },
  replyButtonText: { fontSize: 12, color: '#F7B32B' },
  inputContainer: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  textInput: {
    flex: 1, height: 40, borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 8, paddingHorizontal: 12, fontSize: 14,
  },
  inputButton: { height: 40, paddingHorizontal: 16 },
  inputButtonText: { color: 'white', fontWeight: '600' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'white', borderTopWidth: 1, borderColor: '#e5e7eb',
    padding: 24, paddingTop: 16,
  },
  bottomBarInner: { flexDirection: 'row', gap: 16 },
  bottomButton: { flex: 1, height: 56, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  bottomButtonFull: { width: '100%', height: 56, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  bottomButtonText: { fontSize: 18, fontWeight: '600', color: 'white' },
  editButton: { borderWidth: 2, borderColor: '#e5e7eb', backgroundColor: '#f9fafb' },
  editButtonText: { color: '#1f2937' },
  deleteButton: { backgroundColor: '#ef4444' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  dialogContainer: {
    backgroundColor: 'white', margin: 24, borderRadius: 12, padding: 24,
    alignItems: 'center', position: 'absolute', top: '30%', left: 0, right: 0,
  },
  dialogTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  dialogDescription: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 24 },
  dialogFooter: { flexDirection: 'row', gap: 12, width: '100%' },
  dialogButton: { flex: 1, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  dialogCancelButton: { backgroundColor: '#e5e7eb' },
  dialogCancelButtonText: { color: '#374151', fontWeight: '500' },
  dialogDeleteButton: { backgroundColor: '#ef4444' },
  dialogButtonText: { color: 'white', fontWeight: '600' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  modalDescription: { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  profilePreview: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 16, gap: 12 },
  modalButtonContainer: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  modalCancelButton: { borderWidth: 1, borderColor: '#e5e7eb' },
  reportReasonButton: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, marginBottom: 12, alignItems: 'center'},
  
  // UI 컴포넌트 스타일
  badge: { backgroundColor: '#F7B32B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 16 },
  badgeSecondary: { backgroundColor: '#e5e7eb' },
  badgeText: { color: 'white', fontWeight: '500', fontSize: 12 },
  badgeSecondaryText: { color: '#374151' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  avatarFallback: { fontWeight: '500' },
  button: { backgroundColor: '#F7B32B', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '600' },
  buttonDisabled: { backgroundColor: '#d1d5db' },
});
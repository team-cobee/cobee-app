import React, { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { clearTokens } from '@/api/tokenStorage';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Gender, SocialType } from '@/types/enums';
import { getAccessToken } from '@/api/tokenStorage';

interface ProfileScreenProps {
  onLogout?: () => void;
  onWithdraw?: () => void;
  onBack?: () => void;
  onNavigateToEdit?: () => void;
  onNavigateToPublicEdit?: () => void;
  onNavigateToMyPosts?: () => void;
  onNavigateToMatching?: () => void;
  onNavigateToBookmarks?: () => void;
  onNavigateToPublicProfile?: () => void;
  onNavigateToLogin? : () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  spacer: {
    width: 24,
    height: 24,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  userDetails: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  verificationBadge: {
    backgroundColor: '#10b981',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F7B32B',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
  },
  withdrawButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  withdrawText: {
    fontSize: 14,
    color: '#9ca3af',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default function ProfileScreen({ 
  onLogout, 
  onWithdraw, 
  onBack, 
  onNavigateToBookmarks, 
  onNavigateToMatching, 
  onNavigateToMyPosts, 
  onNavigateToPublicProfile,
  
}: ProfileScreenProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [userInfo, setUserInfo] = useState<user | any>();
  const [activity, setActivity] = useState<stats | null>(null);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    logoutMember();
    onLogout?.();
  };

  const confirmWithdraw = () => {
    setShowWithdrawDialog(false);
    withDrawMember();
    onLogout?.();
  };

  //회원 탈퇴 함수
  const withDrawMember = async () => {
    try {
      const res = await api.delete('/auth/withdraw', {
        headers: {
          Authorization: `Bearer ${getAccessToken}`, 
          'Content-Type': 'application/json',
        },
      });

      clearTokens();
      console.log('회원 탈퇴 성공:', res.data);
      
      // 성공 후 처리 (예: 로그아웃, 메인 화면 이동 등)
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      // 에러 처리
    }
  };

  const logoutMember = async () => {
    try {
      const res = api.post('/auth/logout', {
        headers: {
          Authorization: `Bearer ${getAccessToken}`, 
          'Content-Type': 'application/json',
        },
      });
      console.log('회원 로그아웃 완료');
      clearTokens();
    } catch {
      console.log("회원 로그이웃 실패");
    }
  }


//   const withDrawMember = async () => {
//   try {
//     //const headers = await authHeader();
//     const res = await api.delete('/auth/withdraw', { 
//         headers: {
//           Authorization: `Bearer ${getAccessToken}`, 
//           'Content-Type': 'application/json'}}
//         );
//     clearTokens();
//     console.log('회원 탈퇴 성공:', res.data);
//     // TODO: onNavigateToLogin?.(); 등 후처리
//   } catch (error) {
//     console.error('회원 탈퇴 실패:', error);
//     Alert.alert('탈퇴 실패', '연관 데이터 정리 후 다시 시도해 주세요.'); // 서버가 409 주면 그 메시지 표시 추천
//   }
// };

// const logoutMember = async () => {
//   try {
//     //const headers = await authHeader();
//     await api.post('/auth/logout', {}, { 
//         headers: {
//           Authorization: `Bearer ${getAccessToken}`, 
//           'Content-Type': 'application/json'}}
//         );
//     clearTokens();
//     console.log('회원 로그아웃 완료');
//   } catch {
//     console.log('회원 로그아웃 실패');
//   }
// };


  interface user { // api 명세에 맞게 수정
    id : number;
    name : string;
    email : string;
    birthDate : string | null;
    gender : Gender;
    socialType : SocialType;
    isCompleted : Boolean;
    ocrValidation : Boolean;
    isHost : Boolean;
  };

  interface stats {
    myPosts: number;
    bookmarks: number;
    matches: number;
  };

  function getAge(birthdate: string): number {
    const birthYear = parseInt(birthdate.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear + 1;
  }

  const ageText = userInfo?.birthDate ? `${getAge(userInfo.birthDate)}세` : '';

  useEffect(() => {
  let cancelled = false;

  const fetchMyInfo = async () => {
    try {
      const res = await api.get('/auth'); 
      if (!cancelled) setUserInfo(res.data?.data);
      console.log(res);
    } catch (error) {
      console.error(error);
      Alert.alert('에러', '사용자 정보를 불러오지 못했습니다.');
    }
  };
  fetchMyInfo();          

  return () => {        
    cancelled = true;
  };
  }, []);                    // ← dep array는 useEffect 호출 안쪽의 두 번째 인자

  // 통계 호출 api 
  // useEffect( () => {
  //   const fetchMyActivity = async () => {
  //         try {
  //           const res = await api.get('/public-profiles/activity');  // 백엔드 넘겨줄때 memberId가 아니라 헤더로 넘겨주기로 수정
  //           setActivity(res.data.data);
  //         } catch (error) {
  //           console.error(error);
  //           Alert.alert('에러', '사용자 활동 정보를 불러오지 못했습니다.');
  //         }
  //       }
  //   }
  // ), []; 
  
  


  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>마이페이지</Text>
          <View style={styles.spacer} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 프로필 정보 */}
        <Card>
          <CardContent style={{ padding: 24 }}>
            <View style={styles.profileSection}>
              <Avatar style={{ width: 64, height: 64 }}>
                <AvatarFallback>{userInfo?.name}</AvatarFallback>
              </Avatar>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{userInfo?.name}</Text>
                <Text style={styles.userEmail}>{userInfo?.email}</Text>
                <Text style={styles.userDetails}>{ageText} • {userInfo?.gender}</Text>
                <Badge variant="default" style={styles.verificationBadge}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                    <Text style={{ color: '#10b981', fontSize: 12 }}>{userInfo?.verificationStatus}</Text>
                  </View>
                </Badge>
              </View>
            </View>

            {/* 통계 - 나중에 추가*/}
            {/* <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{activity?.myPosts}</Text>
                <Text style={styles.statLabel}>내 구인글</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{activity?.bookmarks}</Text>
                <Text style={styles.statLabel}>북마크</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{activity?.matches}</Text>
                <Text style={styles.statLabel}>매칭</Text>
              </View>
            </View> */}
          </CardContent>
        </Card>

        {/* 메뉴 */}
        <Card>
          <CardContent style={{ padding: 0 }}>
            <TouchableOpacity 
            style={styles.menuItem} onPress={onNavigateToPublicProfile}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="eye" size={20} color="#6b7280" />
                <Text style={styles.menuText}>공개 프로필 보기</Text>
                
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onNavigateToMyPosts}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="document-text" size={20} color="#6b7280" />
                <Text style={styles.menuText}>내 구인글</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onNavigateToBookmarks}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="bookmark" size={20} color="#6b7280" />
                <Text style={styles.menuText}>북마크</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={onNavigateToMatching}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="people" size={20} color="#6b7280" />
                <Text style={styles.menuText}>매칭 현황</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* 계정 관리 */}
        <Card>
          <CardContent style={{ padding: 0 }}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutClick}>
              <Ionicons name="log-out" size={20} color="#6b7280" />
              <Text style={styles.logoutText}>로그아웃</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* 회원 탈퇴 */}
        <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawClick}>
          <Text style={styles.withdrawText}>회원 탈퇴</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 로그아웃 확인 모달 */}
      <Modal
        visible={showLogoutDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>로그아웃</Text>
            <Text style={styles.modalText}>
              정말로 로그아웃하시겠습니까?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                variant="outline"
                style={styles.modalButton}
                onPress={() => setShowLogoutDialog(false)}
              >
                취소
              </Button>
              <Button
                style={styles.modalButton}
                onPress={confirmLogout}
              >
                로그아웃
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* 회원 탈퇴 확인 모달 */}
      <Modal
        visible={showWithdrawDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWithdrawDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>회원 탈퇴</Text>
            <Text style={styles.modalText}>
              정말로 회원 탈퇴하시겠습니까?{'\n'}
              이 작업은 되돌릴 수 없습니다.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                variant="outline"
                style={styles.modalButton}
                onPress={() => setShowWithdrawDialog(false)}
              >
                취소
              </Button>
              <Button
                variant="destructive"
                style={styles.modalButton}
                onPress={confirmWithdraw}
              >
                탈퇴
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
import React, { useState } from 'react';
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
  onNavigateToPublicProfile 
}: ProfileScreenProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawDialog(true);
  };

  const confirmLogout = () => {
    setShowLogoutDialog(false);
    onLogout();
  };

  const confirmWithdraw = () => {
    setShowWithdrawDialog(false);
    onWithdraw();
  };

  const user = {
    name: '김철수',
    email: 'chulsoo@example.com',
    avatar: '/avatar.jpg',
    age: 25,
    gender: '남성',
    location: '서울 강남구',
    verificationStatus: '인증완료',
    joinDate: '2024.01.15'
  };

  const stats = {
    myPosts: 3,
    bookmarks: 12,
    matches: 5
  };

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
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userDetails}>{user.age}세 • {user.gender} • {user.location}</Text>
                <Text style={styles.userDetails}>가입일: {user.joinDate}</Text>
                <Badge variant="default" style={styles.verificationBadge}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                    <Text style={{ color: '#10b981', fontSize: 12 }}>{user.verificationStatus}</Text>
                  </View>
                </Badge>
              </View>
            </View>

            {/* 통계 */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.myPosts}</Text>
                <Text style={styles.statLabel}>내 구인글</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.bookmarks}</Text>
                <Text style={styles.statLabel}>북마크</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.matches}</Text>
                <Text style={styles.statLabel}>매칭</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 메뉴 */}
        <Card>
          <CardContent style={{ padding: 0 }}>
            <TouchableOpacity style={styles.menuItem} onPress={onNavigateToPublicProfile}>
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
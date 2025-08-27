// 수정 X
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/button';

interface ChatRoomSettingsScreenProps {
  onBack?: () => void;
  onLeaveChatRoom?: () => void;
  roomId?: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  status: 'ready' | 'waiting' | 'matched';
  isOwner: boolean;
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
  backIcon: {
    fontSize: 24,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  roomNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roomNameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  roomNameText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 12,
    color: '#d97706',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  memberStatus: {
    fontSize: 12,
    color: '#6b7280',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ownerBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ownerText: {
    fontSize: 10,
    color: '#d97706',
  },
  readyIcon: {
    fontSize: 16,
    color: '#10b981',
  },
  waitingIcon: {
    fontSize: 16,
    color: '#f59e0b',
  },
  removeButton: {
    padding: 4,
  },
  removeIcon: {
    fontSize: 16,
    color: '#ef4444',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  inviteIcon: {
    fontSize: 16,
    color: '#6b7280',
  },
  inviteText: {
    fontSize: 14,
    color: '#6b7280',
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  leaveIcon: {
    fontSize: 16,
    color: '#ef4444',
  },
  leaveText: {
    fontSize: 14,
    color: '#ef4444',
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
  },
  modalText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

export default function ChatRoomSettingsScreen({ onBack, onLeaveChatRoom }: ChatRoomSettingsScreenProps) {
  const [roomName, setRoomName] = useState('강남역 근처 깔끔한 원룸 룸메이트');
  const [isEditingName, setIsEditingName] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showLeaveRoomModal, setShowLeaveRoomModal] = useState(false);

  // 채팅방 정보 (목 데이터)
  const chatRoom = {
    id: 'room_1',
    status: 'waiting', // waiting, ready, matched
    isOwner: true, // 현재 사용자가 방장인지
    members: [
      { id: 'user1', name: '김민수', avatar: 'KM', status: 'ready', isOwner: true },
      { id: 'user2', name: '박지은', avatar: 'PJ', status: 'waiting', isOwner: false },
      { id: 'user3', name: '이준혁', avatar: 'LJ', status: 'waiting', isOwner: false },
    ] as Member[]
  };

  const handleSaveRoomName = () => {
    setIsEditingName(false);
    Alert.alert('알림', '채팅방 이름이 변경되었습니다');
  };

  const handleRemoveMember = () => {
    if (selectedMember) {
      Alert.alert('알림', `${selectedMember.name}님을 채팅방에서 내보냈습니다`);
      setShowRemoveMemberModal(false);
      setSelectedMember(null);
    }
  };

  const handleInviteMember = () => {
    Alert.alert('알림', '초대 링크를 복사했습니다');
  };

  const handleLeaveRoom = () => {
    Alert.alert('알림', '채팅방을 나갔습니다');
    setShowLeaveRoomModal(false);
    onLeaveChatRoom?.();
    onBack?.();
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>채팅방 설정</Text>
          <View style={styles.spacer} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 채팅방 정보 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>채팅방 정보</Text>
            <View style={styles.roomNameContainer}>
              {isEditingName ? (
                <>
                  <TextInput
                    style={styles.roomNameInput}
                    value={roomName}
                    onChangeText={setRoomName}
                    autoFocus
                  />
                  <Button onPress={handleSaveRoomName} size="sm">
                    저장
                  </Button>
                </>
              ) : (
                <>
                  <Text style={styles.roomNameText}>{roomName}</Text>
                  <Button onPress={() => setIsEditingName(true)} variant="outline" size="sm">
                    <Ionicons name="pencil" size={16} color="#6b7280" />
                  </Button>
                </>
              )}
            </View>
          </View>
          
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {chatRoom.status === 'waiting' ? '매칭 대기중' : 
               chatRoom.status === 'ready' ? '매칭 준비완료' : '매칭 완료'}
            </Text>
          </View>
        </View>

        {/* 멤버 관리 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.roomNameContainer}>
              <Text style={styles.cardTitle}>멤버 ({chatRoom.members.length}명)</Text>
              <Button onPress={handleInviteMember} variant="outline" size="sm">
                <Text>👥 초대</Text>
              </Button>
            </View>
          </View>
          
          {chatRoom.members.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{member.avatar}</Text>
              </View>
              
              <View style={styles.memberInfo}>
                <View style={styles.roomNameContainer}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  {member.status === 'ready' ? (
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  ) : member.status === 'waiting' ? (
                    <Text style={styles.waitingIcon}>🕐</Text>
                  ) : (
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  )}
                  
                  {member.isOwner && (
                    <View style={styles.ownerBadge}>
                      <Text style={styles.ownerText}>👑 방장</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.memberStatus}>
                  {member.status === 'ready' ? '준비완료' : 
                   member.status === 'waiting' ? '대기중' : '매칭완료'}
                </Text>
              </View>
              
              {chatRoom.isOwner && !member.isOwner && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    setSelectedMember(member);
                    setShowRemoveMemberModal(true);
                  }}
                >
                  <Ionicons name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* 채팅방 나가기 */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={() => setShowLeaveRoomModal(true)}
          >
            <Ionicons name="exit" size={20} color="#dc2626" />
            <Text style={styles.leaveText}>채팅방 나가기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 멤버 제거 확인 모달 */}
      <Modal
        visible={showRemoveMemberModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRemoveMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>멤버 내보내기</Text>
            <Text style={styles.modalText}>
              {selectedMember?.name}님을 채팅방에서 내보내시겠습니까?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                variant="outline"
                style={styles.modalButton}
                onPress={() => setShowRemoveMemberModal(false)}
              >
                취소
              </Button>
              <Button
                style={styles.modalButton}
                onPress={handleRemoveMember}
              >
                내보내기
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* 채팅방 나가기 확인 모달 */}
      <Modal
        visible={showLeaveRoomModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLeaveRoomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>채팅방 나가기</Text>
            <Text style={styles.modalText}>
              정말로 채팅방을 나가시겠습니까?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                variant="outline"
                style={styles.modalButton}
                onPress={() => setShowLeaveRoomModal(false)}
              >
                취소
              </Button>
              <Button
                style={styles.modalButton}
                onPress={handleLeaveRoom}
              >
                나가기
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
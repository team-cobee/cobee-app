import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface ChatScreenProps {
  onBack: () => void;
  onNavigateToSettings: () => void;
  onNavigateToCreateRoom: () => void;
  chatRoomState: {
    hasRoom: boolean;
    isOwner: boolean;
    roomId: string | null;
  };
  onLeaveChatRoom: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'system' | 'matching';
  author?: string;
  content: string;
  timestamp: string;
  isOwn?: boolean;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  isOwner: boolean;
}

export default function ChatScreen({ onBack, onNavigateToSettings, onNavigateToCreateRoom, chatRoomState, onLeaveChatRoom }: ChatScreenProps) {
  const [message, setMessage] = useState('');
  const [debugIsOwner, setDebugIsOwner] = useState(chatRoomState.isOwner);
  
  // 채팅방 상태 관리
  const [chatRoomStatus, setChatRoomStatus] = useState<'waiting' | 'ready' | 'matched'>('waiting');
  const [members, setMembers] = useState<Member[]>([
    { id: 'user1', name: '김민수', avatar: 'KM', isOwner: true },
    { id: 'user2', name: '박지은', avatar: 'PJ', isOwner: false },
    { id: 'user3', name: '이준혁', avatar: 'LJ', isOwner: false },
  ]);

  // 메시지 목록 상태 관리
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: '채팅방이 생성되었습니다. 룸메이트들과 대화를 시작해보세요!',
      timestamp: '오늘 오후 2:00'
    },
    {
      id: '2',
      type: 'user',
      author: '박지은',
      content: '안녕하세요! 반갑습니다 😊',
      timestamp: '오후 2:05',
      isOwn: false
    },
    {
      id: '3',
      type: 'user',
      author: '김민수',
      content: '안녕하세요! 함께 살게 될 수도 있는 분들이네요',
      timestamp: '오후 2:07',
      isOwn: true
    }
  ]);

  // 채팅방 데이터 (목 데이터)
  const chatRoom = chatRoomState.hasRoom ? {
    id: chatRoomState.roomId || 'room_1',
    name: '강남역 근처 깔끔한 원룸 룸메이트',
    jobPostingId: '1',
    status: chatRoomStatus,
    isOwner: debugIsOwner,
    members: members.map(member => ({
      ...member,
      isOwner: member.id === 'user1' ? debugIsOwner : false
    }))
  } : null;

  // 현재 시간 포맷팅
  const getCurrentTime = () => {
    const now = new Date();
    return `오후 ${now.getHours() > 12 ? now.getHours() - 12 : now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // 메시지 전송 기능
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const currentUser = debugIsOwner ? '김민수' : '박지은'; // 현재 사용자 이름
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      author: currentUser,
      content: message.trim(),
      timestamp: getCurrentTime(),
      isOwn: true
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  // 매칭 준비 보내기 기능
  const handleSendMatchingRequest = () => {
    if (!debugIsOwner) {
      Alert.alert('알림', '방장만 매칭 준비를 요청할 수 있습니다');
      return;
    }

    // 매칭 요청 시스템 메시지 추가
    const matchingMessage: Message = {
      id: Date.now().toString(),
      type: 'matching',
      content: '김민수님이 매칭 준비를 요청했습니다. 준비가 되셨다면 알림에서 준비 버튼을 눌러주세요!',
      timestamp: getCurrentTime()
    };

    setMessages(prev => [...prev, matchingMessage]);

    // 채팅방 상태를 준비중으로 변경
    setChatRoomStatus('ready');

    Alert.alert('알림', '매칭 준비 요청을 보냈습니다!');
    
    // 5초 후 시뮬레이션: 다른 멤버들도 준비 완료
    setTimeout(() => {
      // 2초 후 매칭 완료 메시지
      setTimeout(() => {
        const completedMessage: Message = {
          id: Date.now().toString(),
          type: 'matching',
          content: '🎉 모든 멤버가 준비를 완료했습니다! 매칭이 성사되었어요!',
          timestamp: getCurrentTime()
        };
        
        setMessages(prev => [...prev, completedMessage]);
        setChatRoomStatus('matched');
        Alert.alert('알림', '🎉 매칭이 완료되었습니다!');
      }, 2000);
    }, 5000);
  };

  // 권한 토글 기능 (디버그용)
  const toggleOwnerStatus = () => {
    setDebugIsOwner(!debugIsOwner);
    Alert.alert('알림', debugIsOwner ? '멤버 모드로 변경됩니다' : '방장 모드로 변경됩니다');
  };

  // Submit 키로 메시지 전송 (React Native)
  const handleSubmitEditing = () => {
    handleSendMessage();
  };

  // 채팅방이 없는 경우
  if (!chatRoomState.hasRoom) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        {/* 헤더 */}
        <View style={{
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingTop: 50,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={{ fontWeight: '600' }}>채팅</Text>
            <View style={{ width: 24, height: 24 }} />
          </View>
        </View>

        {/* 채팅방 없음 화면 */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ alignItems: 'center', maxWidth: 300 }}>
            <View style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: 'rgba(247, 179, 43, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Ionicons name="chatbubbles" size={48} color="#F7B32B" />
            </View>
            
            <View style={{ marginBottom: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>아직 채팅방이 없어요</Text>
              <Text style={{ 
                fontSize: 14, 
                color: '#6b7280', 
                textAlign: 'center', 
                lineHeight: 20 
              }}>
                구인글을 작성하셨나요?{'\n'}채팅방을 만들어서 룸메이트들과{'\n'}대화를 시작해보세요!
              </Text>
            </View>

            <View style={{ width: '100%', gap: 12 }}>
              <Button 
                onPress={onNavigateToCreateRoom}
                style={{ 
                  width: '100%',
                  backgroundColor: '#F7B32B',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="add" size={16} color="white" />
                  <Text style={{ color: 'white' }}>채팅방 만들기</Text>
                </View>
              </Button>
              
              <Card style={{ padding: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#d1d5db' }}>
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#6b7280' }}>
                    💡 채팅방 초대를 받으셨나요?
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>
                    알림에서 초대를 확인하고 수락해보세요!
                  </Text>
                  <Button 
                    variant="outline" 
                    onPress={() => Alert.alert('알림', '알림을 확인해주세요!')}
                    style={{ paddingHorizontal: 16, paddingVertical: 8 }}
                  >
                    알림 확인하기
                  </Button>
                </View>
              </Card>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 채팅방이 있는 경우
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* 헤더 */}
      <View style={{
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 50,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={onBack}>
            <Text style={{ fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 14 }}>{chatRoom?.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              <Badge 
                variant={chatRoom?.status === 'matched' ? 'default' : 'secondary'}
                style={
                  chatRoom?.status === 'matched' 
                    ? { backgroundColor: '#F7B32B' }
                    : chatRoom?.status === 'ready'
                    ? { backgroundColor: '#22c55e' }
                    : {}
                }
              >
                {chatRoom?.status === 'matched' ? '매칭 완료' : 
                 chatRoom?.status === 'ready' ? '매칭 준비중' : '대기중'}
              </Badge>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                👥 {chatRoom?.members.length}명
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onNavigateToSettings}>
            <Ionicons name="settings" size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 디버그 토글 (개발용) */}
      <View style={{ 
        backgroundColor: '#fef3c7', 
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        borderBottomWidth: 1, 
        borderBottomColor: '#fbbf24' 
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12, color: '#92400e' }}>
            현재 모드: {debugIsOwner ? '방장' : '멤버'} | 상태: {chatRoom?.status}
          </Text>
          <TouchableOpacity
            onPress={toggleOwnerStatus}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <Text style={{ fontSize: 12, color: '#92400e' }}>
              {debugIsOwner ? '👑 방장 모드' : '👥 멤버 모드'}
            </Text>
            <Text style={{ fontSize: 16, color: '#92400e' }}>
              {debugIsOwner ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 채팅 메시지 영역 */}
      <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ gap: 16, paddingBottom: 120 }}>
        {messages.map((msg) => (
          <View key={msg.id}>
            {msg.type === 'system' && (
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  backgroundColor: '#f3f4f6',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 16,
                }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>
                    {msg.content}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
              </View>
            )}
            
            {msg.type === 'matching' && (
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  backgroundColor: '#F7B32B',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  maxWidth: '80%',
                }}>
                  <Text style={{ fontSize: 12, color: 'white' }}>
                    📢 {msg.content}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
              </View>
            )}
            
            {msg.type === 'user' && (
              <View style={{ 
                flexDirection: msg.isOwn ? 'row-reverse' : 'row', 
                gap: 12 
              }}>
                <Avatar style={{ width: 32, height: 32 }}>
                  <AvatarFallback>
                    {msg.author?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <View style={{ 
                  maxWidth: '70%', 
                  alignItems: msg.isOwn ? 'flex-end' : 'flex-start' 
                }}>
                  {!msg.isOwn && (
                    <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>{msg.author}</Text>
                  )}
                  <View style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: msg.isOwn ? '#F7B32B' : '#f3f4f6',
                  }}>
                    <Text style={{
                      fontSize: 14,
                      color: msg.isOwn ? 'white' : '#374151',
                    }}>
                      {msg.content}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 매칭 준비 버튼 (방장만) - 하단 고정 */}
      {debugIsOwner && chatRoom?.status === 'waiting' && (
        <View style={{
          position: 'absolute',
          bottom: 90,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          backgroundColor: '#ffffff',
        }}>
          <Button
            onPress={handleSendMatchingRequest}
            style={{ 
              width: '100%',
              backgroundColor: '#22c55e'
            }}
          >
            매칭 준비 보내기
          </Button>
        </View>
      )}

      {/* 매칭 완료 상태 표시 - 하단 고정 */}
      {chatRoom?.status === 'matched' && (
        <View style={{
          position: 'absolute',
          bottom: 90,
          left: 0,
          right: 0,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          backgroundColor: '#f0fdf4',
        }}>
          <Text style={{ 
            textAlign: 'center', 
            fontSize: 14, 
            color: '#15803d' 
          }}>
            🎉 매칭이 완료되었습니다! 이제 함께 살아보세요!
          </Text>
        </View>
      )}

      {/* 메시지 입력 영역 - 하단 고정 */}
      <View style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        backgroundColor: '#ffffff',
      }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            placeholder="메시지를 입력하세요..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSubmitEditing}
            style={{
              flex: 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          <Button
            onPress={handleSendMessage}
            disabled={!message.trim()}
            style={
              message.trim() 
                ? { backgroundColor: '#F7B32B' }
                : { backgroundColor: '#f3f4f6' }
            }
          >
            <Text style={{ color: message.trim() ? 'white' : '#9ca3af' }}>📤</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
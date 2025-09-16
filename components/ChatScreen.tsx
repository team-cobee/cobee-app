import React, { useState, useEffect, useRef } from 'react';
import { api, BASE_URL } from '@/api/api';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
import { set } from 'react-hook-form';
import { MessageType, RecruitStatus } from '@/types/enums';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { client } from 'stompjs';

interface ChatScreenProps {
  onBack: () => void;
  onNavigateToSettings: () => void;
  onNavigateToCreateRoom: () => void;
  chatRoomState: {
    hasRoom: boolean;
    isOwner: boolean;
    roomId: number | null;
  };
  onLeaveChatRoom: () => void;
}

export default function ChatScreen({ onBack, onNavigateToSettings, onNavigateToCreateRoom, chatRoomState, onLeaveChatRoom }: ChatScreenProps) {
  const [message, setMessage] = useState<MessageInfo[]>([]);
  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoom | null>(null);
  const [debugIsOwner, setDebugIsOwner] = useState(chatRoomState.isOwner);
  // 채팅방 상태 관리
  const [chatRoomStatus, setchatRoomStatus] = useState<RecruitStatus>(RecruitStatus.OnContact);
  const [roomId, setRoomId] = useState<number | null>(chatRoomState.roomId ?? null);
  const hasRoom = !!roomId;  
  const [input, setInput] = useState<string>(''); // 채팅 보낼때의 입력 메시지 
  const [loginUser, setLoginUser] = useState<AuthMember | null>(null);
  
  const stompRef = useRef<Client | null>(null);

  interface Member {
    id: string;
    name: string;
    isHost?: boolean;
  }

  interface RecruitInfo { // TODO : 구인글 조회 & 수정 api로 상태 수정.. 
    postId : number;
    status : RecruitStatus
  }

  interface MessageInfo{
    id : string;
    roomId : number;
    sender : number;
    senderUsername : string;
    message : string;
    timestamp : string;  // local date time으로 오는데 ... 변환해야하나??? 
    messageType : MessageType;
    imageUrl : string;
    isSystem?: boolean; // 시스템 메시지 여부
  }

  interface ChatSend{
    roomId : number;
    senderId : number;
    message : string;
    messageType : MessageType;
    imageUrl?: string;
  }

  interface ChatRoom {
  id : number;
  name : string;
  postId : number;
  maxMemberCount : number;
  currentUserCount : number;
}
interface AuthMember {
  id : number;
  name : string;
  isHost : boolean;
}

const getAllChatMessages = async (roomId: number) => {
    const res = await api.get(`/chat/rooms/history/${roomId}`);
    console.log(res);
    setMessage(res.data.data);
}

const getMyChatInfo = async () => {
    try {
      const res = await api.get('/chat/rooms/my');
      console.log('[my room]', res.data);

      if (res.data?.success && res.data?.data) {
        setChatRoomInfo(res.data.data);
        setRoomId(res.data.data.id);            // ✅ roomId 확정
        setchatRoomStatus(RecruitStatus.Recruiting);
      } else {
        setChatRoomInfo(null);
        setRoomId(null);
      }
    } catch (e) {
      console.error('getMyChatInfo error', e);
      setChatRoomInfo(null);
      setRoomId(null);
    } 
  };



  const getUserInfo = async () => {
    const res = await api.get(`/auth`);
    console.log(res);
    setLoginUser(res.data.data);
  }

  const editRecruitInfo = async (postId: number) => { // 구인글 상태 수정 
    const res = await api.patch(`/recruits/${postId}`);
    console.log(res);
    setchatRoomStatus(res.data.data.status);
  }

  const getRecruitInfo = async (postId: number) => { // 구인글 상태 조회
      const res = await api.get(`/recruits/${postId}`);
      console.log(res);
      setchatRoomStatus(res.data.data.status);
  } 

  useEffect(() => {
    // 부모가 roomId를 줬더라도 /my는 불러서 상세정보를 채우는 게 안전
    getUserInfo();
    getMyChatInfo();
  }, []);

  // ---- STOMP 연결: roomId가 결정된 뒤에만 ----
useEffect(() => {
  if (!roomId) {
    if (stompRef.current?.connected) {
      stompRef.current.deactivate();
      stompRef.current = null;
    }
    return;
  }

  const stomp = new Client({
    debug: (s) => console.log('[stomp]', s),
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    webSocketFactory: () => new SockJS(`${BASE_URL}/ws-chat`),
    onConnect: () => {
      console.log('STOMP connected');

      // ✅ 서버 convertAndSend("/topic/room/{id}") 와 일치시킴
      stomp.subscribe(`/topic/room/${roomId}`, (frame) => {
        try {
          const incoming: MessageInfo = JSON.parse(frame.body);
          setMessage((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]
          );
        } catch (e) {
          console.warn('STOMP parse error', e);
        }
      });

      // 초기 히스토리
      getAllChatMessages(roomId);
    },
    onStompError: (f) => console.warn('STOMP error:', f.headers['message']),
  });

  stomp.activate();
  stompRef.current = stomp;

  return () => {
    stomp.deactivate();
    stompRef.current = null;
  };
}, [roomId]);


  // 현재 시간 포맷팅
  const getCurrentTime = () => {
    const now = new Date();
    return `오후 ${now.getHours() > 12 ? now.getHours() - 12 : now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // 메시지 전송 기능 : api 연결코드
  const SEND_DEST = '/app/chat/sendMessage'; 

const handleSendMessage = () => {
  const text = input.trim();
  if (!text) return;

  if (!roomId || !loginUser?.id) {
    Alert.alert('알림', '채팅방 또는 사용자 정보를 불러오지 못했습니다.');
    return;
  }
  if (!stompRef.current || !stompRef.current.connected) {
    Alert.alert('알림', '서버와 연결되지 않았습니다.');
    return;
  }

  const payload: ChatSend = {
    roomId,
    senderId: loginUser.id,
    message: text,
    messageType: MessageType.Text,
  };

  // ✅ 올바른 publish 사용
  stompRef.current.publish({
    destination: SEND_DEST,
    body: JSON.stringify(payload),
    headers: { 'content-type': 'application/json' }, // 선택
  });

  setInput('');
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
  if (!hasRoom) {
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
            <Text style={{ fontWeight: '600', fontSize: 14 }}>{chatRoomInfo?.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              <Badge 
                variant={chatRoomStatus === RecruitStatus.RecruitOver ? 'default' : 'secondary'}
                style={
                  chatRoomStatus === RecruitStatus.RecruitOver
                    ? { backgroundColor: '#F7B32B' }
                    : chatRoomStatus === RecruitStatus.Recruiting
                    ? { backgroundColor: '#22c55e' }
                    : {}
                }
              >
                {chatRoomStatus === RecruitStatus.RecruitOver ? '매칭 완료' : 
                 chatRoomStatus === RecruitStatus.Recruiting ? '매칭 준비중' : '대기중'}
              </Badge>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                {/* 👥 {hasChatRoom?.members.length}명 - 채팅방 누가 있는지 api 연결 후 다시 실행*/}  
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
            현재 모드: {debugIsOwner ? '방장' : '멤버'} | 상태: {chatRoomStatus}
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
        
        {message.map((msg) => {
          const isOwn = msg.sender === loginUser?.id;

        return (
          <View key={msg.id}>
            
            {/* 시스템 문자{ === true && (
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  backgroundColor: '#f3f4f6',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 16,
                }}>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>
                    {msg.message}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
              </View>
            )} */}
            
            {/* {chatRoomStatus === RecruitStatus.Recruiting && (
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  backgroundColor: '#F7B32B',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  maxWidth: '80%',
                }}>
                  <Text style={{ fontSize: 12, color: 'white' }}>
                    📢 {msg.message}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
              </View>
            )} */}
            
            {msg.message && (
              <View style={{ 
                flexDirection: isOwn ? 'row-reverse' : 'row', 
                gap: 12 
              }}>
                {/* <Avatar style={{ width: 32, height: 32 }}>
                  <AvatarFallback>
                    {msg.author?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar> */}
                <View style={{ 
                  maxWidth: '70%', 
                  alignItems: isOwn ? 'flex-end' : 'flex-start' 
                }}>
                  {!isOwn && (
                    <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>{msg.senderUsername}</Text>
                  )}
                  <View style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: isOwn ? '#F7B32B' : '#f3f4f6',
                  }}>
                    <Text style={{
                      fontSize: 14,
                      color: isOwn? 'white' : '#374151',
                    }}>
                      {msg.message}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
                </View>
              </View>
            )}
          </View>
         );
    })}
      </ScrollView>

      {/* 매칭 완료 상태 표시 - 하단 고정 */}
      {chatRoomStatus === RecruitStatus.RecruitOver && (
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
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSendMessage}
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
            disabled={!input.trim()}
            style={
              input.trim() 
                ? { backgroundColor: '#F7B32B' }
                : { backgroundColor: '#f3f4f6' }
            }
          >
            <Text style={{ color: input.trim() ? 'white' : '#9ca3af' }}>📤</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
    
  );    
}
// import React, { useState, useEffect, useRef } from 'react';
// import { api, BASE_URL } from '@/api/api';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader } from './ui/card';
// import { Avatar, AvatarFallback } from './ui/avatar';
// import { Badge } from './ui/badge';
// import { set } from 'react-hook-form';
// import { MessageType, RecruitStatus } from '@/types/enums';
// import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
// import { client } from 'stompjs';

// interface ChatScreenProps {
//   onBack: () => void;
//   onNavigateToSettings: () => void;
//   onNavigateToCreateRoom: () => void;
//   chatRoomState: {
//     hasRoom: boolean;
//     isOwner: boolean;
//     roomId: number | null;
//   };
//   onLeaveChatRoom: () => void;
// }

// export default function ChatScreen({ onBack, onNavigateToSettings, onNavigateToCreateRoom, chatRoomState, onLeaveChatRoom }: ChatScreenProps) {
//   const [message, setMessage] = useState<MessageInfo[]>([]);
//   const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoom | null>(null);
//   const [IsOwnerChat, setIsOwnerChat] = useState(chatRoomState.isOwner);
//   // 채팅방 상태 관리
//   const [chatRoomStatus, setchatRoomStatus] = useState<RecruitStatus>(RecruitStatus.OnContact);
//   const [roomId, setRoomId] = useState<number | null>(chatRoomState.roomId ?? null);
//   const hasRoom = !!roomId;  
//   const [input, setInput] = useState<string>(''); // 채팅 보낼때의 입력 메시지 
//   const [loginUser, setLoginUser] = useState<AuthMember | null>(null);
  
//   const stompRef = useRef<Client | null>(null);

//   interface Member {
//     id: string;
//     name: string;
//     isHost?: boolean;
//   }

//   interface RecruitInfo { // TODO : 구인글 조회 & 수정 api로 상태 수정.. 
//     postId : number;
//     status : RecruitStatus
//   }

//   interface MessageInfo{
//     id : string;
//     roomId : number;
//     sender : number;
//     senderUsername : string;
//     message : string;
//     timestamp : string;  // local date time으로 오는데 ... 변환해야하나??? 
//     messageType : MessageType;
//     imageUrl : string;
//     isSystem?: boolean; // 시스템 메시지 여부
//   }

//   interface ChatSend{
//     roomId : number;
//     senderId : number;
//     message : string;
//     messageType : MessageType;
//     imageUrl?: string;
//   }

//   interface ChatRoom {
//   id : number;
//   name : string;
//   postId : number;
//   maxMemberCount : number;
//   currentUserCount : number;
// }
// interface AuthMember {
//   id : number;
//   name : string;
//   isHost : boolean;
// }

// const getAllChatMessages = async (roomId: number) => {
//     const res = await api.get(`/chat/rooms/history/${roomId}`);
//     console.log(res);
//     setMessage(res.data.data);
// }

// const getMyChatInfo = async () => {
//     try {
//       const res = await api.get('/chat/rooms/my');
//       console.log('[my room]', res.data);

//       if (res.data?.success && res.data?.data) {
//         setChatRoomInfo(res.data.data);
//         setRoomId(res.data.data.id);            // ✅ roomId 확정
//         setchatRoomStatus(RecruitStatus.Recruiting);
//       } else {
//         setChatRoomInfo(null);
//         setRoomId(null);
//       }
//     } catch (e) {
//       console.error('getMyChatInfo error', e);
//       setChatRoomInfo(null);
//       setRoomId(null);
//     } 
//   };



//   const getUserInfo = async () => {
//     const res = await api.get(`/auth`);
//     console.log(res);
//     setLoginUser(res.data.data);
//   }

//   const editRecruitInfo = async (postId: number) => { // 구인글 상태 수정 
//     const res = await api.patch(`/recruits/${postId}`);
//     console.log(res);
//     setchatRoomStatus(res.data.data.status);
//   }

//   const getRecruitInfo = async (postId: number) => { // 구인글 상태 조회
//       const res = await api.get(`/recruits/${postId}`);
//       console.log(res);
//       setchatRoomStatus(res.data.data.status);
//   } 

//   useEffect(() => {
//     // 부모가 roomId를 줬더라도 /my는 불러서 상세정보를 채우는 게 안전
//     getUserInfo();
//     getMyChatInfo();
//   }, []);

//   // ---- STOMP 연결: roomId가 결정된 뒤에만 ----
// useEffect(() => {
//   loginUser?.isHost === true ? setIsOwnerChat(true) : setIsOwnerChat(false);
//   if (!roomId) {
//     if (stompRef.current?.connected) {
//       stompRef.current.deactivate();
//       stompRef.current = null;
//     }
//     return;
//   }

//   const stomp = new Client({
//     debug: (s) => console.log('[stomp]', s),
//     reconnectDelay: 5000,
//     heartbeatIncoming: 10000,
//     heartbeatOutgoing: 10000,
//     webSocketFactory: () => new SockJS(`${BASE_URL}/ws-chat`),
//     onConnect: () => {
//       console.log('STOMP connected');

//       // ✅ 서버 convertAndSend("/topic/room/{id}") 와 일치시킴
//       stomp.subscribe(`/topic/room/${roomId}`, (frame) => {
//         try {
//           const incoming: MessageInfo = JSON.parse(frame.body);
//           setMessage((prev) =>
//             prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]
//           );
//         } catch (e) {
//           console.warn('STOMP parse error', e);
//         }
//       });

//       // 초기 히스토리
//       getAllChatMessages(roomId);
//     },
//     onStompError: (f) => console.warn('STOMP error:', f.headers['message']),
//   });

//   stomp.activate();
//   stompRef.current = stomp;

//   return () => {
//     stomp.deactivate();
//     stompRef.current = null;
//   };
// }, [roomId]);


//   // 현재 시간 포맷팅
//   const getCurrentTime = () => {
//     const now = new Date();
//     return `오후 ${now.getHours() > 12 ? now.getHours() - 12 : now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
//   };

//   // 메시지 전송 기능 : api 연결코드
//   const SEND_DEST = '/app/chat/sendMessage'; 

// const handleSendMessage = () => {
//   const text = input.trim();
//   if (!text) return;

//   if (!roomId || !loginUser?.id) {
//     Alert.alert('알림', '채팅방 또는 사용자 정보를 불러오지 못했습니다.');
//     return;
//   }
//   if (!stompRef.current || !stompRef.current.connected) {
//     Alert.alert('알림', '서버와 연결되지 않았습니다.');
//     return;
//   }

//   const payload: ChatSend = {
//     roomId,
//     senderId: loginUser.id,
//     message: text,
//     messageType: MessageType.Text,
//   };

//   // ✅ 올바른 publish 사용
//   stompRef.current.publish({
//     destination: SEND_DEST,
//     body: JSON.stringify(payload),
//     headers: { 'content-type': 'application/json' }, // 선택
//   });

//   setInput('');
// };

//   // Submit 키로 메시지 전송 (React Native)
//   const handleSubmitEditing = () => {
//     handleSendMessage();
//   };

//   // 채팅방이 없는 경우
//   if (!hasRoom) {
//     return (
//       <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
//         {/* 헤더 */}
//         <View style={{
//           backgroundColor: '#ffffff',
//           borderBottomWidth: 1,
//           borderBottomColor: '#e5e7eb',
//           paddingHorizontal: 16,
//           paddingVertical: 12,
//           paddingTop: 50,
//         }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//             <TouchableOpacity onPress={onBack}>
//               <Ionicons name="arrow-back" size={24} color="#000000" />
//             </TouchableOpacity>
//             <Text style={{ fontWeight: '600' }}>채팅</Text>
//             <View style={{ width: 24, height: 24 }} />
//           </View>
//         </View>

//         {/* 채팅방 없음 화면 */}
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
//           <View style={{ alignItems: 'center', maxWidth: 300 }}>
//             <View style={{
//               width: 96,
//               height: 96,
//               borderRadius: 48,
//               backgroundColor: 'rgba(247, 179, 43, 0.1)',
//               alignItems: 'center',
//               justifyContent: 'center',
//               marginBottom: 24,
//             }}>
//               <Ionicons name="chatbubbles" size={48} color="#F7B32B" />
//             </View>
            
//             <View style={{ marginBottom: 24, alignItems: 'center' }}>
//               <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>아직 채팅방이 없어요</Text>
//               <Text style={{ 
//                 fontSize: 14, 
//                 color: '#6b7280', 
//                 textAlign: 'center', 
//                 lineHeight: 20 
//               }}>
//                 구인글을 작성하셨나요?{'\n'}채팅방을 만들어서 룸메이트들과{'\n'}대화를 시작해보세요!
//               </Text>
//             </View>

//             <View style={{ width: '100%', gap: 12 }}>
//               <Button 
//                 onPress={onNavigateToCreateRoom}
//                 style={{ 
//                   width: '100%',
//                   backgroundColor: '#F7B32B',
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: 8,
//                 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                   <Ionicons name="add" size={16} color="white" />
//                   <Text style={{ color: 'white' }}>채팅방 만들기</Text>
//                 </View>
//               </Button>
              
//               <Card style={{ padding: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#d1d5db' }}>
//                 <View style={{ alignItems: 'center', gap: 8 }}>
//                   <Text style={{ fontSize: 14, fontWeight: '500', color: '#6b7280' }}>
//                     💡 채팅방 초대를 받으셨나요?
//                   </Text>
//                   <Text style={{ fontSize: 12, color: '#6b7280' }}>
//                     알림에서 초대를 확인하고 수락해보세요!
//                   </Text>
//                   <Button 
//                     variant="outline" 
//                     onPress={() => Alert.alert('알림', '알림을 확인해주세요!')}
//                     style={{ paddingHorizontal: 16, paddingVertical: 8 }}
//                   >
//                     알림 확인하기
//                   </Button>
//                 </View>
//               </Card>
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   // 채팅방이 있는 경우
//   return (
//     <KeyboardAvoidingView 
//       style={{ flex: 1, backgroundColor: '#ffffff' }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       {/* 헤더 */}
//       <View style={{
//         backgroundColor: '#ffffff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e5e7eb',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         paddingTop: 50,
//       }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//           <TouchableOpacity onPress={onBack}>
//             <Text style={{ fontSize: 20 }}>←</Text>
//           </TouchableOpacity>
//           <View style={{ flex: 1, alignItems: 'center' }}>
//             <Text style={{ fontWeight: '600', fontSize: 14 }}>{chatRoomInfo?.name}</Text>
//             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
//               <Badge 
//                 variant={chatRoomStatus === RecruitStatus.RecruitOver ? 'default' : 'secondary'}
//                 style={
//                   chatRoomStatus === RecruitStatus.RecruitOver
//                     ? { backgroundColor: '#F7B32B' }
//                     : chatRoomStatus === RecruitStatus.Recruiting
//                     ? { backgroundColor: '#22c55e' }
//                     : {}
//                 }
//               >
//                 {chatRoomStatus === RecruitStatus.RecruitOver ? '매칭 완료' : 
//                  chatRoomStatus === RecruitStatus.Recruiting ? '매칭 준비중' : '대기중'}
//               </Badge>
//               <Text style={{ fontSize: 12, color: '#6b7280' }}>
//                 {/* 👥 {hasChatRoom?.members.length}명 - 채팅방 누가 있는지 api 연결 후 다시 실행*/}  
//               </Text>
//             </View>
//           </View>
 
//           <TouchableOpacity onPress={onNavigateToSettings}>
//             <Ionicons name="settings" size={18} color="#6b7280" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* 채팅 메시지 영역 */}
//       <ScrollView style={{ flex: 1, padding: 16 }} contentContainerStyle={{ gap: 16, paddingBottom: 120 }}>
        
//         {message.map((msg, index) => {
//           const isOwn = msg.sender === loginUser?.id;

//           return (
//             <View key={msg.id ? `${msg.id}-${index}` : `msg-${index}`}>
            
//             {/* 시스템 문자{ === true && (
//               <View style={{ alignItems: 'center' }}>
//                 <View style={{
//                   backgroundColor: '#f3f4f6',
//                   paddingHorizontal: 12,
//                   paddingVertical: 4,
//                   borderRadius: 16,
//                 }}>
//                   <Text style={{ fontSize: 12, color: '#6b7280' }}>
//                     {msg.message}
//                   </Text>
//                 </View>
//                 <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
//               </View>
//             )} */}
            
//             {/* {chatRoomStatus === RecruitStatus.Recruiting && (
//               <View style={{ alignItems: 'center' }}>
//                 <View style={{
//                   backgroundColor: '#F7B32B',
//                   paddingHorizontal: 12,
//                   paddingVertical: 8,
//                   borderRadius: 8,
//                   maxWidth: '80%',
//                 }}>
//                   <Text style={{ fontSize: 12, color: 'white' }}>
//                     📢 {msg.message}
//                   </Text>
//                 </View>
//                 <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
//               </View>
//             )} */}
            
//             {msg.message && (
//               <View style={{ 
//                 flexDirection: isOwn ? 'row-reverse' : 'row', 
//                 gap: 12 
//               }}>
//                 {/* <Avatar style={{ width: 32, height: 32 }}>
//                   <AvatarFallback>
//                     {msg.author?.slice(0, 2)}
//                   </AvatarFallback>
//                 </Avatar> */}
//                 <View style={{ 
//                   maxWidth: '70%', 
//                   alignItems: isOwn ? 'flex-end' : 'flex-start' 
//                 }}>
//                   {!isOwn && (
//                     <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>{msg.senderUsername}</Text>
//                   )}
//                   <View style={{
//                     paddingHorizontal: 12,
//                     paddingVertical: 8,
//                     borderRadius: 8,
//                     backgroundColor: isOwn ? '#F7B32B' : '#f3f4f6',
//                   }}>
//                     <Text style={{
//                       fontSize: 14,
//                       color: isOwn? 'white' : '#374151',
//                     }}>
//                       {msg.message}
//                     </Text>
//                   </View>
//                   <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
//                 </View>
//               </View>
//             )}
//           </View>
//          );
//     })}
//       </ScrollView>

//       {/* 매칭 완료 상태 표시 - 하단 고정 */}
//       {chatRoomStatus === RecruitStatus.RecruitOver && (
//         <View style={{
//           position: 'absolute',
//           bottom: 90,
//           left: 0,
//           right: 0,
//           paddingHorizontal: 16,
//           paddingVertical: 12,
//           borderTopWidth: 1,
//           borderTopColor: '#e5e7eb',
//           backgroundColor: '#f0fdf4',
//         }}>
//           <Text style={{ 
//             textAlign: 'center', 
//             fontSize: 14, 
//             color: '#15803d' 
//           }}>
//             🎉 매칭이 완료되었습니다! 이제 함께 살아보세요!
//           </Text>
//         </View>
//       )}

//       {/* 메시지 입력 영역 - 하단 고정 */}
//       <View style={{
//         position: 'absolute',
//         bottom: 20,
//         left: 0,
//         right: 0,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderTopWidth: 1,
//         borderTopColor: '#e5e7eb',
//         backgroundColor: '#ffffff',
//       }}>
//         <View style={{ flexDirection: 'row', gap: 8 }}>
//           <TextInput
//             placeholder="메시지를 입력하세요..."
//             value={input}
//             onChangeText={setInput}
//             onSubmitEditing={handleSendMessage}
//             style={{
//               flex: 1,
//               paddingHorizontal: 12,
//               paddingVertical: 8,
//               borderWidth: 1,
//               borderColor: '#e5e7eb',
//               borderRadius: 8,
//               fontSize: 14,
//             }}
//           />
//           <Button
//             onPress={handleSendMessage}
//             disabled={!input.trim()}
//             style={
//               input.trim() 
//                 ? { backgroundColor: '#F7B32B' }
//                 : { backgroundColor: '#f3f4f6' }
//             }
//           >
//             <Text style={{ color: input.trim() ? 'white' : '#9ca3af' }}>📤</Text>
//           </Button>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
    
//   );    
// }

// import React, { useState, useEffect, useRef } from 'react';
// import { api, BASE_URL } from '@/api/api';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Button } from './ui/button';
// import { Card, CardContent, CardHeader } from './ui/card';
// import { Avatar, AvatarFallback } from './ui/avatar';
// import { Badge } from './ui/badge';
// import { set } from 'react-hook-form';
// import { MessageType, RecruitStatus } from '@/types/enums';
// import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
// import { client } from 'stompjs';

// interface ChatScreenProps {
//   onBack: () => void;
//   onNavigateToSettings: () => void;
//   onNavigateToCreateRoom: () => void;
//   chatRoomState: {
//     hasRoom: boolean;
//     isOwner: boolean;
//     roomId: number | null;
//   };
//   onLeaveChatRoom: () => void;
// }

// export default function ChatScreen({ onBack, onNavigateToSettings, onNavigateToCreateRoom, chatRoomState, onLeaveChatRoom }: ChatScreenProps) {
//   const [message, setMessage] = useState<MessageInfo[]>([]);
//   const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoom | null>(null);
//   const [IsOwnerChat, setIsOwnerChat] = useState(chatRoomState.isOwner);
//   // 채팅방 상태 관리
//   const [chatRoomStatus, setchatRoomStatus] = useState<RecruitStatus>();
//   const [roomId, setRoomId] = useState<number | null>(chatRoomState.roomId ?? null);
//   const hasRoom = !!roomId;  
//   const [input, setInput] = useState<string>(''); // 채팅 보낼때의 입력 메시지 
//   const [loginUser, setLoginUser] = useState<AuthMember | null>(null);
//   const scrollRef = useRef<ScrollView>(null);

//   // 스크롤 맨 아래로
//   const scrollToBottom = () => {
//     requestAnimationFrame(() => {
//       scrollRef.current?.scrollToEnd({ animated: true });
//     });
//   };

//   // 메시지 바뀔 때마다 스크롤
//   useEffect(() => {
//     scrollToBottom();
//   }, [message]);
  
//   const stompRef = useRef<Client | null>(null);

//   interface Member {
//     id: string;
//     name: string;
//     isHost?: boolean;
//   }

//   interface RecruitInfo { // TODO : 구인글 조회 & 수정 api로 상태 수정.. 
//     postId : number;
//     status : RecruitStatus
//   }

//   interface MessageInfo{
//     id : string;
//     roomId : number;
//     sender : number;
//     senderUsername : string;
//     message : string;
//     timestamp : string;  // local date time으로 오는데 ... 변환해야하나??? 
//     messageType : MessageType;
//     imageUrl : string;
//     isSystem?: boolean; // 시스템 메시지 여부
//   }

//   interface ChatSend{
//     roomId : number;
//     senderId : number;
//     message : string;
//     messageType : MessageType;
//     imageUrl?: string;
//   }

//   interface ChatRoom {
//   id : number;
//   name : string;
//   postId : number;
//   maxMemberCount : number;
//   currentUserCount : number;
// }
// interface AuthMember {
//   id : number;
//   name : string;
//   isHost : boolean;
// }

// const getAllChatMessages = async (roomId: number) => {
//     const res = await api.get(`/chat/rooms/history/${roomId}`);
//     console.log(res);
//     setMessage(res.data.data);
// }

// const getMyChatInfo = async () => {
//     try {
//       const res = await api.get('/chat/rooms/my');
//       console.log('[my room]', res.data);

//       if (res.data?.success && res.data?.data) {
//         setChatRoomInfo(res.data.data);
//         setRoomId(res.data.data.id);           
//        // setchatRoomStatus(RecruitStatus.Recruiting);
//       } else {
//         setChatRoomInfo(null);
//         setRoomId(null);
//       }
//     } catch (e) {
//       console.error('getMyChatInfo error', e);
//       setChatRoomInfo(null);
//       setRoomId(null);
//     } 
//   };



//   const getUserInfo = async () => {
//     const res = await api.get(`/auth`);
//     console.log(res);
//     setLoginUser(res.data.data);
//   }

//   const getRecruitInfo = async (postId: number) => { 
//       const res = await api.get(`/recruits/${postId}`);
//       console.log(res);
//       setchatRoomStatus(res.data.data.status);
//   } 

//   useEffect(() => {
//     getUserInfo();
//     getMyChatInfo();
//     getRecruitInfo(chatRoomInfo?.postId as number);
//   }, []);

//   // ---- STOMP 연결: roomId가 결정된 뒤에만 ----
// useEffect(() => {
//   // 로그인 정보 없으면 아직 연결하지 않음
//   if (!roomId || !loginUser?.id) {
//     if (stompRef.current?.connected) {
//       stompRef.current.deactivate();
//       stompRef.current = null;
//     }
//     return;
//   }

//   const stomp = new Client({
//     debug: (s) => console.log('[stomp]', s),
//     reconnectDelay: 5000,
//     heartbeatIncoming: 10000,
//     heartbeatOutgoing: 10000,
//     webSocketFactory: () => new SockJS(`${BASE_URL}/ws-chat`),
//     onConnect: () => {
//       console.log('STOMP connected');

//       stomp.subscribe(`/topic/room/${roomId}`, (frame) => {
//         try {
//           const raw = JSON.parse(frame.body);
//           const incoming = normalizeMsg(raw);              // ← 아래 B) 참고
//           setMessage((prev) => {
//             if (incoming.id && prev.some(m => m.id === incoming.id)) return prev;
//             return [...prev, incoming];
//           });
//         } catch (e) {
//           console.warn('STOMP parse error', e);
//         }
//       });

//       // 초기 히스토리도 normalize
//       getAllChatMessages(roomId).then(() => scrollToBottom());
//     },
//     onStompError: (f) => console.warn('STOMP error:', f.headers['message']),
//   });

//   stomp.activate();
//   stompRef.current = stomp;

//   return () => {
//     stomp.deactivate();
//     stompRef.current = null;
//   };
// }, [roomId, loginUser?.id]);     // ← loginUser 의존성 추가



//   // 현재 시간 포맷팅
//   const getCurrentTime = () => {
//     const now = new Date();
//     return `오후 ${now.getHours() > 12 ? now.getHours() - 12 : now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
//   };

//   // 메시지 전송 기능 : api 연결코드
//   const SEND_DEST = '/app/chat/sendMessage'; 

// const handleSendMessage = async() => {
//   const text = input.trim();
//   if (!text) return;

//   if (!roomId || !loginUser?.id) {
//     Alert.alert('알림', '채팅방 또는 사용자 정보를 불러오지 못했습니다.');
//     return;
//   }
//   if (!stompRef.current || !stompRef.current.connected) {
//     Alert.alert('알림', '서버와 연결되지 않았습니다.');
//     return;
//   }
//   setInput('');
//   scrollToBottom();

//   stompRef.current.publish({
//     destination: SEND_DEST,
//     body: JSON.stringify({
//       roomId,
//       senderId: loginUser.id,
//       message: text,
//       messageType: MessageType.Text,
//     }),
//     headers: { 'content-type': 'application/json' },
//   });
// };


//   // Submit 키로 메시지 전송 (React Native)
//   const handleSubmitEditing = () => {
//     handleSendMessage();
//   };

//   // 채팅방이 없는 경우
//   if (!hasRoom) {
//     return (
//       <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
//         {/* 헤더 */}
//         <View style={{
//           backgroundColor: '#ffffff',
//           borderBottomWidth: 1,
//           borderBottomColor: '#e5e7eb',
//           paddingHorizontal: 16,
//           paddingVertical: 12,
//           paddingTop: 50,
//         }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//             <TouchableOpacity onPress={onBack}>
//               <Ionicons name="arrow-back" size={24} color="#000000" />
//             </TouchableOpacity>
//             <Text style={{ fontWeight: '600' }}>채팅</Text>
//             <View style={{ width: 24, height: 24 }} />
//           </View>
//         </View>

//         {/* 채팅방 없음 화면 */}
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
//           <View style={{ alignItems: 'center', maxWidth: 300 }}>
//             <View style={{
//               width: 96,
//               height: 96,
//               borderRadius: 48,
//               backgroundColor: 'rgba(247, 179, 43, 0.1)',
//               alignItems: 'center',
//               justifyContent: 'center',
//               marginBottom: 24,
//             }}>
//               <Ionicons name="chatbubbles" size={48} color="#F7B32B" />
//             </View>
            
//             <View style={{ marginBottom: 24, alignItems: 'center' }}>
//               <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>아직 채팅방이 없어요</Text>
//               <Text style={{ 
//                 fontSize: 14, 
//                 color: '#6b7280', 
//                 textAlign: 'center', 
//                 lineHeight: 20 
//               }}>
//                 구인글을 작성하셨나요?{'\n'}채팅방을 만들어서 룸메이트들과{'\n'}대화를 시작해보세요!
//               </Text>
//             </View>

//             <View style={{ width: '100%', gap: 12 }}>
//               <Button 
//                 onPress={onNavigateToCreateRoom}
//                 style={{ 
//                   width: '100%',
//                   backgroundColor: '#F7B32B',
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   gap: 8,
//                 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                   <Ionicons name="add" size={16} color="white" />
//                   <Text style={{ color: 'white' }}>채팅방 만들기</Text>
//                 </View>
//               </Button>
              
//               <Card style={{ padding: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#d1d5db' }}>
//                 <View style={{ alignItems: 'center', gap: 8 }}>
//                   <Text style={{ fontSize: 14, fontWeight: '500', color: '#6b7280' }}>
//                     💡 채팅방 초대를 받으셨나요?
//                   </Text>
//                   <Text style={{ fontSize: 12, color: '#6b7280' }}>
//                     알림에서 초대를 확인하고 수락해보세요!
//                   </Text>
//                   <Button 
//                     variant="outline" 
//                     onPress={() => Alert.alert('알림', '알림을 확인해주세요!')}
//                     style={{ paddingHorizontal: 16, paddingVertical: 8 }}
//                   >
//                     알림 확인하기
//                   </Button>
//                 </View>
//               </Card>
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   // 채팅방이 있는 경우
//   return (
//     <KeyboardAvoidingView 
//       style={{ flex: 1, backgroundColor: '#ffffff' }}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       {/* 헤더 */}
//       <View style={{
//         backgroundColor: '#ffffff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e5e7eb',
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         paddingTop: 50,
//       }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
//           <TouchableOpacity onPress={onBack}>
//             <Text style={{ fontSize: 20 }}>←</Text>
//           </TouchableOpacity>
//           <View style={{ flex: 1, alignItems: 'center' }}>
//             <Text style={{ fontWeight: '600', fontSize: 14 }}>{chatRoomInfo?.name}</Text>
//             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
//               <Badge 
//                 variant={chatRoomStatus === RecruitStatus.RecruitOver ? 'default' : 'secondary'}
//                 style={
//                   chatRoomStatus === RecruitStatus.RecruitOver
//                     ? { backgroundColor: '#F7B32B' }
//                     : chatRoomStatus === RecruitStatus.Recruiting
//                     ? { backgroundColor: '#22c55e' }
//                     : {}
//                 }
//               >
//                 {chatRoomStatus === RecruitStatus.RecruitOver ? '매칭 완료' : 
//                  chatRoomStatus === RecruitStatus.Recruiting ? '매칭 준비중' : '대기중'}
//               </Badge>
//               <Text style={{ fontSize: 12, color: '#6b7280' }}>
//                 {/* 👥 {hasChatRoom?.members.length}명 - 채팅방 누가 있는지 api 연결 후 다시 실행*/}  
//               </Text>
//             </View>
//           </View>
 
//           <TouchableOpacity onPress={onNavigateToSettings}>
//             <Ionicons name="settings" size={18} color="#6b7280" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* 채팅 메시지 영역 */}
//       <ScrollView ref={scrollRef} style={{ flex: 1, padding: 16 }} contentContainerStyle={{ gap: 16, paddingBottom: 120 }}>
        
//         {message.map((msg, index) => {
//           const isOwn = Number(msg.sender) === Number(loginUser?.id);
//           console.log(`isOwn : ${isOwn} loginUser ${loginUser?.id} msgSender ${msg.sender}`)

//           return (
//             <View key={msg.id ? `${msg.id}-${index}` : `msg-${index}`}>
            
//             {/* 시스템 문자{ === true && (
//               <View style={{ alignItems: 'center' }}>
//                 <View style={{
//                   backgroundColor: '#f3f4f6',
//                   paddingHorizontal: 12,
//                   paddingVertical: 4,
//                   borderRadius: 16,
//                 }}>
//                   <Text style={{ fontSize: 12, color: '#6b7280' }}>
//                     {msg.message}
//                   </Text>
//                 </View>
//                 <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
//               </View>
//             )} */}
            
//             {/* {chatRoomStatus === RecruitStatus.Recruiting && (
//               <View style={{ alignItems: 'center' }}>
//                 <View style={{
//                   backgroundColor: '#F7B32B',
//                   paddingHorizontal: 12,
//                   paddingVertical: 8,
//                   borderRadius: 8,
//                   maxWidth: '80%',
//                 }}>
//                   <Text style={{ fontSize: 12, color: 'white' }}>
//                     📢 {msg.message}
//                   </Text>
//                 </View>
//                 <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
//               </View>
//             )} */}
            
//             {msg.message && (
//               <View style={{ 
//                 flexDirection: isOwn ? 'row-reverse' : 'row', 
//                 gap: 12 
//               }}>
//                 {/* <Avatar style={{ width: 32, height: 32 }}>
//                   <AvatarFallback>
//                     {msg.author?.slice(0, 2)}
//                   </AvatarFallback>
//                 </Avatar> */}
//                 <View style={{ 
//                   maxWidth: '70%', 
//                   alignItems: isOwn ? 'flex-end' : 'flex-start' 
//                 }}>
//                   {!isOwn && (
//                     <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>{msg.senderUsername}</Text>
//                   )}
//                   <View style={{
//                     paddingHorizontal: 12,
//                     paddingVertical: 8,
//                     borderRadius: 8,
//                     backgroundColor: isOwn ? '#F7B32B' : '#f3f4f6',
//                   }}>
//                     <Text style={{
//                       fontSize: 14,
//                       color: isOwn? 'white' : '#374151',
//                     }}>
//                       {msg.message}
//                     </Text>
//                   </View>
//                   <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{msg.timestamp}</Text>
//                 </View>
//               </View>
//             )}
//           </View>
//          );
//     })}
//       </ScrollView>

//       {/* 매칭 완료 상태 표시 - 하단 고정 */}
//       {chatRoomStatus === RecruitStatus.RecruitOver && (
//         <View style={{
//           position: 'absolute',
//           bottom: 90,
//           left: 0,
//           right: 0,
//           paddingHorizontal: 16,
//           paddingVertical: 12,
//           borderTopWidth: 1,
//           borderTopColor: '#e5e7eb',
//           backgroundColor: '#f0fdf4',
//         }}>
//           <Text style={{ 
//             textAlign: 'center', 
//             fontSize: 14, 
//             color: '#15803d' 
//           }}>
//             🎉 매칭이 완료되었습니다! 이제 함께 살아보세요!
//           </Text>
//         </View>
//       )}

//       {/* 메시지 입력 영역 - 하단 고정 */}
//       <View style={{
//         position: 'absolute',
//         bottom: 20,
//         left: 0,
//         right: 0,
//         paddingHorizontal: 16,
//         paddingVertical: 12,
//         borderTopWidth: 1,
//         borderTopColor: '#e5e7eb',
//         backgroundColor: '#ffffff',
//       }}>
//         <View style={{ flexDirection: 'row', gap: 8 }}>
//           <TextInput
//             placeholder="메시지를 입력하세요..."
//             value={input}
//             onChangeText={setInput}
//             onSubmitEditing={handleSendMessage}
//             style={{
//               flex: 1,
//               paddingHorizontal: 12,
//               paddingVertical: 8,
//               borderWidth: 1,
//               borderColor: '#e5e7eb',
//               borderRadius: 8,
//               fontSize: 14,
//             }}
//           />
//           <Button
//             onPress={handleSendMessage}
//             disabled={!input.trim()}
//             style={
//               input.trim() 
//                 ? { backgroundColor: '#F7B32B' }
//                 : { backgroundColor: '#f3f4f6' }
//             }
//           >
//             <Text style={{ color: input.trim() ? 'white' : '#9ca3af' }}>📤</Text>
//           </Button>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
    
//   );    
// }

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { MessageType, RecruitStatus } from '@/types/enums';

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

interface MessageInfo {
  id: string;
  roomId: number;
  sender: number;
  senderUsername: string;
  message: string;
  timestamp: string;
  messageType: MessageType;
  imageUrl: string;
}

interface ChatRoom {
  id: number;
  name: string;
  postId: number;
  maxMemberCount: number;
  currentUserCount: number;
}

interface AuthMember {
  id: number;
  name: string;
  isHost: boolean;
}

export default function ChatScreen({ onBack, onNavigateToSettings, onNavigateToCreateRoom, chatRoomState }: ChatScreenProps) {
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoom | null>(null);
  const [chatRoomStatus, setChatRoomStatus] = useState<RecruitStatus>();
  const [roomId, setRoomId] = useState<number | null>(chatRoomState.roomId ?? null);
  const hasRoom = !!roomId;
  const [input, setInput] = useState<string>('');
  const [loginUser, setLoginUser] = useState<AuthMember | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  const scrollRef = useRef<ScrollView>(null);
  const stompRef = useRef<Client | null>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const getAllChatMessages = useCallback(async (currentRoomId: number) => {
    try {
      console.log('Fetching chat history for room:', currentRoomId);
      const res = await api.get(`/chat/rooms/history/${currentRoomId}`);
      console.log('Chat history response:', res.data);
      setMessages(res.data.data || []);
    } catch (e) {
      console.error("Failed to fetch chat history", e);
      setMessages([]);
    }
  }, []);
  
  const getUserInfo = useCallback(async () => {
    try {
      const res = await api.get(`/auth`);
      console.log('User info response:', res.data);
      setLoginUser(res.data.data);
    } catch (e) {
      console.error('getUserInfo error', e);
    }
  }, []);

  const getMyChatInfo = useCallback(async () => {
    try {
      const res = await api.get('/chat/rooms/my');
      console.log('My chat info response:', res.data);
      if (res.data?.success && res.data?.data) {
        setChatRoomInfo(res.data.data);
        setRoomId(res.data.data.id);
      } else {
        setChatRoomInfo(null);
        setRoomId(null);
      }
    } catch (e) {
      console.error('getMyChatInfo error', e);
      setChatRoomInfo(null);
      setRoomId(null);
    }
  }, []);

  const getRecruitInfo = useCallback(async (postId: number) => {
    if (!postId) return;
    try {
      const res = await api.get(`/recruits/${postId}`);
      setChatRoomStatus(res.data.data.status);
    } catch (e) {
      console.error('getRecruitInfo error', e);
    }
  }, []);

  useEffect(() => {
    getUserInfo();
    getMyChatInfo();
  }, [getUserInfo, getMyChatInfo]);

  useEffect(() => {
    if (chatRoomInfo?.postId) {
      getRecruitInfo(chatRoomInfo.postId);
    }
  }, [chatRoomInfo, getRecruitInfo]);

  useEffect(() => {
    if (!roomId || !loginUser?.id) {
      console.log('No roomId or loginUser, disconnecting WebSocket');
      if (stompRef.current?.connected) {
        stompRef.current.deactivate();
      }
      setIsConnected(false);
      return;
    }

    console.log('Setting up WebSocket connection for room:', roomId, 'user:', loginUser.id);
    getAllChatMessages(roomId);

    const stomp = new Client({
      debug: (s) => console.log('[STOMP]', s),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws-chat`),
      onConnect: () => {
        console.log('STOMP connected successfully');
        setIsConnected(true);
        
        // 채팅방 구독
        stomp.subscribe(`/topic/room/${roomId}`, (frame) => {
          try {
            console.log('Received message:', frame.body);
            const incomingMessage: MessageInfo = JSON.parse(frame.body);
            
            setMessages((prevMessages) => {
              // 중복 메시지 체크
              if (prevMessages.some((msg) => msg.id === incomingMessage.id)) {
                console.log('Duplicate message, ignoring:', incomingMessage.id);
                return prevMessages;
              }
              console.log('Adding new message:', incomingMessage);
              return [...prevMessages, incomingMessage];
            });
          } catch (e) {
            console.error('STOMP message parse error:', e);
          }
        });
      },
      onDisconnect: () => {
        console.log('STOMP disconnected');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        setIsConnected(false);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        setIsConnected(false);
      },
    });

    stomp.activate();
    stompRef.current = stomp;

    return () => {
      console.log('Cleaning up WebSocket connection');
      if (stompRef.current) {
        stompRef.current.deactivate();
      }
      setIsConnected(false);
    };
  }, [roomId, loginUser?.id, getAllChatMessages]);

  const handleSendMessage = async () => {
    const text = input.trim();
    if (!text) {
      Alert.alert('알림', '메시지를 입력해주세요.');
      return;
    }

    if (!stompRef.current?.connected || !roomId || !loginUser?.id) {
      Alert.alert('알림', '메시지를 보낼 수 없습니다. 연결 상태를 확인해주세요.');
      return;
    }

    console.log('Sending message:', text, 'from user:', loginUser.id, 'to room:', roomId);

    // 임시 메시지 ID 생성 (실제로는 서버에서 생성됨)
    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMessage: MessageInfo = {
      id: tempId,
      roomId: roomId,
      sender: loginUser.id,
      senderUsername: loginUser.name,
      message: text,
      timestamp: new Date().toISOString(),
      messageType: MessageType.Text,
      imageUrl: '',
    };

    try {
      // 즉시 UI에 메시지 추가 (낙관적 업데이트)
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      setInput(''); // 입력창 즉시 클리어

      // 서버로 메시지 전송
      stompRef.current.publish({
        destination: '/app/chat/sendMessage',
        body: JSON.stringify({
          roomId,
          senderId: loginUser.id,
          message: text,
          messageType: MessageType.Text,
        }),
        headers: { 'content-type': 'application/json' },
      });

      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
      // 전송 실패 시 임시 메시지 제거
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== tempId)
      );
      setInput(text); // 입력창에 메시지 복원
      Alert.alert('오류', '메시지 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 채팅방이 없는 경우의 UI
  if (!hasRoom) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{ backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 50 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={onBack}><Ionicons name="arrow-back" size={24} color="#000000" /></TouchableOpacity>
            <Text style={{ fontWeight: '600' }}>채팅</Text>
            <View style={{ width: 24, height: 24 }} />
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ alignItems: 'center', maxWidth: 300 }}>
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(247, 179, 43, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Ionicons name="chatbubbles" size={48} color="#F7B32B" />
            </View>
            <View style={{ marginBottom: 24, alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>아직 채팅방이 없어요</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 }}>
                구인글을 작성하셨나요?{`\n`}채팅방을 만들어서 룸메이트들과{`\n`}대화를 시작해보세요!
              </Text>
            </View>
            <View style={{ width: '100%', gap: 12 }}>
              <Button onPress={onNavigateToCreateRoom} style={{ width: '100%', backgroundColor: '#F7B32B', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="add" size={16} color="white" />
                  <Text style={{ color: 'white' }}>채팅방 만들기</Text>
                </View>
              </Button>
              <Card style={{ padding: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#d1d5db' }}>
                <View style={{ alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#6b7280' }}>💡 채팅방 초대를 받으셨나요?</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280' }}>알림에서 초대를 확인하고 수락해보세요!</Text>
                  <Button variant="outline" onPress={() => Alert.alert('알림', '알림을 확인해주세요!')} style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
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

  // 채팅방이 있는 경우의 UI
  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingHorizontal: 16, paddingVertical: 12, paddingTop: 50 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={onBack}><Text style={{ fontSize: 20 }}>←</Text></TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 14 }}>{chatRoomInfo?.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              <Badge variant={chatRoomStatus === RecruitStatus.RecruitOver ? 'default' : 'secondary'} style={chatRoomStatus === RecruitStatus.RecruitOver ? { backgroundColor: '#F7B32B' } : chatRoomStatus === RecruitStatus.Recruiting ? { backgroundColor: '#22c55e' } : {}}>
                {chatRoomStatus === RecruitStatus.RecruitOver ? '매칭 완료' : chatRoomStatus === RecruitStatus.Recruiting ? '매칭 준비중' : '대기중'}
              </Badge>
              {/* 연결 상태 표시 */}
              <View style={{ 
                width: 8, 
                height: 8, 
                borderRadius: 4, 
                backgroundColor: isConnected ? '#22c55e' : '#ef4444' 
              }} />
            </View>
          </View>
          <TouchableOpacity onPress={onNavigateToSettings}><Ionicons name="settings" size={18} color="#6b7280" /></TouchableOpacity>
        </View>
      </View>

      {/* Main content area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Scrollable messages */}
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((msg, index) => {
            // 숫자 타입으로 비교하도록 확실히 변환
            const isOwn = Number(msg.sender) === Number(loginUser?.id);
            console.log('Message render - sender:', msg.sender, 'loginUser:', loginUser?.id, 'isOwn:', isOwn);
            
            return (
              <View key={msg.id ? `${msg.id}-${index}` : `msg-${index}`}>
                {msg.message && (
                  <View style={{ flexDirection: isOwn ? 'row-reverse' : 'row', gap: 12 }}>
                    <View style={{ maxWidth: '70%', alignItems: isOwn ? 'flex-end' : 'flex-start' }}>
                      {!isOwn && (
                        <Text style={{ fontSize: 14, fontWeight: '500', marginBottom: 4 }}>{msg.senderUsername}</Text>
                      )}
                      <View style={{ 
                        paddingHorizontal: 12, 
                        paddingVertical: 8, 
                        borderRadius: 8, 
                        backgroundColor: isOwn ? '#F7B32B' : '#f3f4f6' 
                      }}>
                        <Text style={{ fontSize: 14, color: isOwn ? 'white' : '#374151' }}>
                          {msg.message}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                        {new Date(msg.timestamp).toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Matching complete banner */}
        {chatRoomStatus === RecruitStatus.RecruitOver && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#f0fdf4' }}>
            <Text style={{ textAlign: 'center', fontSize: 14, color: '#15803d' }}>
              🎉 매칭이 완료되었습니다! 이제 함께 살아보세요!
            </Text>
          </View>
        )}

        {/* Message input area */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#ffffff' }}>
          {/* 연결 상태 경고 */}
          {!isConnected && (
            <View style={{ paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#fef3c7', borderRadius: 6, marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: '#92400e', textAlign: 'center' }}>
                연결이 끊어졌습니다. 재연결 중...
              </Text>
            </View>
          )}
          
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
                fontSize: 14 
              }}
            />
            <Button
              onPress={handleSendMessage}
              disabled={!input.trim() || !isConnected}
              style={input.trim() && isConnected ? { backgroundColor: '#F7B32B' } : { backgroundColor: '#f3f4f6' }}
            >
              <Text style={{ color: input.trim() && isConnected ? 'white' : '#9ca3af' }}>📤</Text>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
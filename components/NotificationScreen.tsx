import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from './ui/card';
import { AlarmSourceType, AlarmType } from '@/types/enums';

interface NotificationScreenProps {
  onBack?: () => void;
  onNavigateToJob?: (jobId: string) => void;
  onNavigateToSettings?: () => void;
}


/*

    {
      id: 1,
      type: "apply",
      title: "새로운 지원자가 있어요",
      message: "이지영님이 '강남역 근처 원룸' 구인글에 지원했습니다.",
      time: "5분 전",
      isRead: false,
      icon: 'people'
    },
    {
      id: 2,
      type: "chat",
      title: "새로운 메시지",
      message: "박준호님이 메시지를 보냈습니다: '혹시 내일 만날 수 있나요?'",
      time: "1시간 전",
      isRead: false,
      icon: 'chatbubble'
    },
    {
      id: 3,
      type: "match",
      title: "매칭이 완료되었어요!",
      message: "홍대 투룸 쉐어 구인글에서 매칭이 성사되었습니다.",
      time: "3시간 전",
      isRead: true,
      icon: 'heart'
    },
        {
      id: 4,
      type: "system",
      title: "프로필 업데이트 알림",
      message: "공개 프로필을 최신 상태로 유지해주세요.",
      time: "1일 전",
      isRead: true,
      icon: 'notifications'
    }

    */

  interface NotificationResponse {
    noticeId : number;
    isRead : boolean;
    alarmId : number;
    alarmType : AlarmType;  // 백엔드 알림 타입바꾸기 
    sourceType : AlarmSourceType;
    sourceId : number;
    fromUserId : number;
    toUserId : number;
  }
  
export default function NotificationScreen({ onBack, onNavigateToJob, onNavigateToSettings }: NotificationScreenProps) {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
    Alert.alert('완료', '모든 알림을 읽음으로 표시했습니다');
  };

  const handleNotificationClick = (notificationId: number) => {
    setNotifications(notifications.map(notification => 
      notification.noticeId === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };


  const getBgColor = (type: string, isRead: boolean) => {
    if (isRead) return '#f3f4f6';
    
    switch (type) {
      case "apply":
        return '#dbeafe';
      case "chat":
        return '#d1fae5';
      case "match":
        return '#fee2e2';
      default:
        return '#f3f4f6';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'apply': return '#3b82f6';
      case 'chat': return '#10b981'; 
      case 'match': return '#ef4444';
      case 'system': return '#6b7280';
      default: return '#6b7280';
    }
  };

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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600' }}>알림</Text>
          </View>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={{ fontSize: 14, color: '#F7B32B' }}>
              모두 읽음
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ padding: 16 }}>
        {/* 알림 목록 */}
        <View style={{ gap: 12 }}>
          {notifications.map((notification) => {
            return (
              <TouchableOpacity
                key={notification.noticeId}
                onPress={() => handleNotificationClick(notification.noticeId)}
                activeOpacity={0.7}
              >
                <Card style={{
                  opacity: notification.isRead ? 0.7 : 1,
                }}>
                  <CardContent style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: getBgColor(notification.alarmType, notification.isRead),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Ionicons 
                          name={notification.icon as any} 
                          size={20} 
                          color={notification.isRead ? '#9ca3af' : getIconColor(notification.alarmType)} 
                        />
                      </View>
                      
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: notification.isRead ? '#6b7280' : '#111827',
                            flex: 1,
                          }}>
                            {notification.alarmId} {/*수정해야함*/}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            {/* <Text style={{ fontSize: 12, color: '#6b7280' }}>{notification.}</Text> */}
                            {!notification.isRead && (
                              <View style={{
                                width: 8,
                                height: 8,
                                backgroundColor: '#F7B32B',
                                borderRadius: 4,
                              }} />
                            )}
                          </View>
                        </View>
                        <Text style={{
                          fontSize: 14,
                          color: notification.isRead ? '#9ca3af' : '#374151',
                          lineHeight: 20,
                        }}>
                          {notification.sourceId}  {/*이것도 수정하기 */}
                        </Text>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 빈 상태 */}
        {notifications.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Ionicons name="notifications" size={48} color="#9ca3af" style={{ marginBottom: 16 }} />
            <Text style={{ color: '#6b7280', fontSize: 16 }}>새로운 알림이 없어요</Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 4, textAlign: 'center' }}>
              구인글 활동이 있으면 알림을 받을 수 있어요
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
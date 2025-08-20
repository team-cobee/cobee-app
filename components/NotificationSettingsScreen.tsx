import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader } from './ui/card';
import { Switch } from './ui/switch';

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

export default function NotificationSettingsScreen({ onBack }: NotificationSettingsScreenProps) {
  const [settings, setSettings] = useState({
    chatInvite: true,
    newApplication: true,
    matchingComplete: true,
    systemNotifications: true,
    marketingNotifications: false,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const notificationGroups = [
    {
      title: "서비스 알림",
      description: "CoBee 서비스 이용과 관련된 알림",
      items: [
        {
          key: 'chatInvite' as keyof typeof settings,
          label: "채팅 초대 알림",
          description: "구인글 채팅방에 초대되었을 때"
        },
        {
          key: 'newApplication' as keyof typeof settings,
          label: "지원자 발생 알림",
          description: "내 구인글에 새로운 지원자가 생겼을 때"
        },
        {
          key: 'matchingComplete' as keyof typeof settings,
          label: "매칭 알림",
          description: "룸메이트 매칭이 완료되었을 때"
        },
        {
          key: 'systemNotifications' as keyof typeof settings,
          label: "시스템 알림",
          description: "서비스 점검, 업데이트 등"
        }
      ]
    },
    {
      title: "수신 방법",
      description: "알림을 받고 싶은 방법을 선택하세요",
      items: [
        {
          key: 'pushNotifications' as keyof typeof settings,
          label: "푸시 알림",
          description: "앱에서 바로 받는 알림"
        },
        {
          key: 'emailNotifications' as keyof typeof settings,
          label: "이메일 알림",
          description: "등록된 이메일로 받는 알림"
        },
        {
          key: 'smsNotifications' as keyof typeof settings,
          label: "SMS 알림",
          description: "휴대폰 문자로 받는 알림"
        }
      ]
    },
    {
      title: "마케팅",
      description: "이벤트, 혜택 정보 등",
      items: [
        {
          key: 'marketingNotifications' as keyof typeof settings,
          label: "마케팅 알림",
          description: "이벤트, 혜택, 서비스 소식"
        }
      ]
    }
  ];

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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>알림 설정</Text>
        </View>
      </View>

      <ScrollView style={{ padding: 16 }} contentContainerStyle={{ gap: 16 }}>
        {notificationGroups.map((group, groupIndex) => (
          <Card key={groupIndex}>
            <CardHeader style={{ paddingBottom: 12 }}>
              <View>
                <Text style={{ fontWeight: '500', fontSize: 16 }}>{group.title}</Text>
                <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                  {group.description}
                </Text>
              </View>
            </CardHeader>
            <CardContent style={{ gap: 16 }}>
              {group.items.map((item) => (
                <View key={item.key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '500', fontSize: 14 }}>{item.label}</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      {item.description}
                    </Text>
                  </View>
                  <Switch
                    checked={settings[item.key]}
                    onCheckedChange={() => handleToggle(item.key)}
                  />
                </View>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* 알림 시간 설정 */}
        <Card>
          <CardHeader style={{ paddingBottom: 12 }}>
            <View>
              <Text style={{ fontWeight: '500', fontSize: 16 }}>알림 시간</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                알림을 받지 않을 시간대를 설정하세요
              </Text>
            </View>
          </CardHeader>
          <CardContent style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '500', fontSize: 14 }}>방해 금지 모드</Text>
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                  설정된 시간에는 알림을 받지 않습니다
                </Text>
              </View>
              <Switch
                checked={false}
                onCheckedChange={() => {}}
              />
            </View>

            <View style={{ paddingLeft: 16, gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>시작 시간</Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>오후 10:00</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>종료 시간</Text>
                <Text style={{ fontSize: 14, color: '#6b7280' }}>오전 8:00</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 개인정보 처리방침 */}
        <Card>
          <CardContent style={{ padding: 16 }}>
            <View style={{ gap: 8 }}>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                • 서비스 알림은 서비스 이용에 필요한 필수 알림으로 해제할 수 없습니다
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                • 마케팅 알림은 언제든지 해제할 수 있습니다
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                • 알림 설정은 즉시 적용됩니다
              </Text>
              <View style={{ paddingTop: 8, flexDirection: 'row', flexWrap: 'wrap' }}>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  개인정보 처리에 대한 자세한 내용은{' '}
                </Text>
                <TouchableOpacity>
                  <Text style={{ fontSize: 12, color: '#F7B32B', textDecorationLine: 'underline' }}>
                    개인정보처리방침
                  </Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  을 확인해주세요
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
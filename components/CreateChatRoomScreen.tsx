import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { api } from '@/api/api';

interface CreateChatRoomScreenProps {
  onBack: () => void;
  onNext?: (name: string) => void; // (선택) 기존 시그니처 유지해도 됨
}

export default function CreateChatRoomScreen({ onBack, onNext }: CreateChatRoomScreenProps) {
  const [roomName, setRoomName] = useState('');

  const handleNext = () => {
    if (roomName.trim()) {
      onNext?.(roomName);
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
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color="#000000" />
          </TouchableOpacity>
          <Text style={{ fontWeight: '600' }}>채팅방 만들기</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>
      </View>

      <ScrollView style={{ padding: 24 }}>
        {/* 진행률 */}
        <View style={{ marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#E6940C',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>1</Text>
            </View>
            <View style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#e5e7eb',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#6b7280' }}>2</Text>
            </View>
          </View>
          <View style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: 4, height: 8 }}>
            <View style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#E6940C',
              width: '50%',
            }} />
          </View>
        </View>

        <View style={{ gap: 24 }}>
          {/* 설명 */}
          <View style={{ alignItems: 'center' }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(247, 179, 43, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 40, color: '#F7B32B' }}>💬</Text>
            </View>
            
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>채팅방 정보</Text>
              <Text style={{ 
                fontSize: 14, 
                color: '#6b7280', 
                textAlign: 'center', 
                lineHeight: 20 
              }}>
                채팅방 이름을 설정해주세요.{'\n'}나중에 변경할 수 있습니다.
              </Text>
            </View>
          </View>

          {/* 채팅방 이름 입력 */}
          <Card>
            <CardHeader style={{ paddingBottom: 12 }}>
              <Text style={{ fontWeight: '500' }}>채팅방 이름</Text>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="ex) 강남역 근처 룸메이트"
                value={roomName}
                onChangeText={setRoomName}
                maxLength={50}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  구인글 제목을 기본으로 사용할 수 있습니다
                </Text>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>
                  {roomName.length}/50
                </Text>
              </View>
            </CardContent>
          </Card>

          {/* 안내 사항 */}
          <Card>
            <CardContent style={{ padding: 16 }}>
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(247, 179, 43, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ color: '#F7B32B', fontSize: 16 }}>👥</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>한 개의 채팅방만 운영</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>
                      유저당 하나의 채팅방만 만들 수 있습니다
                    </Text>
                  </View>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Text style={{ color: '#16a34a', fontSize: 16 }}>💬</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>구인글 기반 채팅방</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>
                      내가 작성한 구인글을 선택해서 채팅방을 만듭니다
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* 다음 버튼 */}
        <View style={{ marginTop: 32 }}>
          <Button
            onPress={handleNext}
            disabled={!roomName.trim()}
            style={
              roomName.trim()
                ? { backgroundColor: '#E6940C', width: '100%' }
                : { backgroundColor: 'rgba(247, 179, 43, 0.5)', width: '100%' }
            }
          >
            다음
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface JobPostingCompleteScreenProps {
  onGoHome: () => void;
  onViewPost: () => void;
}

export default function JobPostingCompleteScreen({ onGoHome, onViewPost }: JobPostingCompleteScreenProps) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#ffffff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <Card style={{ width: '100%', maxWidth: 320 }}>
        <CardContent style={{ 
          padding: 32, 
          alignItems: 'center', 
          gap: 24 
        }}>
          {/* 성공 아이콘 */}
          <View style={{ alignItems: 'center' }}>
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'rgba(247, 179, 43, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="checkmark-circle" size={32} color="#F7B32B" />
            </View>
          </View>

          {/* 메시지 */}
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: '600', 
              textAlign: 'center' 
            }}>
              구인글 등록 완료!
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 20,
            }}>
              구인글이 성공적으로 등록되었습니다.{'\n'}많은 룸메이트들과 매칭되시길 바랍니다!
            </Text>
          </View>

          {/* 버튼들 */}
          <View style={{ width: '100%', gap: 12 }}>
            <Button 
              onPress={onViewPost}
              style={{ 
                width: '100%',
                backgroundColor: '#E6940C',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="eye" size={16} color="white" />
              <Text style={{ color: 'white' }}>내 구인글 보기</Text>
            </Button>
            
            <Button 
              variant="outline"
              onPress={onGoHome}
              style={{ 
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="home" size={16} color="#6b7280" />
              <Text>홈으로 이동</Text>
            </Button>
          </View>

          {/* 추가 안내 */}
          <View style={{
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            width: '100%',
          }}>
            <Text style={{
              fontSize: 12,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 16,
            }}>
              💡 팁: 프로필을 완성하고 매칭 선호도를 설정하면{'\n'}더 좋은 룸메이트와 만날 확률이 높아집니다!
            </Text>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
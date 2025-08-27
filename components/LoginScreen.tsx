import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';

type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 160,
    height: 128,
    resizeMode: 'contain',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#6b7280',
  },
  buttonContainer: {
    gap: 16,
  },
  signupContainer: {
    marginTop: 32,
    paddingTop: 16,
  },
  signupButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  signupText: {
    fontSize: 16,
    color: '#6b7280',
  },
  kakaoLoginButton: {
    width: '100%',
    height: 48,
    resizeMode: 'contain',
  },
  googleLoginButton: {
    width: '100%',
    height: 48,
    resizeMode: 'contain',
  },
  devTokenInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    fontSize: 12,
    marginBottom: 8,
  },
  devLoginContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    gap: 8,
  },
  devLoginTitle: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 4,
  }
});

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { signIn } = useAuth();
  const [manualToken, setManualToken] = useState('');

  const handleDisabledLogin = () => {
    Alert.alert(
      '클라이언트 ID 필요',
      '이 기능을 사용하려면 Google Cloud Console에서 생성한 Android 클라이언트 ID가 필요합니다. 지금은 임시 토큰 로그인을 이용해주세요.'
    );
  };

  const handleManualSignIn = async () => {
    if (!manualToken.trim()) {
      Alert.alert('오류', '토큰을 입력해주세요.');
      return;
    }
    try {
      await signIn(manualToken.trim());
    } catch (e: any) {
      Alert.alert('로그인 실패', e.message);
    }
  };

  const handleNavigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{flex: 1}}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/cobee-logo.png')}
            style={styles.logo}
          />
          <Text style={styles.subtitle}>
            완벽한 룸메이트를 찾아보세요
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleDisabledLogin}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/images/kakao-login.png')}
              style={styles.kakaoLoginButton}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDisabledLogin}
            activeOpacity={0.8}
          >
            <Image
              source={require('../assets/images/google-login.png')}
              style={styles.googleLoginButton}
            />
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleNavigateToSignup}
            >
              <Text style={styles.signupText}>회원가입하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Temporary Manual Token Login for Testing */}
        <View style={styles.devLoginContainer}>
          <Text style={styles.devLoginTitle}>▼ 임시 테스트용 로그인 ▼</Text>
          <TextInput
            style={styles.devTokenInput}
            placeholder="여기에 JWT 토큰을 붙여넣으세요"
            value={manualToken}
            onChangeText={setManualToken}
            autoCapitalize="none"
            multiline
          />
          <Button onPress={handleManualSignIn}>
            <Text>토큰으로 로그인</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
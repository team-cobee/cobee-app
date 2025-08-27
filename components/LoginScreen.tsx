import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../context/AuthContext';

WebBrowser.maybeCompleteAuthSession();

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
});

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { signIn } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '948911288824-m7ek0chd2dlpl7dviokv1gmjfasdg165.apps.googleusercontent.com',
    // For a real app, you should use separate client IDs for each platform.
    // androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    // iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: '948911288824-m7ek0chd2dlpl7dviokv1gmjfasdg165.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        // The mobile flow typically uses an authorization code, not an access token directly.
        // However, if we get an access token, we can try to use it.
        // Let's assume the backend expects an authorization code.
        // The property for the code is not directly available in the success response for the implicit flow.
        // We need to ensure we are using the "code" response type.
        // The useAuthRequest hook should handle this, but let's check the response.

        // The `code` is often in `response.params.code` when using `responseType: 'code'`
        const code = response.params.code;
        if (code) {
          exchangeCodeForToken(code);
        } else {
           Alert.alert('Login Error', 'Could not get authorization code from Google.');
        }
      }
    } else if (response?.type === 'error') {
      Alert.alert('Login Error', response.error?.message || 'An unknown error occurred');
    }
  }, [response]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const res = await fetch('http://localhost:8080/login/oauth2/code/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      const json = await res.json();

      if (json.success && json.data.token) {
        await signIn(json.data.token);
      } else {
        throw new Error(json.message || 'Failed to get token from server.');
      }
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || 'An error occurred during login.');
    }
  };

  const handleGoogleLogin = () => {
    promptAsync();
  };

  const handleKakaoLogin = () => {
    Alert.alert('Not Implemented', 'Kakao Login is not yet implemented.');
  };

  const handleNavigateToSignup = () => {
    navigation.navigate('Signup');
  };

  return (
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
          onPress={handleKakaoLogin}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/images/kakao-login.png')}
            style={styles.kakaoLoginButton}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleGoogleLogin}
          activeOpacity={0.8}
          disabled={!request}
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
    </View>
  );
}
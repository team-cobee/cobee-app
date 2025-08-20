import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

interface LoginScreenProps {
  onLogin?: () => void;
  onSkip?: () => void;
  onSignup?: () => void;
}

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
  skipContainer: {
    marginTop: 32,
    paddingTop: 16,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
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

export default function LoginScreen({ onSkip, onSignup }: LoginScreenProps) {
  const handleSignup = () => {
    onSignup?.();
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
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/images/kakao-login.png')}
            style={styles.kakaoLoginButton}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/images/google-login.png')}
            style={styles.googleLoginButton}
          />
        </TouchableOpacity>
        
        <View style={styles.skipContainer}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSignup}
          >
            <Text style={styles.skipText}>회원가입하기</Text>
            </TouchableOpacity>
          </View>
        
        {onSkip && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
          >
            <Text style={styles.skipText}>다음에 하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
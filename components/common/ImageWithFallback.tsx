import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageWithFallbackProps {
  src: string;
  alt?: string;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  fallbackText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export function ImageWithFallback({ src, alt, style }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  return (
    <View style={[styles.container, style]}>
      {didError ? (
        <View style={styles.fallbackContainer}>
          <Ionicons name="image" size={24} color="#9ca3af" />
          <Text style={styles.fallbackText}>이미지 로드 실패</Text>
        </View>
      ) : (
        <Image
          source={{ uri: src }}
          style={styles.image}
          onError={handleError}
          resizeMode="cover"
        />
      )}
    </View>
  );
}
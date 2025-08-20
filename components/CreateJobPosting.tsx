import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';

interface CreateJobPostingProps {
  onBack: () => void;
  onSuccess: () => void;
  onComplete: (jobId: string) => void;
  editJobId?: string | null;
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  spacer: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  progressDotActive: {
    backgroundColor: '#F7B32B',
  },
  stepContainer: {
    gap: 24,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  formSection: {
    gap: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  selectButtonSelected: {
    borderColor: '#F7B32B',
    backgroundColor: '#fef3c7',
  },
  selectButtonSelectedText: {
    color: '#374151',
  },
  rangeContainer: {
    gap: 16,
  },
  rangeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rangeInput: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  optionButtonSelected: {
    borderColor: '#F7B32B',
    backgroundColor: '#fef3c7',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  nextButtonContainer: {
    paddingTop: 24,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonFlex: {
    flex: 1,
  },
});

export default function CreateJobPosting({ onBack, onSuccess, onComplete, editJobId }: CreateJobPostingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    recruitCount: 2,
    depositMin: 500,
    depositMax: 2000,
    monthlyRentMin: 30,
    monthlyRentMax: 150,
    preferredGender: '',
    ageMin: 18,
    ageMax: 100,
    lifestyle: '',
    personality: '',
    smokingPreference: '',
    hasRoom: '',
    address: '',
    description: '',
  });

  const totalSteps = 4;
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    if (editJobId) {
      Alert.alert('성공', '구인글이 수정되었습니다.');
      onSuccess();
    } else {
      const jobId = 'job_' + Date.now();
      Alert.alert('성공', '구인글이 등록되었습니다.');
      onComplete(jobId);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title.length > 0 && formData.recruitCount > 0;
      case 2:
        return formData.preferredGender.length > 0;
      case 3:
        return formData.hasRoom.length > 0;
      case 4:
        return formData.hasRoom === 'none' || formData.address.length > 0;
      default:
        return true;
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>기본 정보</Text>
        <Text style={styles.stepSubtitle}>구인글의 기본 정보를 입력해주세요</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>제목</Text>
          <Input
            placeholder="ex) 강남역 근처 깔끔한 원룸 룸메이트 구해요"
            value={formData.title}
            onChangeText={(text) => setFormData({...formData, title: text})}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>인원</Text>
          <View style={styles.optionsContainer}>
            {[2, 3, 4, 5].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.optionButton,
                  formData.recruitCount === count && styles.optionButtonSelected
                ]}
                onPress={() => setFormData({...formData, recruitCount: count})}
              >
                <Text style={styles.optionText}>{count}명</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>보증금 범위 (만원)</Text>
          <View style={styles.rangeInputContainer}>
            <Input
              style={styles.rangeInput}
              placeholder="최소"
              value={formData.depositMin.toString()}
              onChangeText={(text) => setFormData({...formData, depositMin: parseInt(text) || 0})}
              keyboardType="numeric"
            />
            <Text style={styles.rangeLabel}>~</Text>
            <Input
              style={styles.rangeInput}
              placeholder="최대"
              value={formData.depositMax.toString()}
              onChangeText={(text) => setFormData({...formData, depositMax: parseInt(text) || 0})}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>월세 범위 (만원)</Text>
          <View style={styles.rangeInputContainer}>
            <Input
              style={styles.rangeInput}
              placeholder="최소"
              value={formData.monthlyRentMin.toString()}
              onChangeText={(text) => setFormData({...formData, monthlyRentMin: parseInt(text) || 0})}
              keyboardType="numeric"
            />
            <Text style={styles.rangeLabel}>~</Text>
            <Input
              style={styles.rangeInput}
              placeholder="최대"
              value={formData.monthlyRentMax.toString()}
              onChangeText={(text) => setFormData({...formData, monthlyRentMax: parseInt(text) || 0})}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>선호 조건</Text>
        <Text style={styles.stepSubtitle}>원하는 룸메이트 조건을 선택해주세요</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.optionsContainer}>
            {[
              { value: 'male', label: '남성' },
              { value: 'female', label: '여성' },
              { value: 'any', label: '상관없음' }
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  formData.preferredGender === option.value && styles.optionButtonSelected
                ]}
                onPress={() => setFormData({...formData, preferredGender: option.value})}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>라이프스타일</Text>
          <View style={styles.optionsContainer}>
            {[
              { value: 'morning', label: '아침형' },
              { value: 'evening', label: '저녁형' },
              { value: 'flexible', label: '유연함' }
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  formData.lifestyle === option.value && styles.optionButtonSelected
                ]}
                onPress={() => setFormData({...formData, lifestyle: option.value})}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>흡연</Text>
          <View style={styles.optionsContainer}>
            {[
              { value: 'no', label: '비흡연자만' },
              { value: 'yes', label: '흡연자도 괜찮음' },
              { value: 'any', label: '상관없음' }
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  formData.smokingPreference === option.value && styles.optionButtonSelected
                ]}
                onPress={() => setFormData({...formData, smokingPreference: option.value})}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>방 정보</Text>
        <Text style={styles.stepSubtitle}>현재 방 상황을 알려주세요</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>방 여부</Text>
          <View style={styles.optionsContainer}>
            {[
              { value: 'has', label: '방이 있어요', desc: '현재 방이 있고 룸메이트를 구해요', icon: 'home' },
              { value: 'none', label: '함께 방을 찾아요', desc: '룸메이트와 함께 방을 구해요', icon: 'search' }
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  formData.hasRoom === option.value && styles.optionButtonSelected
                ]}
                onPress={() => setFormData({...formData, hasRoom: option.value})}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Ionicons 
                    name={option.icon as any} 
                    size={20} 
                    color={formData.hasRoom === option.value ? '#F7B32B' : '#6b7280'} 
                  />
                  <Text style={styles.optionText}>{option.label}</Text>
                </View>
                <Text style={[styles.optionText, { fontSize: 12, color: '#6b7280', marginTop: 4 }]}>
                  {option.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>
          {formData.hasRoom === 'has' ? '방 상세 정보' : '추가 정보'}
        </Text>
        <Text style={styles.stepSubtitle}>
          {formData.hasRoom === 'has' 
            ? '방의 위치와 상세 정보를 입력해주세요'
            : '추가로 전달하고 싶은 내용을 작성해주세요'
          }
        </Text>
      </View>

      <View style={styles.formSection}>
        {formData.hasRoom === 'has' && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>주소</Text>
            <Input
              placeholder="ex) 서울시 강남구 역삼동"
              value={formData.address}
              onChangeText={(text) => setFormData({...formData, address: text})}
            />
          </View>
        )}

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>상세 설명 (선택)</Text>
          <Input
            placeholder="추가로 알려주고 싶은 내용을 자유롭게 작성해주세요"
            value={formData.description}
            onChangeText={(text) => setFormData({...formData, description: text})}
            multiline
            style={{ height: 100, textAlignVertical: 'top' }}
          />
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editJobId ? '구인글 수정' : '구인글 등록'}
          </Text>
          <View style={styles.spacer} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 진행 상황 */}
        <View style={styles.progressContainer}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i + 1 <= step && styles.progressDotActive
              ]}
            />
          ))}
        </View>

        {/* 현재 단계 */}
        {renderCurrentStep()}

        {/* 버튼 */}
        <View style={styles.nextButtonContainer}>
          <View style={styles.buttonRow}>
            {step > 1 && (
              <Button
                variant="outline"
                onPress={prevStep}
                style={styles.buttonFlex}
              >
                이전
              </Button>
            )}
            <Button
              onPress={nextStep}
              disabled={!isStepValid()}
              style={step > 1 ? styles.buttonFlex : undefined}
            >
              {step === totalSteps ? '완료' : '다음'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
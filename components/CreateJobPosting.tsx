import { Gender, MatchStatus, Lifestyle, Snoring, Smoking, Personality, Pets } from '@/types/enums';
import React, { useState } from 'react';

import AddressSearchModal from '../components/AddressSearchModal';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { api } from '../api/api';

const API_BASE_URL = 'http://localhost:8080';
const { width } = Dimensions.get('window');

/** 프론트 값 → 서버 enum 문자열 매핑 */
const toLifestyleEnum = (v: string) =>
  v === 'morning' ? 'MORNING' : v === 'evening' ? 'NIGHT' : 'NONE';
const toPersonalityEnum = (v: string) =>
  v === 'introvert' ? 'INTROVERT' : v === 'extrovert' ? 'EXTROVERT' : 'NONE';
const toSmokingEnum = (v: string) => {
  switch (v) {
    case 'impossible': return 'IMPOSSIBLE';
    case 'none': return 'NONE';
    default: return 'NONE';
  }
};
const toSnoringEnum = (v: string) => {
  switch (v) {
    case 'impossible': return 'IMPOSSIBLE';
    case 'none': return 'NONE';
    default: return 'NONE';
  }
};
const toPetsEnum = (v: string) => {
  switch (v) {
    case 'possible': return 'POSSIBLE';
    case 'impossible': return 'IMPOSSIBLE';
    default: return 'NONE';
  }
};

/** 서버에 보낼 Request 타입(백엔드 RecruitRequest와 1:1) */
type RecruitRequest = {
  title: string;
  recruitCount: number;
  rentCostMin: number;
  rentCostMax: number;
  monthlyCostMin: number;
  monthlyCostMax: number;
  minAge: number;
  maxAge: number;
  lifestyle: Lifestyle
  personality: Personality
  isSmoking: Smoking
  isSnoring: Snoring
  isPetsAllowed: Pets
  hasRoom: boolean;
  imgUrl: string[];
  address: string;
  detailDescription: string;
  additionalDescription: string;
};

interface CreateJobPostingProps {
  onBack: () => void;
  onSuccess: () => void;
  onComplete: (postId: string) => void; // 서버에서 생성된 postId를 문자열로 콜백
  editJobId?: string | null;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  spacer: { width: 24, height: 24 },
  content: { flex: 1, padding: 16 },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24, gap: 8 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e5e7eb' },
  progressDotActive: { backgroundColor: '#F7B32B' },
  stepContainer: { gap: 24 },
  stepHeader: { alignItems: 'center', marginBottom: 24 },
  stepTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  stepSubtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  formSection: { gap: 24 },
  fieldContainer: { gap: 1},
  addressContainer: {flexDirection: 'row', gap: 8, alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '500', color: '#374151' },
  optionsContainer: { gap: 12 },
  optionButton: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#ffffff',
  },
  optionButtonSelected: { borderColor: '#F7B32B', backgroundColor: '#fef3c7' },
  optionText: { fontSize: 16, color: '#374151', textAlign: 'center' },
  rangeInputContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rangeInput: { flex: 1 },
  rangeLabel: { fontSize: 14, color: '#6b7280' },
  nextButtonContainer: { paddingTop: 24, gap: 12 },
  buttonRow: { flexDirection: 'row', gap: 12 },
  buttonFlex: { flex: 1 },
  urlRow: { flexDirection: 'row', gap: 8 },
  urlItem: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 8, marginTop: 8,
  },
});

export default function CreateJobPosting({
  onBack, onSuccess, onComplete, editJobId,
}: CreateJobPostingProps) {
  const [step, setStep] = useState(1);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  /** 폼 상태(화면 → 서버 요청으로 변환할 로우 데이터) */
  const [formData, setFormData] = useState({
    // Step 1
    title: '',
    recruitCount: 2,
    depositMin: 500,     // → rentCostMin
    depositMax: 1000,    // → rentCostMax
    monthlyRentMin: 50,  // → monthlyCostMin
    monthlyRentMax: 100, // → monthlyCostMax

    // Step 2
    ageMin: 20,
    ageMax: 90,
    lifestyle: '',       // 'morning' | 'evening' | (기타 → 'NONE')
    personality: '',     // 'introvert' | 'extrovert' | 'none'
    smoking: '',         // 'no' | 'yes' | 'any'
    snoring: '',         // 'no' | 'yes' | 'any'
    pets: '',            // 'have' | 'nothave' | 'possible' | 'impossible' | 'any'

    // Step 3
    hasRoom: '',         // 'has' | 'none'

    // Step 4 (주소/좌표)
    address: '',
    latitude: '',        // 입력은 string, 제출시 number|null 로 변환
    longitude: '',
    // distance: '',

    // Step 5 (이미지)
    images: [] as string[],

    // 추가 설명
    detailDescription: '',
    additionalDescription: '',
  });

  // const handleFileSelect = async () => {
  //     try {
  //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       if (status !== 'granted') {
  //         Alert.alert('권한 필요', '사진 접근 권한을 허용해주세요.');
  //         return;
  //       }
  
  //       const result = await ImagePicker.launchImageLibraryAsync({
  //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //         base64: false,
  //         quality: 0.9,
  //         allowsEditing: false,
  //       });
  //       if (result.canceled) return;
  
  //       const asset = result.assets[0];
  //       const mime = asset.mimeType ?? 'image/jpeg';
  //       const name = asset.fileName ?? `id-${Date.now()}.jpg`;
  
  //       setFormData(prev => ({
  //         ...prev,
  //         idImageFile: asset.uri,
  //         idImagePreview: asset.uri,
  //       }));
  
  //       setUploadState({ isUploading: false, isProcessing: true, error: null }); // 로딩 표시
  //       await processOCR({ uri: asset.uri, name, type: mime });
  //     } catch (e: any) {
  //       Alert.alert('오류', e?.message ?? '이미지 선택 중 오류가 발생했습니다.');
  //     }
  //   };

  const totalSteps = 5;

  const nextStep = () => (step < totalSteps ? setStep(step + 1) : handleSubmit());
  const prevStep = () => setStep(step - 1);

  /** 단계별 유효성 검사 */
  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title.trim().length > 0 && formData.recruitCount > 0;
      case 2: {
        const ageOK =
          Number.isFinite(formData.ageMin) &&
          Number.isFinite(formData.ageMax) &&
          formData.ageMin <= formData.ageMax;
        return (
          ageOK &&
          !!formData.lifestyle &&
          !!formData.personality &&
          !!formData.smoking &&
          !!formData.snoring &&
          !!formData.pets
        );
      }
      case 3:
        return !!formData.hasRoom;
      case 4:
        // 방이 있으면 주소 필수, 좌표/거리 선택
        return /*formData.hasRoom === 'none'*/ formData.address.trim().length > 0;
      case 5:
      default:
        return true;
    }
  };

  /** 제출 → /recruits (POST) */
  const handleSubmit = async () => {
    try {
      const body: RecruitRequest = {
        title: formData.title,
        recruitCount: Number(formData.recruitCount),
        rentCostMin: Number(formData.depositMin),
        rentCostMax: Number(formData.depositMax),
        monthlyCostMin: Number(formData.monthlyRentMin),
        monthlyCostMax: Number(formData.monthlyRentMax),
        minAge: Number(formData.ageMin),
        maxAge: Number(formData.ageMax),

        lifestyle: toLifestyleEnum(formData.lifestyle) as RecruitRequest['lifestyle'],
        personality: toPersonalityEnum(formData.personality) as RecruitRequest['personality'],
        isSmoking: toSmokingEnum(formData.smoking) as RecruitRequest['isSmoking'],
        isSnoring: toSnoringEnum(formData.snoring) as RecruitRequest['isSnoring'],
        isPetsAllowed: toPetsEnum(formData.pets) as RecruitRequest['isPetsAllowed'],

        hasRoom: formData.hasRoom === 'has',

        imgUrl: formData?.images,

        address: formData.address,
        detailDescription: formData.detailDescription,
        additionalDescription: formData.additionalDescription,
      };

      const res = await api.post('/recruits', body);

      const data = res.data?.data ?? res.data;
      const postId = data?.postId ?? data?.id;

      Alert.alert('성공', '구인글이 등록되었습니다.');
      onComplete(String(postId ?? `post_${Date.now()}`));
      
    } catch (e: any) {
      Alert.alert('실패', e?.message ?? '등록 중 오류가 발생했습니다.');
    }
  };

  /** ─── Step 1: 기본 정보 ─── */
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
            onChangeText={(t) => setFormData({ ...formData, title: t })}
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
                  formData.recruitCount === count && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, recruitCount: count })}
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
              value={String(formData.depositMin)}
              onChangeText={(t) => setFormData({ ...formData, depositMin: parseInt(t) || 0 })}
              keyboardType="numeric"
            />
            <Text style={styles.rangeLabel}>~</Text>
            <Input
              style={styles.rangeInput}
              placeholder="최대"
              value={String(formData.depositMax)}
              onChangeText={(t) => setFormData({ ...formData, depositMax: parseInt(t) || 0 })}
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
              value={String(formData.monthlyRentMin)}
              onChangeText={(t) => setFormData({ ...formData, monthlyRentMin: parseInt(t) || 0 })}
              keyboardType="numeric"
            />
            <Text style={styles.rangeLabel}>~</Text>
            <Input
              style={styles.rangeInput}
              placeholder="최대"
              value={String(formData.monthlyRentMax)}
              onChangeText={(t) => setFormData({ ...formData, monthlyRentMax: parseInt(t) || 0 })}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
    </View>
  );

  /** ─── Step 2: 선호/제약 ─── */
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>선호/제약 조건</Text>
        <Text style={styles.stepSubtitle}>원하는 룸메이트 조건을 선택해주세요</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>나이 범위</Text>
          <View style={styles.rangeInputContainer}>
            <Input
              style={styles.rangeInput}
              placeholder="최소"
              value={String(formData.ageMin)}
              onChangeText={(t) => setFormData({ ...formData, ageMin: parseInt(t) || 0 })}
              keyboardType="numeric"
            />
            <Text style={styles.rangeLabel}>~</Text>
            <Input
              style={styles.rangeInput}
              placeholder="최대"
              value={String(formData.ageMax)}
              onChangeText={(t) => setFormData({ ...formData, ageMax: parseInt(t) || 0 })}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>라이프스타일</Text>
          <View style={styles.optionsContainer}>
            {[
              { value: 'morning', label: '아침형' },
              { value: 'evening', label: '저녁형' },
              { value: 'flexible', label: '유연함' },
            ].map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.optionButton,
                  formData.lifestyle === o.value && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, lifestyle: o.value })}
              >
                <Text style={styles.optionText}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>성향</Text>
          <View style={styles.optionsContainer}>
            {[
              { value: 'introvert', label: '내향적' },
              { value: 'extrovert', label: '외향적' },
              { value: 'none', label: '상관없음' },
            ].map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.optionButton,
                  formData.personality === o.value && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, personality: o.value })}
              >
                <Text style={styles.optionText}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>흡연</Text>
          <View style={styles.optionsContainer}>
            {[
              { value: 'impossible', label: '흡연불가' },
              { value: 'none', label: '상관없음' },
            ].map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.optionButton,
                  formData.smoking === o.value && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, smoking: o.value })}
              >
                <Text style={styles.optionText}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>코골이</Text>
          <View style={styles.optionsContainer}>
            {[
              { value: 'impossible', label: '코골이 불가' },
              { value: 'none', label: '상관없음' },
            ].map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.optionButton,
                  formData.snoring === o.value && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, snoring: o.value })}
              >
                <Text style={styles.optionText}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>반려동물</Text>
          <View style={styles.optionsContainer}>
            {[
              { value: 'possible', label: '가능' },
              { value: 'impossible', label: '불가능' },
              { value: 'none', label: '상관없음' },
            ].map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.optionButton,
                  formData.pets === o.value && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, pets: o.value })}
              >
                <Text style={styles.optionText}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  /** ─── Step 3: 방 보유 여부 ─── */
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
              { value: 'none', label: '함께 방을 찾아요', desc: '룸메이트와 함께 방을 구해요', icon: 'search' },
            ].map((o) => (
              <TouchableOpacity
                key={o.value}
                style={[
                  styles.optionButton,
                  formData.hasRoom === o.value && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, hasRoom: o.value })}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Ionicons name={o.icon as any} size={20} color={formData.hasRoom === o.value ? '#F7B32B' : '#6b7280'} />
                  <Text style={styles.optionText}>{o.label}</Text>
                </View>
                <Text style={[styles.optionText, { fontSize: 12, color: '#6b7280', marginTop: 4 }]}>{o.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  /** ─── Step 4: 주소/좌표 + 이미지 추가 ─── */
  // const renderStep4 = () => (
  //   <View style={styles.stepContainer}>
  //     <Text style={styles.stepTitle}>상세 설명</Text>
  //       <Text style={styles.stepSubtitle}></Text>
  //     <View style={styles.formSection}>
  //       {formData.hasRoom === 'has' && (
  //         <>
  //           <View style={styles.fieldContainer}>
  //             <Text style={styles.label}>주소</Text>
  //             <Input
  //               placeholder="방 주소를 입력해주세요."
  //               value={formData.address}
  //               onChangeText={(t) => {setSelectedAddress}}
  //               //onChangeText={(t) => setFormData({ ...formData, address: t })}
  //             />
  //             <TouchableOpacity onPress={() => setOpen(true)}>
  //               <Text>검색</Text>
  //             </TouchableOpacity>
  //           </View>
  //         </>
  //       )} : {<View style={styles.fieldContainer}>
  //             <Text style={styles.label}>주소 정보</Text>
  //             <Input
  //               placeholder="ex) 서울시 강남구 역삼동"
  //               value={formData.address}
  //               onChangeText={(t) => setFormData({ ...formData, address: t })}
  //             />
  //           </View>}


  //           <View style={styles.formSection}>
  //       <View style={styles.fieldContainer}>
  //         <Text style={styles.label}>이미지 URL 추가</Text>
  //         <View style={styles.urlRow}>
  //           <Input
  //             placeholder="https://example.com/image.jpg"
  //             value={newImageUrl}
  //             onChangeText={setNewImageUrl}
  //             style={{ flex: 1 }}
  //             autoCapitalize="none"
  //           />
  //           <Button
  //             onPress={() => {
  //               const url = newImageUrl.trim();
  //               if (!url) return;
  //               setFormData({ ...formData, images: [...formData.images, url] });
  //               setNewImageUrl('');
  //             }}
  //           >
  //             추가
  //           </Button>
  //         </View>

  //         {formData.images.map((url, idx) => (
  //           <View key={`${url}-${idx}`} style={styles.urlItem}>
  //             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
  //               <Text style={{ flex: 1, marginRight: 8 }} numberOfLines={1}>{url}</Text>
  //               <Button
  //                 variant="outline"
  //                 size="sm"
  //                 onPress={() =>
  //                   setFormData({
  //                     ...formData,
  //                     images: formData.images.filter((_, i) => i !== idx),
  //                   })
  //                 }
  //               >
  //                 삭제
  //               </Button>
  //             </View>
  //           </View>
  //         ))}
  //       </View>
  //     </View>
  //     </View>

  //     <AddressSearchModal
  //       visible={open}
  //       onClose={() => setOpen(false)}
  //       onSelect={(addr) => {
  //         setOpen(false);
  //         setSelectedAddress(addr.fullAddress); // 여기서 네가 원하는 필드 골라서 저장하면 됨
  //         // addr.postalCode / addr.roadAddress / addr.jibunAddress / addr.sido / ...
  //       }}
  //     />
  //   </View>
  // );
  /** ─── Step 4: 주소/좌표 + 이미지 추가 ─── */
const renderStep4 = () => (
  <View style={styles.stepContainer}>
    <View style={styles.stepHeader}>
      <Text style={styles.stepTitle}>상세 설명</Text>
      <Text style={styles.stepSubtitle}>
        {formData.hasRoom === 'has' ? '방 주소를 검색해 주세요' : '희망 지역을 입력해 주세요'}
      </Text>
    </View>

    <View style={styles.addressContainer}>
      {formData.hasRoom === 'has' ? (
        // ✅ 방이 있는 경우: 주소 검색 버튼 + 입력
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>주소</Text>
          <Input
            placeholder="방 주소를 입력하거나 검색 버튼으로 선택"
            value={formData.address}
            onChangeText={(t) => setFormData({ ...formData, address: t })} // ✅ 실제로 상태 업데이트
          />
          <TouchableOpacity onPress={() => setOpen(true)} style={{ marginTop: 8 }}>
            <Text style={ {backgroundColor: '#111827', borderRadius: 8, height: 44, paddingHorizontal: 16, justifyContent: 'center'} }>검색</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // ✅ 함께 방을 찾는 경우: 자유 입력
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>주소</Text>
          <Input
            placeholder="방 주소를 입력하거나 검색 버튼으로 선택"
            value={formData.address}
            onChangeText={(t) => setFormData({ ...formData, address: t })} // ✅ 실제로 상태 업데이트
          />
          <TouchableOpacity onPress={() => setOpen(true)} style={{ marginTop: 8 }}>
            <Text style={ {backgroundColor: '#111827', borderRadius: 8, height: 44, paddingHorizontal: 16, justifyContent: 'center'} }>검색</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 이하 이미지 URL 추가 섹션은 기존 코드 유지 */}
      <View style={styles.formSection}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>이미지 URL 추가</Text>
          <View style={styles.urlRow}>
            <Input
              placeholder="https://example.com/image.jpg"
              value={newImageUrl}
              onChangeText={setNewImageUrl}
              //onPress={pickImage}
              style={{ flex: 1 }}
              autoCapitalize="none"
            />
            <Button
              onPress={() => {
                const url = newImageUrl.trim();
                if (!url) return;
                setFormData({ ...formData, images: [...formData.images, url] });
                setNewImageUrl('');
              }}
            >
              추가
            </Button>
          </View>

          {formData.images.map((url, idx) => (
            <View key={`${url}-${idx}`} style={styles.urlItem}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ flex: 1, marginRight: 8 }} numberOfLines={1}>{url}</Text>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() =>
                    setFormData({
                      ...formData,
                      images: formData.images.filter((_, i) => i !== idx),
                    })
                  }
                >
                  삭제
                </Button>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>

    {/* ✅ 주소 선택 모달 - 선택 시 formData.address도 업데이트 */}
    <AddressSearchModal
      visible={open}
      onClose={() => setOpen(false)}
      onSelect={(addr) => {
        // 선택된 주소를 입력창에 바로 반영
        setFormData((prev) => ({ ...prev, address: addr.fullAddress }));
        // AddressSearchModal 쪽 handleMessage에서 onClose를 이미 부르지만,
        // 혹시 몰라서 중복 닫기 방지하려면 여기서는 안 불러도 됩니다.
      }}
    />
  </View>
);


  /** ─── Step 5: 상세정보/ 추가정보 입력 ─── */
  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>상세 설명</Text>
        <Text style={styles.stepSubtitle}>구인글에 대한 상세 정보를 입력해주세요 (선택)</Text>
      </View>

      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{formData.hasRoom === 'has' ? '방 상세 정보' : '추가 정보'}</Text>
        <Text style={styles.stepSubtitle}>
          {formData.hasRoom === 'has' ? '방의 위치와 상세 정보를 입력해주세요' : '추가로 전달하고 싶은 내용을 작성해주세요'}
        </Text>
      </View>

      <View style={styles.fieldContainer}>
          <Text style={styles.label}>상세 설명 (detailDescription)</Text>
          <Input
            placeholder="추가로 알려주고 싶은 내용을 자유롭게 작성해주세요"
            value={formData.detailDescription}
            onChangeText={(t) => setFormData({ ...formData, detailDescription: t })}
            multiline
            style={{ height: 100, textAlignVertical: 'top' }}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>추가 설명 (additionalDescription)</Text>
          <Input
            placeholder="선택 입력"
            value={formData.additionalDescription}
            onChangeText={(t) => setFormData({ ...formData, additionalDescription: t })}
            multiline
            style={{ height: 80, textAlignVertical: 'top' }}
          />
        </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
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
          <Text style={styles.headerTitle}>{editJobId ? '구인글 수정' : '구인글 등록'}</Text>
          <View style={styles.spacer} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 진행 상황(5단계) */}
        <View style={styles.progressContainer}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <View key={i} style={[styles.progressDot, i + 1 <= step && styles.progressDotActive]} />
          ))}
        </View>

        {/* 현재 단계 */}
        {renderCurrentStep()}

        {/* 버튼 */}
        <View style={styles.nextButtonContainer}>
          <View style={styles.buttonRow}>
            {step > 1 && (
              <Button variant="outline" onPress={prevStep} style={styles.buttonFlex}>
                이전
              </Button>
            )}
            <Button onPress={nextStep} disabled={!isStepValid()} style={step > 1 ? styles.buttonFlex : undefined}>
              {step === totalSteps ? '완료' : '다음'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
import React from 'react';
import { Modal, View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import Postcode from '@actbase/react-daum-postcode';

export type AddressResult = {
  postalCode: string;     // 우편번호 (zonecode)
  roadAddress: string;    // 도로명주소
  jibunAddress: string;   // 지번주소
  sido: string;           // 시/도
  sigungu: string;        // 시/군/구
  bname: string;          // 법정동
  buildingName: string;   // 건물명
  fullAddress: string;    // 최종 표기용(도로명 주소 + 건물명)
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (addr: AddressResult) => void;
  startingQuery?: string; // "서울시 청파로"처럼 미리 검색어 넣고 시작하고 싶을 때
}

export default function AddressSearchModal({ visible, onClose, onSelect }: Props) {
  const handleComplete = (data: any) => {
    console.log('🎯 주소 선택 완료!', data);
    
    const result: AddressResult = {
      postalCode: data.zonecode || '',
      roadAddress: data.roadAddress || '',
      jibunAddress: data.jibunAddress || '',
      sido: data.sido || '',
      sigungu: data.sigungu || '',
      bname: data.bname || '',
      buildingName: data.buildingName || '',
      fullAddress: (data.roadAddress || data.jibunAddress) + (data.buildingName ? ' (' + data.buildingName + ')' : '')
    };
    
    onSelect(result);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>주소 검색</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={{ fontWeight: '600' }}>닫기</Text>
          </TouchableOpacity>
        </View>
        <Postcode
          style={{ flex: 1 }}
          jsOptions={{ animation: false, hideMapBtn: true }}
          onSelected={handleComplete}
          onError={(error) => {
            console.log('❌ 주소 검색 에러:', error);
          }}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 16, fontWeight: '700' , marginLeft : "40%"},
  closeBtn: { padding: 8 },
});
// utils/location.ts
import * as Location from 'expo-location';

export type LatLng = { latitude: number; longitude: number };

export class LocationError extends Error {
  code:
    | 'SERVICES_OFF'
    | 'PERMISSION_DENIED'
    | 'TIMEOUT'
    | 'UNKNOWN';
  constructor(code: LocationError['code'], message?: string) {
    super(message ?? code);
    this.name = 'LocationError';
    this.code = code;
  }
}

/**
 * 최초 1회 현재 위치(위도/경도) 가져오기
 * - 마지막 기록 위치가 있으면 먼저 반환(빠른 응답), 없으면 실제 측위
 * - 권한/서비스 체크 포함
 */
export async function getCurrentLatLngOnce(options?: {
  /** 마지막 기록 위치가 있으면 우선 사용 (기본값 true) */
  preferLastKnown?: boolean;
  /** 실제 측위 타임아웃(ms) (기본값 12초) */
  timeoutMs?: number;
  /** 정확도 (기본 Balanced) */
  accuracy?: Location.LocationAccuracy;
}): Promise<LatLng> {
  const preferLastKnown = options?.preferLastKnown ?? true;
  const timeoutMs = options?.timeoutMs ?? 12_000;
  const accuracy = options?.accuracy ?? Location.Accuracy.Balanced;

  // 1) 위치 서비스 켜짐 여부
  const servicesOn = await Location.hasServicesEnabledAsync();
  if (!servicesOn) {
    throw new LocationError('SERVICES_OFF', '기기 위치 서비스가 꺼져 있습니다.');
  }

  // 2) 권한 요청
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new LocationError('PERMISSION_DENIED', '위치 권한이 거부되었습니다.');
  }

  // 3) 빠른 응답: 마지막 기록 위치가 있으면 우선 사용
  if (preferLastKnown) {
    const last = await Location.getLastKnownPositionAsync();
    if (last?.coords) {
      return {
        latitude: last.coords.latitude,
        longitude: last.coords.longitude,
      };
    }
  }

  // 4) 실제 측위(1회)
  try {
    const pos = await Location.getCurrentPositionAsync({
      accuracy
     //timeout: timeoutMs, // 일부 기기에서 무시될 수 있지만 지정
    });

    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  } catch (e: any) {
    // expo-location은 플랫폼/기기별로 에러가 제각각이라 넓게 케치
    const msg = typeof e?.message === 'string' ? e.message : '측위 실패';
    // timeout 추정 키워드
    if (/time/i.test(msg)) {
      throw new LocationError('TIMEOUT', msg);
    }
    throw new LocationError('UNKNOWN', msg);
  }
}

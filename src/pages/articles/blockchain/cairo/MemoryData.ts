export const MEMORY_CODE = `// S-two Cairo 메모리 시스템
// 이중 저장 시스템: 작은 값(u128) + 큰 값([u32; 8])

pub struct Memory {
  pub config: MemoryConfig,
  pub address_to_id: Vec<EncodedMemoryValueId>, // 주소 → ID 매핑
  pub f252_values: Vec<[u32; 8]>,  // 큰 값들 (252비트)
  pub small_values: Vec<u128>,     // 작은 값들 (128비트 이하)
}

pub enum MemoryValue {
  Small(u128),        // 작은 값: 72비트 이하
  F252([u32; 8]),     // 큰 값: 252비트 필드 원소
}

// 임계값: small_max = (1 << 72) - 1
impl Default for MemoryConfig {
  fn default() -> Self {
    MemoryConfig {
      small_max: (1 << 72) - 1,        // 작은 값 최대 크기
      log_small_value_capacity: 24,    // 작은 값 용량 (2^24)
    }
  }
}`;

export const MEMORY_ANNOTATIONS = [
  { lines: [4, 8] as [number, number], color: 'sky' as const, note: 'Memory: 주소-ID 매핑 + 이중 값 저장소' },
  { lines: [11, 13] as [number, number], color: 'emerald' as const, note: 'MemoryValue: Small(u128) | F252([u32;8])' },
  { lines: [17, 22] as [number, number], color: 'amber' as const, note: '72비트 임계값으로 공간 효율 최적화' },
];

export const BUILTIN_CODE = `// Cairo 빌트인 시스템 (암호학적 특수 함수)
pub struct BuiltinSegments {
  pub add_mod: Option<MemorySegmentAddresses>,    // 모듈러 덧셈: 7셀
  pub bitwise: Option<MemorySegmentAddresses>,    // 비트 연산: 5셀
  pub ec_op: Option<MemorySegmentAddresses>,      // 타원곡선 연산: 7셀
  pub pedersen: Option<MemorySegmentAddresses>,   // Pedersen 해시: 3셀
  pub poseidon: Option<MemorySegmentAddresses>,   // Poseidon 해시: 6셀
  pub range_check_96: Option<MemorySegmentAddresses>, // 96비트 범위 검사
  pub range_check_128: Option<MemorySegmentAddresses>, // 128비트 범위 검사
}

// 빌트인 세그먼트 패딩: SIMD 요구사항 충족
// MIN_SEGMENT_SIZE = N_LANES (SIMD 레인 수)
// 크기를 다음 2의 거듭제곱으로 확장 → FFT 효율성`;

export const BUILTIN_ANNOTATIONS = [
  { lines: [2, 9] as [number, number], color: 'sky' as const, note: '9종 빌트인: 각각 전용 메모리 세그먼트' },
  { lines: [12, 14] as [number, number], color: 'emerald' as const, note: '2의 거듭제곱 패딩: SIMD + FFT 최적화' },
];

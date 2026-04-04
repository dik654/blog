export const FRI_CODE = `// Linear Codes (Ligero/Brakedown) — 해시 기반 PCS
// 양자 컴퓨터에 대한 강한 저항성 + 투명 설정

// 수학적 기반:
// - Error-Correcting Codes: 오류 정정 부호를 이용한 커밋먼트
// - Reed-Solomon Codes: 다항식 평가를 이용한 인코딩
// - Merkle Tree: 커밋먼트의 무결성 보장

// Linear Codes PCS 구현
pub struct LinearCodePCS<C: LinearCode, H: CRHScheme> {
  _phantom: PhantomData<(C, H)>,
}

// 커밋: 다항식 계수 → RS 인코딩 → Merkle Root
// 1. 다항식 계수를 행렬로 배치
// 2. 각 행을 Reed-Solomon 인코딩
// 3. 열 단위로 Merkle 해시
// 4. Merkle Root = Commitment

// 보안 가정:
// - Hash Function Security: 충돌 저항성과 일방향성
// - No Algebraic Structure: 대수적 구조에 의존하지 않음`;

export const FRI_ANNOTATIONS = [
  { lines: [5, 7] as [number, number], color: 'sky' as const, note: '3가지 수학 기반: ECC + Reed-Solomon + Merkle' },
  { lines: [10, 11] as [number, number], color: 'emerald' as const, note: 'LinearCodePCS: 제네릭 구조 (코드+해시)' },
  { lines: [14, 18] as [number, number], color: 'amber' as const, note: '커밋 과정: 계수→RS인코딩→Merkle Root' },
];

export const COMPARE_CODE = `// 다항식 커밋먼트 스킴 비교 분석
//
// | 스킴         | 설정      | 증명 크기   | 검증 시간   | 보안 가정        |
// |-------------|----------|-----------|-----------|----------------|
// | KZG10       | Trusted  | O(1)      | O(1) pair | q-SDH + KoE    |
// | Marlin PC   | Trusted  | O(1)      | O(1) pair | q-SDH + KoE    |
// | Sonic PC    | Trusted  | O(1)      | O(1) pair | q-SDH + KoE    |
// | IPA PC      | 투명      | O(log n)  | O(n)      | DLog           |
// | Hyrax       | 투명      | O(√n)    | O(n)      | DLog           |
// | Linear Codes| 투명      | O(√n)    | O(n)      | Hash + ECC     |

// 선택 기준:
// - 증명 크기 우선 → KZG10 / Marlin (O(1))
// - 설정 투명성 우선 → IPA / Linear Codes
// - 양자 안전 → Linear Codes (해시 기반)
// - 다변수 다항식 → Hyrax
// - 배치 효율성 → Marlin (네이티브 배치 지원)`;

export const COMPARE_ANNOTATIONS = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: '페어링 기반: O(1) 증명, trusted setup 필요' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '비페어링: 투명 설정, 더 큰 증명/검증' },
  { lines: [12, 16] as [number, number], color: 'amber' as const, note: '유스케이스별 최적 스킴 선택 가이드' },
];

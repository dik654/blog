export interface Crate {
  name: string;
  desc: string;
  color: string;
}

export const LAYERS: { label: string; crates: Crate[] }[] = [
  {
    label: '사용자 코드 / zkVM',
    crates: [
      { name: 'uni-stark', desc: 'STARK 증명기 진입점. prove_with_preprocessed() 제공.', color: '#a855f7' },
      { name: 'batch-stark', desc: '여러 AIR를 한 번에 증명하는 배치 증명기.', color: '#a855f7' },
    ],
  },
  {
    label: 'AIR & 제약 시스템',
    crates: [
      { name: 'air', desc: 'Air, AirBuilder, WindowAccess 트레이트. current/next 행 접근.', color: '#6366f1' },
      { name: 'keccak-air', desc: 'Keccak-256 AIR 구현 예시.', color: '#6366f1' },
      { name: 'poseidon2-air', desc: 'Poseidon2 순열 AIR 구현. Merkle 해시 회로.', color: '#6366f1' },
      { name: 'blake3-air', desc: 'Blake3 해시 AIR 구현.', color: '#6366f1' },
    ],
  },
  {
    label: 'PCS & FRI',
    crates: [
      { name: 'fri', desc: 'FRI 증명 생성 + TwoAdicFriPcs. 다중 개구 통합.', color: '#0ea5e9' },
      { name: 'merkle-tree', desc: 'N진 Merkle 트리. FRI 쿼리 Merkle 경로 증명.', color: '#0ea5e9' },
      { name: 'commit', desc: 'Pcs, Mmcs 트레이트 정의.', color: '#0ea5e9' },
    ],
  },
  {
    label: '해시 & 변환',
    crates: [
      { name: 'poseidon2', desc: 'Poseidon2 퍼뮤테이션. Merkle 압축 + Challenger.', color: '#10b981' },
      { name: 'dft', desc: 'Radix-2 DFT. NTT로 다항식 평가/보간.', color: '#10b981' },
      { name: 'challenger', desc: 'DuplexChallenger — Fiat-Shamir 도전값 생성.', color: '#10b981' },
    ],
  },
  {
    label: '유한체 (Field)',
    crates: [
      { name: 'baby-bear', desc: 'BabyBear (2³¹−2²⁷+1). 27-adicity. SP1 기본 필드.', color: '#f59e0b' },
      { name: 'koala-bear', desc: 'KoalaBear (2³¹−2²⁴+1). 최근 추가.', color: '#f59e0b' },
      { name: 'goldilocks', desc: 'Goldilocks (2⁶⁴−2³²+1). 64비트 친화적.', color: '#f59e0b' },
      { name: 'mersenne-31', desc: 'Mersenne-31 (2³¹−1). Circle group FFT 지원. 특수 최적화.', color: '#f59e0b' },
      { name: 'monty-31', desc: 'Montgomery 곱셈 공통 구현 (BabyBear/KoalaBear 공유).', color: '#f59e0b' },
      { name: 'field', desc: 'Field, TwoAdicField, ExtensionField 트레이트.', color: '#f59e0b' },
    ],
  },
];

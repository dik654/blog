export const friAnnotations = [
  { lines: [13, 17] as [number, number], color: 'sky' as const, note: '커밋 단계 — 절반씩 접기' },
  { lines: [24, 26] as [number, number], color: 'emerald' as const, note: 'PoW 그라인딩 — 보안 강화' },
  { lines: [28, 39] as [number, number], color: 'amber' as const, note: '쿼리 단계 — 머클 열기 증명' },
];

export const pcsAnnotations = [
  { lines: [6, 10] as [number, number], color: 'sky' as const, note: 'PCS 구조체 — DFT + 머클 + FRI' },
  { lines: [13, 16] as [number, number], color: 'emerald' as const, note: '개구 핵심 — 몫 다항식 저차 증명' },
  { lines: [18, 21] as [number, number], color: 'amber' as const, note: 'coset 처리 — subgroup 통일 변환' },
  { lines: [23, 31] as [number, number], color: 'violet' as const, note: 'Pcs 트레이트 구현 — commit/open/verify' },
];

export const merkleAnnotations = [
  { lines: [5, 11] as [number, number], color: 'sky' as const, note: 'MerkleTree — 잎 + 다이제스트 레이어' },
  { lines: [13, 17] as [number, number], color: 'emerald' as const, note: 'MerkleTreeMmcs — 해시 + 압축 함수' },
  { lines: [19, 23] as [number, number], color: 'amber' as const, note: '다양한 크기 다항식 효율적 커밋' },
];

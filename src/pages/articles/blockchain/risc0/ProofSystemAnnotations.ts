export const recursionAnnotations = [
  { lines: [4, 8] as [number, number], color: 'sky' as const, note: '1단계: 세그먼트별 STARK 병렬 생성' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: '2단계: 재귀 압축 → SuccinctReceipt' },
  { lines: [15, 18] as [number, number], color: 'amber' as const, note: '3단계: STARK → Groth16 SNARK' },
];

export const starkAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'Arithmetization — 다항식 인코딩' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'FRI 커밋 — 투명 셋업' },
  { lines: [11, 12] as [number, number], color: 'amber' as const, note: '쿼리 — Fiat-Shamir 비대화형' },
  { lines: [14, 19] as [number, number], color: 'violet' as const, note: '증명 크기 + 검증 시간 비교' },
];

export const bonsaiAnnotations = [
  { lines: [1, 7] as [number, number], color: 'sky' as const, note: 'Bonsai 설정 — 환경 변수' },
  { lines: [9, 15] as [number, number], color: 'emerald' as const, note: '클라우드 vs 로컬 증명 분기' },
];

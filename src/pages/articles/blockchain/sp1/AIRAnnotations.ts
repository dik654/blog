export const addAnnotations = [
  { lines: [2, 9] as [number, number], color: 'sky' as const, note: 'AddSubCols — AIR 열 구조체' },
  { lines: [12, 19] as [number, number], color: 'emerald' as const, note: 'Air::eval — 덧셈 제약 평가' },
  { lines: [21, 21] as [number, number], color: 'amber' as const, note: 'is_add + is_sub = 1 제약' },
];

export const starkAnnotations = [
  { lines: [1, 2] as [number, number], color: 'sky' as const, note: '1단계: 실행 트레이스 생성' },
  { lines: [4, 6] as [number, number], color: 'emerald' as const, note: '2단계: Reed-Solomon → 머클 커밋' },
  { lines: [8, 11] as [number, number], color: 'amber' as const, note: '3단계: FRI 증명' },
  { lines: [13, 16] as [number, number], color: 'violet' as const, note: '4단계: 세그먼트 분할 + 병렬 증명' },
];

export const plonky3Annotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: 'Air 트레이트 — 제약 추가' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: 'SP1 설정: BabyBear + FRI' },
];

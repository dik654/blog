export const windowAnnotations = [
  { lines: [3, 13] as [number, number], color: 'sky' as const, note: 'WindowAccess — 현재/다음 행 접근' },
  { lines: [16, 22] as [number, number], color: 'emerald' as const, note: 'RowWindow — 경량 2행 슬라이스' },
  { lines: [30, 36] as [number, number], color: 'amber' as const, note: 'Air 트레이트 — 제약 정의 진입점' },
];

export const keccakAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'BaseAir — 열 개수 정의' },
  { lines: [10, 14] as [number, number], color: 'emerald' as const, note: '트레이스 행 접근 (local/next)' },
  { lines: [18, 24] as [number, number], color: 'amber' as const, note: '첫 행: 입력 일치 제약' },
  { lines: [27, 34] as [number, number], color: 'violet' as const, note: '전이 행: preimage 연속성' },
];

export const quotientAnnotations = [
  { lines: [12, 17] as [number, number], color: 'sky' as const, note: '트레이스 커밋 → 머클 트리' },
  { lines: [19, 20] as [number, number], color: 'emerald' as const, note: '도전값 샘플링 (확장체)' },
  { lines: [22, 27] as [number, number], color: 'amber' as const, note: '몫 다항식 Q(x) 계산' },
  { lines: [34, 38] as [number, number], color: 'violet' as const, note: 'zeta 지점 개구 + FRI 증명' },
];

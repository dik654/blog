export const vkAnnotations = [
  { lines: [8, 11] as [number, number], color: 'sky' as const, note: '도메인 생성 — 회로 크기 결정' },
  { lines: [13, 21] as [number, number], color: 'emerald' as const, note: '회로 합성 — 고정 열 + 퍼뮤테이션' },
  { lines: [23, 25] as [number, number], color: 'amber' as const, note: '선택자 압축 → 고정 열 수 감소' },
  { lines: [27, 30] as [number, number], color: 'violet' as const, note: '고정 열 KZG 커밋' },
];

export const pkAnnotations = [
  { lines: [6, 10] as [number, number], color: 'sky' as const, note: 'l0(X) — row 0 경계 조건' },
  { lines: [12, 16] as [number, number], color: 'emerald' as const, note: 'l_blind(X) — 블라인딩 행' },
  { lines: [19, 22] as [number, number], color: 'amber' as const, note: 'l_last(X) — 그랜드 프로덕트 종료 검사' },
];

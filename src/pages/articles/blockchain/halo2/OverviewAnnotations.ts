export const crateAnnotations = [
  { lines: [2, 9] as [number, number], color: 'sky' as const, note: 'plonk/ — 회로 정의 + 증명 생성' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: 'poly/ — KZG 커밋 + 다항식 도메인' },
  { lines: [14, 14] as [number, number], color: 'amber' as const, note: 'Fiat-Shamir 트랜스크립트' },
];

export const circuitAnnotations = [
  { lines: [3, 10] as [number, number], color: 'sky' as const, note: 'Circuit 트레이트 — 회로 정의 인터페이스' },
  { lines: [13, 23] as [number, number], color: 'emerald' as const, note: 'Expression — 게이트 다항식 표현' },
  { lines: [26, 29] as [number, number], color: 'amber' as const, note: '게이트/복사 제약 등록 방법' },
];

export const columnAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: '열 3종류: Advice / Fixed / Instance' },
  { lines: [8, 14] as [number, number], color: 'emerald' as const, note: 'Region으로 셀 할당 + 복사 제약' },
  { lines: [16, 18] as [number, number], color: 'amber' as const, note: '선택자 → 고정 열 압축 최적화' },
];

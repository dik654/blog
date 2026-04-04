export const crateAnnotations = [
  { lines: [3, 12] as [number, number], color: 'sky' as const, note: '서브회로 — EVM/바이트코드/MPT/복사/서명' },
  { lines: [14, 19] as [number, number], color: 'emerald' as const, note: '공유 테이블 — 서브회로 간 일관성' },
];

export const evmConfigAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: '고정 테이블 — 오퍼코드 + 바이트' },
  { lines: [7, 17] as [number, number], color: 'emerald' as const, note: '서브회로 테이블 참조' },
  { lines: [20, 22] as [number, number], color: 'amber' as const, note: 'configure — 가젯 초기화 + 룩업' },
];

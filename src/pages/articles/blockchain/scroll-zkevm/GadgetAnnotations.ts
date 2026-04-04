export const gadgetTraitAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '가젯 이름 + 실행 상태' },
  { lines: [7, 8] as [number, number], color: 'emerald' as const, note: 'configure — 제약 정의 (keygen)' },
  { lines: [10, 19] as [number, number], color: 'amber' as const, note: 'assign_exec_step — 셀 할당 (prove)' },
];

export const addSubAnnotations = [
  { lines: [3, 7] as [number, number], color: 'sky' as const, note: 'AddSubGadget 필드 — 연산 + 선택자' },
  { lines: [12, 15] as [number, number], color: 'emerald' as const, note: '워드 쿼리 + 덧셈 제약' },
  { lines: [20, 23] as [number, number], color: 'amber' as const, note: '스택 팝/푸시 — RwTable 룩업' },
  { lines: [25, 33] as [number, number], color: 'violet' as const, note: '상태 전환: pc/stack/gas' },
];

export const busMappingAnnotations = [
  { lines: [1, 2] as [number, number], color: 'sky' as const, note: 'bus-mapping — 트레이스 → 회로' },
  { lines: [4, 10] as [number, number], color: 'emerald' as const, note: 'assign에서 실제 값 기입' },
  { lines: [12, 16] as [number, number], color: 'amber' as const, note: '전체 파이프라인: 트레이스 → 증명' },
];

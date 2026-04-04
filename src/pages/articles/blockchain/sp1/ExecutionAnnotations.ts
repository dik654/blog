export const executorAnnotations = [
  { lines: [2, 9] as [number, number], color: 'sky' as const, note: 'Executor 필드 — ELF + 상태 + 추적' },
];

export const instructionAnnotations = [
  { lines: [2, 8] as [number, number], color: 'sky' as const, note: 'Instruction 구조체 — opcode + 피연산자' },
  { lines: [10, 18] as [number, number], color: 'emerald' as const, note: '피연산자 읽기 — 즉시값 vs 레지스터' },
  { lines: [20, 24] as [number, number], color: 'amber' as const, note: '연산 수행 — opcode별 분기' },
  { lines: [27, 29] as [number, number], color: 'violet' as const, note: '결과 저장 + PC 증가' },
];

export const syscallAnnotations = [
  { lines: [2, 10] as [number, number], color: 'sky' as const, note: '내장 시스템 콜 코드' },
  { lines: [12, 14] as [number, number], color: 'emerald' as const, note: 'Guest에서 자동 프리컴파일 대체' },
];

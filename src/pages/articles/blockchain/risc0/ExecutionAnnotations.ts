export const pipelineAnnotations = [
  { lines: [1, 9] as [number, number], color: 'sky' as const, note: '1단계: Executor — 추적 생성' },
  { lines: [11, 16] as [number, number], color: 'emerald' as const, note: '2단계: Prover — 재귀 압축 증명' },
];

export const segmentAnnotations = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: '세그먼트 분할 크기 설정' },
  { lines: [6, 16] as [number, number], color: 'emerald' as const, note: 'Segment 구조체 — 상태 + I/O' },
  { lines: [18, 19] as [number, number], color: 'amber' as const, note: '연결 증명 — 재귀 검증' },
];

export const ioAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'Host → Guest: stdin (비공개)' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'Guest → Host: Journal (공개)' },
  { lines: [11, 12] as [number, number], color: 'amber' as const, note: 'stdout — 디버그용' },
  { lines: [14, 20] as [number, number], color: 'violet' as const, note: 'ECALL 시스템 콜 통신' },
];

export const memoryAnnotations = [
  { lines: [1, 4] as [number, number], color: 'sky' as const, note: '주소 공간 레이아웃' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: '페이지 테이블 — 머클 트리 관리' },
  { lines: [11, 12] as [number, number], color: 'amber' as const, note: '메모리 한계: ~512MB' },
];

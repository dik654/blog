export const nifsAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'NIFS 구조체 — comm_T가 유일한 증거' },
  { lines: [19, 22] as [number, number], color: 'emerald' as const, note: '랜덤 오라클 — 도메인 분리' },
  { lines: [24, 27] as [number, number], color: 'amber' as const, note: '교차항 T 계산 + 커밋' },
  { lines: [32, 34] as [number, number], color: 'violet' as const, note: '선형 폴딩 — U/W 결합' },
];

export const proveStepAnnotations = [
  { lines: [4, 9] as [number, number], color: 'sky' as const, note: '1단계: 보조 회로 폴딩 (E2)' },
  { lines: [11, 17] as [number, number], color: 'emerald' as const, note: '2단계: 주 회로 합성 (E1)' },
  { lines: [19, 24] as [number, number], color: 'amber' as const, note: '3단계: 주 회로 폴딩' },
  { lines: [29, 32] as [number, number], color: 'violet' as const, note: '상태 업데이트 — 다음 스텝으로' },
  { lines: [35, 37] as [number, number], color: 'rose' as const, note: '최종 CompressedSNARK — 수 KB' },
];

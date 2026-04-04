export const batchedAnnotations = [
  { lines: [9, 12] as [number, number], color: 'sky' as const, note: '초기 클레임 기록' },
  { lines: [14, 15] as [number, number], color: 'emerald' as const, note: '배치 계수 α_i 샘플링' },
  { lines: [17, 22] as [number, number], color: 'amber' as const, note: '클레임 스케일링 + 초기 배치' },
  { lines: [24, 30] as [number, number], color: 'violet' as const, note: '라운드별 Sumcheck 반복' },
];

export const stage1Annotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'Spartan — R1CS → Sumcheck 환원' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: 'UniSkip — 첫 라운드 16x 가속' },
  { lines: [13, 16] as [number, number], color: 'amber' as const, note: '나머지 라운드 스트리밍 처리' },
];

export const stage2Annotations = [
  { lines: [3, 15] as [number, number], color: 'sky' as const, note: '5개 Sumcheck 인스턴스 동시 배치' },
  { lines: [17, 17] as [number, number], color: 'emerald' as const, note: '배치 Sumcheck 실행' },
  { lines: [19, 21] as [number, number], color: 'amber' as const, note: 'Stage 3~8: 클레임 감소 + Dory PCS' },
];

export const crateAnnotations = [
  { lines: [2, 10] as [number, number], color: 'sky' as const, note: 'zkvm/ — Prover + 칩 + RAM' },
  { lines: [11, 13] as [number, number], color: 'emerald' as const, note: 'subprotocols/ — Sumcheck 배치' },
  { lines: [14, 15] as [number, number], color: 'amber' as const, note: 'poly/ — Dory 커밋' },
  { lines: [18, 20] as [number, number], color: 'violet' as const, note: '기본 설정: BN254 + Dory PCS' },
];

export const lassoAnnotations = [
  { lines: [3, 13] as [number, number], color: 'sky' as const, note: 'LookupTables — 명령어별 룩업 테이블' },
  { lines: [15, 17] as [number, number], color: 'emerald' as const, note: '8비트 분해 — 희소 MLE 표현' },
  { lines: [19, 22] as [number, number], color: 'amber' as const, note: 'InstructionLookup — 인덱스/출력 매핑' },
];

export const proofAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'Dory 다변량 커밋' },
  { lines: [5, 7] as [number, number], color: 'emerald' as const, note: 'Stage 1: Spartan Outer Sumcheck' },
  { lines: [8, 10] as [number, number], color: 'amber' as const, note: 'Stage 2: RAM/Instruction 결합' },
  { lines: [11, 17] as [number, number], color: 'violet' as const, note: 'Stage 3~7 + 공동 개구 증명' },
];

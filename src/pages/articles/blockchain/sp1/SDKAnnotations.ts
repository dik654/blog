export const proofTypeAnnotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: '키 설정' },
  { lines: [7, 8] as [number, number], color: 'emerald' as const, note: 'Core STARK — 개발/테스트용' },
  { lines: [10, 11] as [number, number], color: 'amber' as const, note: 'Compressed — 재귀 압축' },
  { lines: [13, 17] as [number, number], color: 'violet' as const, note: 'Groth16/PLONK — 온체인 검증용' },
];

export const pipelineAnnotations = [
  { lines: [4, 8] as [number, number], color: 'sky' as const, note: '1단계: Core — 세그먼트별 STARK' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: '2단계: Compress — STARK 압축' },
  { lines: [15, 17] as [number, number], color: 'amber' as const, note: '3단계: Shrink — BN254 변환' },
  { lines: [19, 20] as [number, number], color: 'violet' as const, note: '4단계: Wrap — 래핑' },
  { lines: [22, 24] as [number, number], color: 'rose' as const, note: '5단계: Groth16 — 최종 SNARK' },
];

export const solidityAnnotations = [
  { lines: [2, 7] as [number, number], color: 'sky' as const, note: 'ISP1Verifier — 검증 인터페이스' },
  { lines: [10, 18] as [number, number], color: 'emerald' as const, note: '앱 컨트랙트 — 증명 제출 + 검증' },
];

export const networkAnnotations = [
  { lines: [1, 2] as [number, number], color: 'sky' as const, note: '환경 변수로 네트워크 선택' },
  { lines: [7, 11] as [number, number], color: 'emerald' as const, note: '성능 비교: CPU/GPU/Network' },
];

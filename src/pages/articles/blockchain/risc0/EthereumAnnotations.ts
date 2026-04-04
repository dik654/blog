export const verifierAnnotations = [
  { lines: [2, 8] as [number, number], color: 'sky' as const, note: 'IRiscZeroVerifier — 검증 인터페이스' },
  { lines: [10, 21] as [number, number], color: 'emerald' as const, note: 'VerifierRouter — 버전별 라우팅' },
  { lines: [23, 33] as [number, number], color: 'amber' as const, note: 'EmergencyStop — 취약점 발견 시 중단' },
];

export const appAnnotations = [
  { lines: [2, 8] as [number, number], color: 'sky' as const, note: '컨트랙트 설정 — verifier + imageId' },
  { lines: [10, 18] as [number, number], color: 'emerald' as const, note: '증명 제출 → 검증 → 상태 업데이트' },
];

export const steelAnnotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: '이더리움 상태 환경 읽기' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: 'ERC-20 뷰 콜 실행' },
  { lines: [12, 13] as [number, number], color: 'amber' as const, note: '검증 결과 Journal에 기록' },
];

export const aggregationAnnotations = [
  { lines: [1, 3] as [number, number], color: 'sky' as const, note: '가스 비용 비교: 개별 vs 집계' },
  { lines: [5, 13] as [number, number], color: 'emerald' as const, note: 'MMR 기반 증명 집계' },
];

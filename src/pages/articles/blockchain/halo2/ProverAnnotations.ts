export const phase1Annotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: 'VK 해시 → 도메인 분리' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '어드바이스 열 합성 + 블라인딩' },
  { lines: [12, 16] as [number, number], color: 'amber' as const, note: 'Lagrange → KZG 커밋' },
  { lines: [18, 20] as [number, number], color: 'violet' as const, note: 'NTT — extended coset 변환' },
];

export const phase2Annotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'θ 도전값 — Plookup 선형 결합' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'β, γ — 그랜드 프로덕트 도전값' },
  { lines: [11, 15] as [number, number], color: 'amber' as const, note: '퍼뮤테이션 & Plookup 그랜드 프로덕트' },
  { lines: [17, 21] as [number, number], color: 'violet' as const, note: 'y — 소멸 다항식 h(X) 구성' },
];

export const phase5Annotations = [
  { lines: [1, 2] as [number, number], color: 'sky' as const, note: 'x — 개구 지점 샘플링' },
  { lines: [4, 6] as [number, number], color: 'emerald' as const, note: '열 다항식 평가 기록' },
  { lines: [8, 12] as [number, number], color: 'amber' as const, note: 'SHPLONK — 단일 KZG 증명 압축' },
];

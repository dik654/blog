export const NODES = [
  { label: 'Circuit', sub: 'configure + synthesize', color: '#a855f7', x: 42 },
  { label: 'KZG SRS', sub: 'τ 기반 파라미터', color: '#3b82f6', x: 32, y: 62 },
  { label: 'VK', sub: '검증 키', color: '#10b981', x: 120 },
  { label: 'PK', sub: '증명 키', color: '#f59e0b', x: 200 },
  { label: 'Prove', sub: 'SHPLONK', color: '#ec4899', x: 280 },
  { label: 'Verify', sub: '페어링 검증', color: '#6366f1', x: 360 },
];

export const BODIES = [
  'Circuit 트레이트 구현과 KZG SRS를 준비합니다.',
  'ConstraintSystem 컴파일 → 고정 열 커밋 + 퍼뮤테이션 VK 생성.',
  'VK에 도메인 다항식(l0, l_blind, l_last)을 추가합니다.',
  '어드바이스 커밋 → θ,β,γ 도전값 → 소멸 다항식 → SHPLONK 개구.',
  'KZG 페어링으로 다항식 커밋과 개구 증명을 검증합니다.',
];

export const STEPS = [
  { label: '회로 & 파라미터 준비' },
  { label: 'keygen_vk — 검증 키' },
  { label: 'keygen_pk — 증명 키' },
  { label: 'create_proof' },
  { label: 'verify_proof' },
];

export const EDGES = [
  { x1: 56, y1: 30, x2: 96, y2: 30, color: '#a855f7', minStep: 1 },
  { x1: 56, y1: 62, x2: 96, y2: 38, color: '#3b82f6', minStep: 1 },
  { x1: 144, y1: 30, x2: 176, y2: 30, color: '#10b981', minStep: 2 },
  { x1: 224, y1: 30, x2: 256, y2: 30, color: '#f59e0b', minStep: 3 },
  { x1: 56, y1: 36, x2: 256, y2: 36, color: '#a855f760', minStep: 3, dashed: true },
  { x1: 304, y1: 30, x2: 336, y2: 30, color: '#ec4899', minStep: 4 },
  { x1: 144, y1: 24, x2: 336, y2: 24, color: '#10b98160', minStep: 4, dashed: true },
];

export const STEPS = [
  { label: 'RLP 인코딩 규칙 — 첫 바이트가 타입과 길이를 결정' },
  { label: '단일 바이트 (0x00~0x7f) — 그대로 출력' },
  { label: '짧은 문자열 (<=55B) — 0x80 + 길이 접두사' },
  { label: '리스트 인코딩 — 0xc0 + 전체 길이 접두사' },
  { label: 'derive 매크로 — 컴파일 타임에 인코더 자동 생성' },
  { label: 'encode_fixed_size — 스택에서 힙 할당 없이 인코딩' },
];

export const C = {
  byte: '#6366f1', str: '#10b981', list: '#f59e0b',
  macro: '#8b5cf6', stack: '#ef4444', dim: '#94a3b8',
};

export const STEP_REFS: Record<number, string> = {
  0: 'rlp-header', 1: 'rlp-header', 2: 'rlp-header',
  3: 'rlp-header', 4: 'rlp-derive', 5: 'rlp-fixed',
};

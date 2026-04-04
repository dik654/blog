export const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export const STEPS = [
  {
    label: '왜 Montgomery? — 나눗셈 없는 모듈러 곱셈',
    body: 'a*R mod p 형태로 저장하면 "R로 나누기"가 비트 시프트 — 나눗셈 없이 곱셈 가능',
  },
  {
    label: 'Montgomery form 변환 — from_raw / to_repr',
    body: 'from_raw(a) = mont_mul(a, R^2) → a*R, to_repr은 REDC로 역변환',
  },
  {
    label: 'Schoolbook 4x4 곱셈 → 8-limb 중간 결과',
    body: '4x4 limb 곱셈 = 16회 mac → [u64; 8] 512비트 중간 결과 생성',
  },
  {
    label: 'REDC — 8-limb을 4-limb으로 축소',
    body: '4회 반복으로 하위 limb을 0으로 만들어 8-limb을 4-limb으로 축소',
  },
  {
    label: 'inv / pow — mont_mul 하나로 전부 구현',
    body: 'square/pow/inv 모두 mont_mul 기반 — inv는 Fermat(a^{p-2}) 한 줄',
  },
];

export const STEP_REFS = ['mont-mul', 'fp-struct', 'mont-mul', 'mont-mul', 'fp-inv-pow'];
export const STEP_LABELS = ['fp.rs — Montgomery 동기', 'fp.rs — from_raw / to_repr', 'fp.rs — schoolbook 곱셈', 'fp.rs — REDC 축소', 'fp.rs — inv / pow'];
